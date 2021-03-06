import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import brLocale from 'date-fns/locale/pt-BR';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { IMaskInput } from 'react-imask';
import PropTypes from 'prop-types';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Axios from 'axios';
import './index.css';

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref,) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000.000.000-00"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

function FormEmployee() {
  
  // Variaveis 
  const [name, setName] = useState(''); 
  const [birthDate, setBirthDate] = useState(new Date('2014-08-18'));
  const [numRg, setNumRg] = useState('');
  const [numCpf, setNumCpf] = useState('');
  const [nameMother, setNameMother] = useState('');  
  const [stateSnackbar, setStateSnackbar] = React.useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'left',
    message: '',
    severity: "error"
  });
  const { vertical, horizontal, open, message, severity } = stateSnackbar;
  
  // Função para submeter o formulario de cadastro de funcionario para api
  const setSubmitEmployee = (e) => {
    e.preventDefault(); 
    Axios.post('http://localhost:3001/api/insertEmployee', {  // Chamada da API
      nome: name, 
      data_nascimento: birthDate, 
      num_rg: numRg, 
      num_cpf: numCpf, 
      nome_mae: nameMother, 
    }).then(() => {
      setStateSnackbar({
        open: true,
        vertical: 'bottom',
        horizontal: 'right',
        message: 'Funcionario cadastrado!',
        severity: "success"
      });
      setTimeout(
        function() {
          window.location.reload();
        }
        .bind(this),
        1000
      );
    });
  };

  const [values, setValues] = React.useState({
    textmask: '(100) 000-0000',
    numberformat: '1320',
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form className="list-inputs" onSubmit={setSubmitEmployee}>
      <TextField name="nome" label="Nome" variant="outlined" required onChange={(e) => {setName(e.target.value)}}/>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={brLocale}>
        <DatePicker
          label="Data de Nascimento"
          name="data_nascimento"
          value={birthDate}
          locale={brLocale}
          required
          onChange={(newDate) => {setBirthDate(newDate)}}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <TextField type="text" name="num_rg" label="Identidade" variant="outlined" required onChange={(e) => {setNumRg(e.target.value)}}/>
      <TextField type="text" name="num_cpf" label="CPF" variant="outlined" required onChange={(e) => {setNumCpf(e.target.value)}}/>
      <TextField type="text" name="nome_mae" label="Nome da Mãe" variant="outlined" required onChange={(e) => {setNameMother(e.target.value)}}/>
      <Button type="submit" variant="contained">Cadastrar</Button>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={6000}
      >
        <Alert severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <FormControl variant="standard">
        <InputLabel htmlFor="formatted-text-mask-input">react-imask</InputLabel>
        <Input
          value={values.textmask}
          onChange={handleChange}
          name="textmask"
          id="formatted-text-mask-input"
          inputComponent={TextMaskCustom}
        />
      </FormControl>
    </form>
  );
}

export default FormEmployee;

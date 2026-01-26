import React, {
  Fragment,
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';
import AuthContext from '../../../store/auth-context';
import { api, config } from '../../../Constants';
import {
  validateNameLength,
  validateLastNameLength,
  validatePhoneNumber,
  validateAddressLenght,
  validateRegisterNumberLength,
  validateCiNumber,
} from '../../../Validations';

import {
  Grid,
  TextField,
  Button,
  FormControl,
  Box,
  Typography,
} from '@mui/material';
import classes from '../../UI/Listado/Listado.module.css';

import PreviewAgregarArquitecto from './PreviewAgregarArquitecto';
import ModalAgregarArquitecto from './ModalAgregarArquitecto';
import ListadoHeader from '../../UI/Listado/ListadoHeader';

function AgregarArquitecto(props) {
  const url = config.url.HOST + api.API_URL_ARQUITECTOS;
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const [formIsValid, setFormIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isForm, setIsForm] = useState(true);
  const [title, setTitle] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [errorFieldMessage, setErrorFieldMessage] = useState('');

  const nameReducer = (state, action) => {
    if (action.type === 'INPUT_FOCUS') {
      return {
        value: state.value,
        isValid: validateNameLength(state.value),
        feedbackText: 'Ingrese nombre valido',
      };
    }
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validateNameLength(action.val),
        feedbackText: 'Ingrese nombre valido',
      };
    }
    return { value: '', isValid: false };
  };
  const lastNameReducer = (state, action) => {
    if (action.type === 'INPUT_FOCUS') {
      return {
        value: state.value,
        isValid: validateLastNameLength(state.value),
        feedbackText: 'Ingrese apellido(s) valido(s)',
      };
    }
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validateLastNameLength(action.val),
        feedbackText: 'Ingrese apellido(s) valido(s)',
      };
    }
    return { value: '', isValid: false };
  };
  const phoneNumberReducer = (state, action) => {
    if (action.type === 'INPUT_FOCUS') {
      return {
        value: state.value,
        isValid: validatePhoneNumber(state.value),
        feedbackText: 'Ingrese numero valido',
      };
    }
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validatePhoneNumber(action.val),
        feedbackText: 'Ingrese numero valido',
      };
    }
    if (action.type === 'INPUT_ERROR') {
      return {
        value: state.value,
        isValid: false,
        feedbackText: action.errorMessage,
      };
    }
    return { value: '', isValid: false };
  };
  const addressReducer = (state, action) => {
    if (action.type === 'INPUT_FOCUS') {
      return {
        value: state.value,
        isValid: validateAddressLenght(state.value),
        feedbackText: 'Ingrese un una dirección valida',
      };
    }
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validateAddressLenght(action.val),
        feedbackText: 'Ingrese un una dirección valida',
      };
    }
    return { value: '', isValid: false };
  };
  const registerNumReducer = (state, action) => {
    if (action.type === 'INPUT_FOCUS') {
      return {
        value: state.value,
        isValid: validateRegisterNumberLength(state.value),
        feedbackText: 'Ingrese numero valido',
      };
    }
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validateRegisterNumberLength(action.val),
        feedbackText: 'Ingrese numero valido',
      };
    }
    if (action.type === 'INPUT_ERROR') {
      return {
        value: state.value,
        isValid: false,
        feedbackText: action.errorMessage,
      };
    }
    return { value: '', isValid: false };
  };
  const ciReducer = (state, action) => {
    if (action.type === 'INPUT_FOCUS') {
      return {
        value: state.value,
        isValid: validateCiNumber(state.value),
        feedbackText: 'Ingrese numero valido',
      };
    }
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validateCiNumber(action.val),
        feedbackText: 'Ingrese numero valido',
      };
    }
    if (action.type === 'INPUT_ERROR') {
      return {
        value: state.value,
        isValid: false,
        feedbackText: action.errorMessage,
      };
    }
    return { value: '', isValid: false };
  };

  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: props.parsedList.nombre ? props.parsedList.nombre : '',
    isValid: true,
    feedbackText: '',
  });
  const [lastNameState, dispatchLastName] = useReducer(lastNameReducer, {
    value: props.parsedList.apellido ? props.parsedList.apellido : '',
    isValid: true,
    feedbackText: '',
  });
  const [phoneNumberState, dispatchPhoneNumber] = useReducer(
    phoneNumberReducer,
    {
      value: props.parsedList.telefono ? props.parsedList.telefono : '',
      isValid: true,
      feedbackText: '',
    }
  );
  const [ciState, dispatchCiNumber] = useReducer(ciReducer, {
    value: props.parsedList.ci ? props.parsedList.ci : '',
    isValid: true,
    feedbackText: '',
  });
  const [addressState, dispatchAddress] = useReducer(addressReducer, {
    value: props.parsedList.direccion ? props.parsedList.direccion : '',
    isValid: true,
    feedbackText: '',
  });
  const [registerNumState, dispatchRegisterNum] = useReducer(
    registerNumReducer,
    {
      value: props.parsedList.numeroRegistro
        ? props.parsedList.numeroRegistro
        : '',
      isValid: true,
      feedbackText: '',
    }
  );

  const { isValid: nameIsValid } = nameState;
  const { isValid: lastNameIsValid } = lastNameState;
  const { isValid: phoneNumberIsValid } = phoneNumberState;
  const { isValid: ciIsValid } = ciState;
  const { isValid: addressIsValid } = addressState;
  const { isValid: registerNumIsValid } = registerNumState;

  const nameInputChangeHandler = e => {
    dispatchName({ type: 'INPUT_CHANGE', val: e.target.value });
  };

  const lastNameInputChangeHandler = e => {
    dispatchLastName({ type: 'INPUT_CHANGE', val: e.target.value });
  };

  const phoneNumberInputChangeHandler = e => {
    dispatchPhoneNumber({ type: 'INPUT_CHANGE', val: e.target.value });
  };

  const ciInputChangeHandler = e => {
    dispatchCiNumber({ type: 'INPUT_CHANGE', val: e.target.value });
  };

  const addresInputChangeHandler = e => {
    dispatchAddress({ type: 'INPUT_CHANGE', val: e.target.value });
  };

  const registerNumInputChangeHandler = e => {
    dispatchRegisterNum({ type: 'INPUT_CHANGE', val: e.target.value });
  };

  const handlerCancel = () => {
    if (isForm) {
      window.location.reload(true);
    } else {
      setIsForm(!isForm);
    }
  };

  const handleNext = async e => {
    e.preventDefault();
    if (isForm && !props.editArquitecto) {
      setIsForm(!isForm);
    }
    if (formIsValid && !isForm && !props.editArquitecto) {
      handleSubmit();
    }
    if (isForm && props.editArquitecto) {
      handleEdit();
    }
  };

  const handleSubmit = async e => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          name: nameState.value,
          last_name: lastNameState.value,
          address: addressState.value,
          register_number: registerNumState.value,
          phone_number: phoneNumberState.value,
          ci: ciState.value,
        }),
        headers: {
          Authorization: `Token ${authContext.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setIsForm(!isForm);

        if (data.register_number) {
          dispatchRegisterNum({ type: 'INPUT_ERROR', errorMessage: data.register_number[0] });
        }
        if (data.phone_number) {
          dispatchPhoneNumber({ type: 'INPUT_ERROR', errorMessage: data.phone_number[0] });
        }
        if (data.ci) {
          dispatchCiNumber({ type: 'INPUT_ERROR', errorMessage: data.ci[0] });
        }
      } else {
        setIsLoading(true);
        setShowModal(true);
      }
    } catch (e) {
      setIsLoading(false);
      setMessage(e.message);
    }
  };
  const handleEdit = async e => {
    try {
      const response = await fetch(`${url}${props.parsedList.id}/`, {
        method: 'PUT',
        body: JSON.stringify({
          name: nameState.value,
          last_name: lastNameState.value,
          address: addressState.value,
          register_number: registerNumState.value,
          phone_number: phoneNumberState.value,
          ci: ciState.value,
        }),

        headers: {
          Authorization: `Token ${authContext.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        console.log('Error response:', data);

        // Only dispatch errors for fields that have errors
        if (data.register_number) {
          dispatchRegisterNum({ type: 'INPUT_ERROR', errorMessage: data.register_number[0] });
        }
        if (data.phone_number) {
          dispatchPhoneNumber({ type: 'INPUT_ERROR', errorMessage: data.phone_number[0] });
        }
        if (data.ci) {
          dispatchCiNumber({ type: 'INPUT_ERROR', errorMessage: data.ci[0] });
        }
      } else {
        setIsLoading(true);
        setShowModal(true);
      }
    } catch (e) {
      setIsLoading(false);
      setMessage(e.message);
    }
  };
  useEffect(() => {
    if (
      nameState.value &&
      lastNameState.value &&
      addressState.value &&
      registerNumState.value &&
      phoneNumberState.value &&
      ciState.value
    ) {
      setFormIsValid(
        nameIsValid &&
        lastNameIsValid &&
        addressIsValid &&
        registerNumIsValid &&
        phoneNumberIsValid &&
        ciIsValid
      );
      setDisabled(!formIsValid);
    } else {
      setDisabled(true);
    }
    if (props.editArquitecto) {
      setDisabled(false);
    }
  }, [
    nameIsValid,
    lastNameIsValid,
    addressIsValid,
    registerNumIsValid,
    phoneNumberIsValid,
    ciIsValid,
    formIsValid,
    disabled,
  ]);

  useEffect(() => {
    setTitle(props.editArquitecto ? 'Editar Arquitecto' : 'Agregar Arquitecto');
    if (props.editArquitecto) {
      setButtonText('Guardar Cambios');
      setDisabled(false);
    } else {
      setButtonText(!isForm ? 'Finalizar' : 'Siguiente');
    }
  }, [props, isForm]);

  return (
    <>
      <Fragment>
        <ListadoHeader title={title} text={title} visible={false} />
        {isForm ? (
          <div className={classes.listContainer}>
            <FormControl fullWidth onSubmit={handleSubmit}>
              <Box mt={4}>
                <h6>1. Datos personales</h6>
                <Grid container spacing={2} mt={1} mb={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Nombres"
                      variant="outlined"
                      onChange={nameInputChangeHandler}
                      value={nameState.value}
                      error={!nameIsValid}
                      helperText={!nameIsValid ? nameState.feedbackText : ''}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Apellidos"
                      variant="outlined"
                      onChange={lastNameInputChangeHandler}
                      value={lastNameState.value}
                      error={!lastNameIsValid}
                      helperText={
                        !lastNameIsValid ? lastNameState.feedbackText : ''
                      }
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label="CI"
                      variant="outlined"
                      onChange={ciInputChangeHandler}
                      value={ciState.value}
                      error={!ciIsValid}
                      helperText={!ciIsValid ? ciState.feedbackText : ''}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <div>
                <h6>2. Datos de contacto </h6>
                <Grid container spacing={2} mt={1} mb={2}>
                  <Grid size={{ xs: 6, sm: 6 }}>
                    <TextField
                      label="Dirección"
                      variant="outlined"
                      onChange={addresInputChangeHandler}
                      value={addressState.value}
                      error={!addressIsValid}
                      helperText={
                        !addressIsValid ? addressState.feedbackText : ''
                      }
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label="Teléfono"
                      variant="outlined"
                      onChange={phoneNumberInputChangeHandler}
                      value={phoneNumberState.value}
                      error={!phoneNumberIsValid}
                      helperText={
                        !phoneNumberIsValid ? phoneNumberState.feedbackText : ''
                      }
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </div>
              <div mt={2}>
                <h6>3. Datos profesionales </h6>
                <Grid container spacing={2} mt={1} mb={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label="Nro. de Registro"
                      variant="outlined"
                      value={registerNumState.value}
                      onChange={registerNumInputChangeHandler}
                      error={!registerNumIsValid}
                      helperText={
                        !registerNumIsValid ? registerNumState.feedbackText : ''
                      }
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </div>
            </FormControl>
            <Box
              mt={2}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Button
                id="cancelar_button"
                variant="outlined"
                onClick={handlerCancel}
                style={{ textTransform: 'none', width: '150px' }}
                disabled={isLoading}
              >
                {!isForm ? 'Atrás' : 'Cancelar'}
              </Button>
              <Button
                variant="contained"
                style={{ textTransform: 'none', width: '150px' }}
                disabled={disabled || isLoading}
                onClick={handleNext}
              >
                {buttonText}
              </Button>
              {isForm && (
                <Typography
                  ml={3}
                  style={{
                    color: '#6C757D',
                    fontStyle: 'italic',
                    fontSize: '14px',
                  }}
                >
                  Los campos con (*) son requeridos para avanzar en el
                  formulario.{' '}
                </Typography>
              )}
            </Box>
          </div>
        ) : (
          <div className={classes.listContainer}>
            <PreviewAgregarArquitecto
              name={nameState.value}
              lastName={lastNameState.value}
              address={addressState.value}
              registerNumber={registerNumState.value}
              phoneNumber={phoneNumberState.value}
              ci={ciState.value}
            />
            <Box
              mt={2}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Button
                id="cancelar_button"
                variant="outlined"
                onClick={handlerCancel}
                style={{ textTransform: 'none', width: '150px' }}
                disabled={isLoading}
              >
                {!isForm ? 'Atrás' : 'Cancelar'}
              </Button>
              <Button
                variant="contained"
                style={{ textTransform: 'none', width: '150px' }}
                disabled={disabled || isLoading}
                onClick={handleNext}
              >
                {buttonText}
              </Button>
              {isForm && (
                <Typography
                  ml={3}
                  style={{
                    color: '#6C757D',
                    fontStyle: 'italic',
                    fontSize: '14px',
                  }}
                >
                  Los campos con (*) son requeridos para avanzar en el
                  formulario.{' '}
                </Typography>
              )}
            </Box>
          </div>
        )}
        {showModal && (
          <ModalAgregarArquitecto editArquitecto={props.editArquitecto} />
        )}
      </Fragment>
    </>
  );
}

export default AgregarArquitecto;

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
  validateCosto,
  validatePercentageVisa,
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

import PreviewAgregarProyecto from './PreviewAgregarProyecto';
import ModalAgregarProyecto from './ModalAgregarProyecto';
import ListadoHeader from '../../UI/Listado/ListadoHeader';

function AgregarProyecto(props) {
  const url = config.url.HOST + api.API_URL_PROYECTOS;
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const [formIsValid, setFormIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isForm, setIsForm] = useState(true);
  const [title, setTitle] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [disabled, setDisabled] = useState(true);

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
    if (action.type === 'INPUT_ERROR') {
      return {
        value: state.value,
        isValid: false,
        feedbackText: action.errorMessage,
      };
    }
    return { value: '', isValid: false };
  };
  const costReducer = (state, action) => {
    if (action.type === 'INPUT_FOCUS') {
      return {
        value: state.value,
        isValid: validateCosto(state.value),
        feedbackText: 'Ingrese numero valido',
      };
    }
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validateCosto(action.val),
        feedbackText: 'Ingrese numero valido',
      };
    }
    return { value: '', isValid: false };
  };
  const percentageVisaReducer = (state, action) => {
    if (action.type === 'INPUT_FOCUS') {
      return {
        value: state.value,
        isValid: validatePercentageVisa(state.value),
        feedbackText: 'Ingrese un porcentaje valido',
      };
    }
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validatePercentageVisa(action.val),
        feedbackText: 'Ingrese un porcentaje valido',
      };
    }
    return { value: '', isValid: false };
  };

  const [nameState, dispatchName] = useReducer(nameReducer, {
    value: props.parsedList.nombreProyecto
      ? props.parsedList.nombreProyecto
      : '',
    isValid: true,
    feedbackText: '',
  });
  const [costState, dispatchCost] = useReducer(costReducer, {
    value: props.parsedList.costo ? props.parsedList.costo : '',
    isValid: true,
    feedbackText: '',
  });
  const [percentageVisaState, dispatchPercentageVisa] = useReducer(
    percentageVisaReducer,
    {
      value: props.parsedList.porcentajeVisado
        ? props.parsedList.porcentajeVisado
        : '',
      isValid: true,
      feedbackText: '',
    }
  );

  const { isValid: nameIsValid } = nameState;
  const { isValid: costIsValid } = costState;
  const { isValid: percentageVisaIsValid } = percentageVisaState;

  const nameInputChangeHandler = e => {
    dispatchName({ type: 'INPUT_CHANGE', val: e.target.value });
  };
  const costInputChangeHandler = e => {
    dispatchCost({ type: 'INPUT_CHANGE', val: e.target.value });
  };
  const percentageVisaInputChangeHandler = e => {
    dispatchPercentageVisa({ type: 'INPUT_CHANGE', val: e.target.value });
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
    if (isForm && !props.editProyecto) {
      setIsForm(!isForm);
    }
    if (formIsValid && !isForm && !props.editProyecto) {
      handleSubmit();
    }
    if (isForm && props.editProyecto) {
      handleEdit();
    }
  };

  const handleSubmit = async e => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          name: nameState.value,
          cost: costState.value,
          percentaje_visa: percentageVisaState.value,
        }),
        headers: {
          Authorization: `Token ${authContext.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setIsForm(!isForm);
        if (data.name) {
          dispatchName({ type: 'INPUT_ERROR', errorMessage: data.name[0] });
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
          cost: costState.value,
          percentaje_visa: percentageVisaState.value,
        }),

        headers: {
          Authorization: `Token ${authContext.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        console.error(response);
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
    const allFieldsHaveValues =
      nameState.value.trim() !== '' &&
      costState.value.toString().trim() !== '' &&
      percentageVisaState.value.toString().trim() !== '';

    const allFieldsAreValid =
      nameIsValid && costIsValid && percentageVisaIsValid;

    setFormIsValid(allFieldsHaveValues && allFieldsAreValid);
    setDisabled(!(allFieldsHaveValues && allFieldsAreValid));

    if (props.editProyecto) {
      setDisabled(false);
    }
  }, [
    nameState.value,
    costState.value,
    percentageVisaState.value,
    nameIsValid,
    costIsValid,
    percentageVisaIsValid,
    props.editProyecto,
  ]);

  useEffect(() => {
    setTitle(props.editProyecto ? 'Editar Proyecto' : 'Agregar Proyecto');
    if (props.editProyecto) {
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
                <h6>1. Datos del Proyecto</h6>
                <Grid container spacing={2} mt={1} mb={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      label="Nombre"
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
                      label="Costo"
                      variant="outlined"
                      onChange={costInputChangeHandler}
                      value={costState.value}
                      error={!costIsValid}
                      helperText={!costIsValid ? costState.feedbackText : ''}
                      required
                      type="number"
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      label="Porcentaje Visado"
                      variant="outlined"
                      onChange={percentageVisaInputChangeHandler}
                      value={percentageVisaState.value}
                      error={!percentageVisaIsValid}
                      helperText={
                        !percentageVisaIsValid
                          ? percentageVisaState.feedbackText
                          : ''
                      }
                      type="number"
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
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
            <PreviewAgregarProyecto
              name={nameState.value}
              cost={costState.value}
              percentageVisa={percentageVisaState.value}
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
          <ModalAgregarProyecto editProyecto={props.editProyecto} />
        )}
      </Fragment>
    </>
  );
}

export default AgregarProyecto;

import React, {
  Fragment,
  useState,
  useEffect,
  useReducer,
  useContext,
  useCallback,
} from 'react';
import AuthContext from '../../../store/auth-context';
import { api, config } from '../../../Constants';
import dayjs from 'dayjs';

import {
  validateSelectInput,
  validateCosto,
} from '../../../Validations';

import {
  Grid,
  TextField,
  Button,
  FormControl,
  Box,
  Typography,
  Autocomplete,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import classes from '../../UI/Listado/Listado.module.css';

import PreviewAgregarArancel from './PreviewAgregarArancel';
import ModalAgregarArancel from './ModalAgregarArancel';
import ListadoHeader from '../../UI/Listado/ListadoHeader';

function AgregarArancel(props) {
  const urlProyectos = config.url.HOST + api.API_URL_PROYECTOS;
  const urlArquitectos = config.url.HOST + api.API_URL_ARQUITECTOS;
  const urlAranceles = config.url.HOST + api.API_URL_ARANCELES;
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const [formIsValid, setFormIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isForm, setIsForm] = useState(true);
  const [title, setTitle] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [tariffEntries, setTariffEntries] = useState([
    { surface: '', project: '', tariff_amount: '', have_visa: false, isValid: false }
  ]);
  const [architectsOptions, setArchitectsOptions] = useState([]);
  const [projectsOptions, setProjectsOptions] = useState([]);
  const [tariffDate, setTariffDate] = useState(
    props.parsedList.fecha_arancel ? dayjs(props.parsedList.fecha_arancel) : dayjs()
  );

  const validateEntry = (entry) => {
    return (
      validateCosto(entry.surface) &&
      validateCosto(entry.tariff_amount) &&
      validateSelectInput(entry.project)
    );
  };

  // Add Tariff Entry
  const addTariffEntry = () => {
    setTariffEntries(prev => [
      ...prev,
      { surface: '', project: '', tariff_amount: '', have_visa: false, isValid: false }
    ]);
  };

  // Remove Tariff Entry
  const removeTariffEntry = (indexToRemove) => {
    const updatedEntries = tariffEntries.filter((_, index) => index !== indexToRemove);
    const total = updatedEntries.reduce((sum, entry) => parseFloat(entry.tariff_amount) - sum || 0, 0);
    dispatchTotalTariff({ type: 'INPUT_CHANGE', val: total });
    setTariffEntries(prevEntries =>
      prevEntries.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    if (props.parsedlist) {
      if (props.parsedlist.tariff && props.parsedlist.tariff.length > 0) {
        const formattedEntries = props.parsedlist.tariff.map(entry => ({
          surface: entry.surface || '',
          project: entry.project || '',
          tariff_amount: entry.tariff_amount || '',
          have_visa: entry.have_visa || false,
          isValid: validateEntry(entry)
        }));
        setTariffEntries(formattedEntries);
      }

      if ((!props.parsedlist.tariff || props.parsedlist.tariff.length === 0) && tariffEntries.length === 0) {
        setTariffEntries([{ surface: '', project: '', tariff_amount: '', have_visa: false, isValid: false }]);
      }
    }
  }, [props.parsedlist]);


  const handleEntryChange = (index, field, value) => {
    const updated = [...tariffEntries];
    updated[index][field] = field === 'have_visa' ? value.target.checked : value;
    updated[index].isValid = validateEntry(updated[index]);

    if (field === 'surface') {
      let partialTariff = 0;
      let totalTariff = 0;
      for (const entry of updated) {
        const partialAmount = parseFloat(entry.project.cost) || 0;
        const surface = parseFloat(entry.surface) || 0;
        partialTariff = partialAmount + surface;
        entry.tariff_amount = partialTariff;
        totalTariff += partialTariff;
      }
      // Update total tariff state
      dispatchTotalTariff({ type: 'INPUT_CHANGE', val: totalTariff });
    }

    setTariffEntries(updated);
  };

  const architectReducer = (state, action) => {
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validateSelectInput(action.val),
        feedbackText: 'Ingrese un arquitecto valido',
      };
    }
    return { value: '', isValid: false };
  };

  const totalTariffReducer = (state, action) => {
    if (action.type === 'INPUT_CHANGE') {
      return {
        value: action.val,
        isValid: validateCosto(action.val),
        feedbackText: 'Ingrese un total de arancel valido',
      };
    }
    return { value: '', isValid: false };
  };

  const [architectState, dispatchArchitect] = useReducer(architectReducer, {
    value: props.parsedList.arquitecto ? props.parsedList.arquitecto : '',
    isValid: true,
    feedbackText: '',
  });

  const [totalTariffState, dispatchTotalTariff] = useReducer(
    totalTariffReducer,
    {
      value: props.parsedList.total_arancel
        ? props.parsedList.total_arancel
        : 0,
      isValid: true,
      feedbackText: '',
    }
  );

  const { isValid: architectIsValid } = architectState;
  const { isValid: totalTariffIsValid } = totalTariffState;

  // Header Handlers
  const architectInputChangeHandler = (e, newValue) => {
    dispatchArchitect({ type: 'INPUT_CHANGE', val: newValue });
  };
  const tariffDateInputChangeHandler = (newValue) => {
    setTariffDate(newValue);
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
    if (isForm && !props.editArancel) {
      setIsForm(!isForm);
    }
    if (formIsValid && !isForm && !props.editArancel) {
      handleSubmit();
    }
    if (isForm && props.editArancel) {
      handleEdit();
    }
  };

  const tariff = tariffEntries.map(entry => ({
    surface: entry.surface,
    project: entry.project,
    tariff_amount: entry.tariff_amount,
    have_visa: entry.have_visa,
  }))

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchArquitectos = async () => {
      try {
        const response = await fetch(urlArquitectos, {
          method: 'GET',
          headers: {
            Authorization: `Token ${authContext.token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch arquitectos');
        }

        const data = await response.json();

        if (isMounted) {
          setArchitectsOptions(data);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          // Handle abort error silently
          return;
        }
        if (isMounted) {
          setError(error.message);
        }
      }
    };

    fetchArquitectos();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [urlArquitectos, authContext.token]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const response = await fetch(urlProyectos, {
          method: 'GET',
          headers: {
            Authorization: `Token ${authContext.token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();

        if (isMounted) {
          setProjectsOptions(data);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          // Handle abort error silently
          return;
        }
        if (isMounted) {
          setError(error.message);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [urlProyectos, authContext.token]);

  const handleSubmit = useCallback(
    async (e) => {
      setIsLoading(true);
      try {
        const response = await fetch(urlAranceles, {
          method: 'POST',
          body: JSON.stringify({
            total_tariff_amount: totalTariffState.value,
            tariff_date: tariffDate.format('YYYY-MM-DD'),
            architect_id: architectState.value.id,
            tariffs_data: tariff.map(t => ({
              project_id: t.project.id,
              surface: t.surface,
              tariff_amount: t.tariff_amount,
              have_visa: t.have_visa
            }))
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
          setShowModal(true);
        }
      } catch (e) {
        setIsLoading(false);
        setMessage(e.message);
      }
    },
    [authContext.token, urlAranceles, tariff]
  );
  const handleEdit = useCallback(
    async e => {
      setIsLoading(true);
      try {
        const response = await fetch(`${urlAranceles}${props.parsedList.id}/`, {
          method: 'PUT',
          body: JSON.stringify({
            total_tariff_amount: totalTariffState.value,
            tariff_date: tariffDate.format('YYYY-MM-DD'),
            architect_id: architectState.value.id,
            tariffs_data: tariff.map(t => ({
              project_id: t.project.id,
              surface: t.surface,
              have_visa: t.have_visa
            }))
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
          setShowModal(true);
        }
      } catch (e) {
        setIsLoading(false);
        setMessage(e.message);
      }
    },
    [
      authContext.token,
      props.parsedList.id,
      architectState.value,
      totalTariffState.value,
      tariffDate,
      tariff,
    ]
  );

  useEffect(() => {
    const allValid = tariffEntries.every(entry => entry.isValid);
    if (
      tariffEntries &&
      architectState.value &&
      totalTariffState.value &&
      tariffDate
    ) {
      setFormIsValid(
        allValid &&
        architectIsValid &&
        totalTariffIsValid
      );
      setDisabled(!formIsValid);
    } else {
      setDisabled(true);
    }
    if (props.editTariff) {
      setDisabled(false);
    }
  }, [
    architectState.value,
    totalTariffState.value,
    tariffEntries,
    architectIsValid,
    totalTariffIsValid,
    tariffDate,
    formIsValid,
    disabled,
  ]);

  useEffect(() => {
    setTitle(props.editTariff ? 'Editar Arancel' : 'Agregar Arancel');
    if (props.editTariff) {
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
                <h6>1. Encabezado</h6>
                <Grid container spacing={2} mt={1} mb={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Autocomplete
                      disablePortal
                      value={architectState.value}
                      options={architectsOptions}
                      getOptionLabel={(option) => (option ? option.name + ' ' + option.last_name || '' : '')}
                      renderInput={(params) => (
                        <TextField {...params} label="Arquitecto" />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.name} {option.last_name}
                        </li>
                      )}
                      onChange={architectInputChangeHandler}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha"
                        value={tariffDate}
                        onChange={tariffDateInputChangeHandler}
                        format="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <TextField
                      type="number"
                      label="Total de Arancel"
                      variant="outlined"
                      value={totalTariffState.value}
                      error={!totalTariffIsValid}
                      helperText={
                        !totalTariffIsValid ? totalTariffState.feedbackText : ''
                      }
                      required
                      disabled
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <div>
                <h6>2. Proyectos </h6>
                <Grid container spacing={2} mt={1} mb={3}>
                  {tariffEntries.map((entry, index) => (
                    <Grid container sx={{ width: '100%' }} spacing={3} key={index}>
                      <Grid size={{ xs: 4, sm: 5 }}>
                        <Autocomplete
                          disablePortal
                          value={entry.project}
                          options={projectsOptions}
                          getOptionLabel={(option) => (option ? option.name || '' : '')}
                          renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                              {option.name}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField {...params} label="Proyecto" />
                          )}
                          onChange={(_, value) => handleEntryChange(index, 'project', value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 4, sm: 2.5 }}>
                        <TextField
                          type="number"
                          label="Superficie"
                          variant="outlined"
                          onChange={(e) => handleEntryChange(index, 'surface', e.target.value)}
                          value={entry.surface}
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 4, sm: 2.5 }}>
                        <TextField
                          type="number"
                          label="Monto de Arancel"
                          variant="outlined"
                          onChange={(e) => handleEntryChange(index, 'tariff_amount', e.target.value)}
                          value={entry.tariff_amount}
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 2, sm: 1 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={entry.have_visa}
                              onChange={(e) => handleEntryChange(index, 'have_visa', e)}
                            />
                          }
                          label="Visa"
                        />
                      </Grid>
                      <Grid size={{ xs: 3, sm: 1 }}>
                        <Button
                          variant="outlined"
                          onClick={() => removeTariffEntry(index)}
                          disabled={tariffEntries.length === 1}
                        >
                          Eliminar Fila
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
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
              {isForm && <Button
                variant="outlined"
                onClick={addTariffEntry}
              >
                Agregar Arancel
              </Button>}
            </Box>
          </div>
        ) : (
          <div className={classes.listContainer}>
            <PreviewAgregarArancel
              architect={architectState.value}
              totalTariff={totalTariffState.value}
              tariffDate={tariffDate}
              tariff={tariff}
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
          <ModalAgregarArancel editArancel={props.editArancel} />
        )}
      </Fragment>
    </>
  );
}

export default AgregarArancel;

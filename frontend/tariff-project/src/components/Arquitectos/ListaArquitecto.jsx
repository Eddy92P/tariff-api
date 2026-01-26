import Listado from '../UI/Listado/Listado';

import { api, config } from '../../Constants';
import ListadoHeader from '../UI/Listado/ListadoHeader';
import { Fragment, useEffect, useState, useContext } from 'react';

import AuthContext from '../../store/auth-context';
import AgregarArquitecto from './AgregarArquitectos/AgregarArquitecto';
import Icon from '@mdi/react';
import { mdiPencilOutline } from '@mdi/js';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  editIcon: {
    color: '#127FE6',
    cursor: 'pointer',
  },
});

const ListaArquitecto = props => {
  const classes = useStyles();
  const authContext = useContext(AuthContext);

  const url = config.url.HOST + api.API_URL_ARQUITECTOS;
  const [list, setList] = useState([]);
  const contentHeader = [
    {
      name: 'Nombres',
      selector: row => row.nombre,
      sortable: true,
    },
    {
      name: 'Apellidos',
      selector: row => row.apellido,
      sortable: true,
    },
    {
      name: 'Dirección',
      selector: row => row.direccion,
      sortable: true,
    },
    {
      name: 'Teléfono',
      selector: row => row.telefono,
      sortable: true,
    },
    {
      name: 'CI',
      selector: row => row.ci,
      sortable: true,
    },
    {
      name: 'Nro. Registro',
      selector: row => row.numeroRegistro,
      sortable: true,
    },
    {
      name: 'Acciones',
      button: 'true',
      cell: row => (
        <Icon
          path={mdiPencilOutline}
          size={1}
          onClick={e => handleButtonClick(e, row.id)}
          className={classes.editIcon}
        />
      ),
    },
  ];

  const [agregarArquitecto, setAgregarArquitecto] = useState(false);
  const [editArquitecto, setEditArquitecto] = useState(false);
  const [userToEdit, setUserToEdit] = useState({});

  useEffect(() => {
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Token ${authContext.token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const parsedList = data.map(listData => {
          return {
            id: listData.id,
            nombre: listData.name,
            apellido: listData.last_name,
            direccion: listData.address,
            telefono: listData.phone_number,
            numeroRegistro: listData.register_number,
            ci: listData.ci,
          };
        });
        setList(parsedList);
      });
  }, []);

  const handleAgregarArquitecto = e => {
    e.preventDefault();
    setAgregarArquitecto(!agregarArquitecto);
  };

  const handleButtonClick = (e, id) => {
    e.preventDefault();
    const user = list.find(x => x.id === id);
    setUserToEdit(user);

    setEditArquitecto(true);
  };

  return (
    <>
      {!agregarArquitecto && !editArquitecto && (
        <Fragment>
          <ListadoHeader
            title="Arquitectos"
            text="Agregar"
            onClick={e => handleAgregarArquitecto(e)}
            visible={true}
          />
          <Listado parsedList={list} contentHeader={contentHeader} />
        </Fragment>
      )}
      {(agregarArquitecto || editArquitecto) && (
        <AgregarArquitecto
          parsedList={userToEdit}
          editArquitecto={editArquitecto}
          setEditArquitecto={setEditArquitecto}
        />
      )}
    </>
  );
};

export default ListaArquitecto;

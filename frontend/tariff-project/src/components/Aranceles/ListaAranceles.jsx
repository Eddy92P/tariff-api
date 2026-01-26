import Listado from '../UI/Listado/Listado';

import { api, config } from '../../Constants';
import ListadoHeader from '../UI/Listado/ListadoHeader';
import { Fragment, useEffect, useState, useContext } from 'react';

import AuthContext from '../../store/auth-context';
import AgregarArancel from './Arancel/AgregarArancel';
import Icon from '@mdi/react';
import { mdiFilePdfBox } from '@mdi/js';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    editIcon: {
        color: 'red',
        cursor: 'pointer',
    },
});

const ListaAranceles = () => {
    const classes = useStyles();
    const authContext = useContext(AuthContext);

    const url = config.url.HOST + api.API_URL_ARANCELES;
    const pdfUrl = config.url.HOST + api.PDF_URL;
    const [list, setList] = useState([]);
    const [error, setError] = useState(null);
    const contentHeader = [
        {
            name: 'Fecha',
            selector: row => row.tariff_date,
            sortable: true,
        },
        {
            name: 'Arquitecto',
            selector: row => row.architect,
            sortable: true,
        },
        {
            name: 'Total Arancel',
            selector: row => row.total_tariff,
            sortable: true,
        },
        {
            name: 'Acciones',
            button: 'true',
            cell: row => (
                <Icon
                    path={mdiFilePdfBox}
                    size={1}
                    onClick={e => handleButtonClick(e, row.id)}
                    className={classes.editIcon}
                />
            ),
        },
    ];

    const [agregarArancel, setAgregarArancel] = useState(false);
    const [editArancel, setEditArancel] = useState(false);
    const [userToEdit, setUserToEdit] = useState({});

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchAranceles = async () => {
            try {
                const response = await fetch(url, {
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
                    const parsedList = data.map(listData => {
                        return {
                            id: listData.id,
                            tariff_date: listData.tariff_date,
                            architect: listData.architect.name + ' ' + listData.architect.last_name,
                            total_tariff: listData.total_tariff_amount,
                        };
                    });
                    setList(parsedList);
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

        fetchAranceles();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [url, authContext.token]);

    const handleAgregarArancel = e => {
        e.preventDefault();
        setAgregarArancel(!agregarArancel);
    };

    const handleButtonClick = (e, id) => {
        e.preventDefault();
        const fullPdfUrl = `${pdfUrl}${id}/`;
        window.open(fullPdfUrl, '_blank');
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            {!agregarArancel && !editArancel && (
                <Fragment>
                    <ListadoHeader
                        title="Aranceles"
                        text="Agregar"
                        onClick={e => handleAgregarArancel(e)}
                        visible={true}
                    />
                    <Listado parsedList={list} contentHeader={contentHeader} />
                </Fragment>
            )}
            {(agregarArancel || editArancel) && (
                <AgregarArancel
                    parsedList={userToEdit}
                    editArancel={editArancel}
                    setEditArancel={setEditArancel}
                />
            )}
        </>
    );
};

export default ListaAranceles;

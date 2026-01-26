import React from 'react';

import { Grid, TextField, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    textStyle: {
        '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#000000',
        },
        '& .MuiInputLabel-shrink': {
            WebkitTextFillColor: 'blue',
        },
    },
});

function PreviewAgregarArancel(props) {
    const classes = useStyles();
    return (
        <>
            <Box>
                <Box mt={4}>
                    <h6>1. Encabezado</h6>
                    <Grid container spacing={2} mt={1} mb={2}>
                        <Grid item md={3}>
                            <TextField
                                label="Arquitecto"
                                value={props.architect.name}
                                fullWidth
                                variant="standard"
                                sx={{
                                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                                }}
                                disabled
                                className={classes.textStyle}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <TextField
                                label="Fecha"
                                value={props.tariffDate}
                                fullWidth
                                variant="standard"
                                sx={{
                                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                                }}
                                disabled
                                className={classes.textStyle}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <TextField
                                label="Total"
                                value={props.totalTariff}
                                fullWidth
                                variant="standard"
                                sx={{
                                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                                }}
                                disabled
                                className={classes.textStyle}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <div>
                    <h6>2. Datos de aranceles </h6>
                    <Grid container spacing={2} mt={2} mb={2} direction="column">
                        {props.tariff.map((entry, index) => (
                            <Grid container spacing={2} key={index}>
                                <Grid item md={4} xs={12}>
                                    <TextField
                                        label="Proyecto"
                                        value={entry.project.name}
                                        fullWidth
                                        variant="standard"
                                        sx={{
                                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                                        }}
                                        disabled
                                        className={classes.textStyle}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <TextField
                                        label="Superficie"
                                        value={entry.surface}
                                        fullWidth
                                        variant="standard"
                                        sx={{
                                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                                        }}
                                        disabled
                                        className={classes.textStyle}
                                    />
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <TextField
                                        label="Monto"
                                        value={entry.tariff_amount}
                                        fullWidth
                                        variant="standard"
                                        sx={{
                                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                                        }}
                                        disabled
                                        className={classes.textStyle}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Box>
        </>
    );
}
export default PreviewAgregarArancel;

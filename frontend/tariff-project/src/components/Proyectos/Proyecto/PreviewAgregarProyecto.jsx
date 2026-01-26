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

function PreviewAgregarProyecto(props) {
  const classes = useStyles();
  return (
    <>
      <Box>
        <Box mt={4}>
          <h6>1. Datos del proyecto</h6>
          <Grid container spacing={2} mt={1} mb={2}>
            <Grid item md={3}>
              <TextField
                label="Nombre del proyecto"
                value={props.name}
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
                label="Costo"
                value={props.cost}
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
                label="Porcentaje Visado"
                value={props.percentageVisa}
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
      </Box>
    </>
  );
}
export default PreviewAgregarProyecto;

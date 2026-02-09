import { Box, Button, Grid, Switch, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Cabecalho from '../components/Cabecalho';
import StepperVertical from '../components/StepperVertical';

export default function CadastroColaborador() {
  const [etapa, setEtapa] = useState(0);

  return (
    <>
      <Cabecalho progresso={etapa === 0 ? 0 : 50} />

      <Box p={4}>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <StepperVertical etapaAtiva={etapa} />
          </Grid>

          <Grid item xs={9}>
            <Typography fontWeight={600} mb={2}>
              {etapa === 0 ? 'Informações Básicas' : 'Informações Profissionais'}
            </Typography>

            {etapa === 0 && (
              <>
                <TextField label="Nome" fullWidth size="small" sx={{ mb: 2 }} />
                <TextField
                  label="Email"
                  placeholder="e.g. john@gmail.com"
                  fullWidth
                  size="small"
                />

                <Box display="flex" alignItems="center" mt={2}>
                  <Switch defaultChecked />
                  <Typography variant="body2">
                    Ativar ao criar
                  </Typography>
                </Box>
              </>
            )}

            {etapa === 1 && (
              <TextField label="Departamento" fullWidth size="small" />
            )}

            <Box mt={4} display="flex" justifyContent="space-between">
              <Button
                disabled={etapa === 0}
                sx={{ textTransform: 'none', color: '#6B7280' }}
                onClick={() => setEtapa(0)}
              >
                Voltar
              </Button>

              <Button
                variant="contained"
                sx={{ textTransform: 'none', px: 4 }}
                onClick={() => setEtapa(1)}
              >
                {etapa === 0 ? 'Próximo' : 'Concluir'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

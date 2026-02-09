import {
  Box,
  Button,
  Switch,
  TextField,
  Typography,
  Snackbar,
  Avatar,
  LinearProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import StepperVertical from '../../components/StepperVertical';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';

export default function CadastroColaborador() {
  const [etapa, setEtapa] = useState(0);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [departamento, setDepartamento] = useState('');

  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const progresso = etapa === 0 ? 0 : etapa === 1 ? 50 : 100;

  const podeAvancar =
    nome.trim().length > 0 && email.trim().length > 0;
  
  const navigate = useNavigate();

  const cadastrarColaborador = async () => {
    try {
      setCarregando(true);
      setErro('');

      await addDoc(collection(db, 'colaboradores'), {
        nome,
        email,
        ativo,
        departamento,
        criadoEm: serverTimestamp(),
      });

      setSucesso(true);

      setTimeout(() => {
        navigate('/colaboradores');
      }, 1200);
    } catch (e) {
      setErro('Erro ao cadastrar colaborador');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />

      <Box flex={1} bgcolor="#FFFFFF">
        <Box
          height={80}
          px={4}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          bgcolor="#FFFFFF"
        >
          <Avatar
            src="https://i.pravatar.cc/150?img=12"
            sx={{
              width: 40,
              height: 40,
              boxShadow: '0px 4px 10px rgba(0,0,0,0.12)',
            }}
          />
        </Box>

        <Box px={4} pt={3} pb={2} bgcolor="#FFFFFF">
          <Typography fontSize={14} color="#637381" mb={1}>
            <Box
              component="span"
              fontWeight={etapa === 0 ? 400 : 200}
              color={etapa === 0 ? '#212B36' : '#637381'}
            >
              Colaboradores
            </Box>

            {' '} › {' '}

            <Box
              component="span"
              fontWeight={etapa === 1 ? 400 : 200}
              fontSize={14}
              color={etapa === 1 ? '#212B36' : '#637381'}
            >
              Cadastrar Colaborador
            </Box>
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <LinearProgress
              variant="determinate"
              value={progresso}
              sx={{
                flex: 1,
                height: 6,
                borderRadius: 4,
                backgroundColor: '#E6F4EA',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#22C55E',
                },
              }}
            />

            <Typography fontSize={14} fontWeight={500} color="#637381">
              {progresso}%
            </Typography>
          </Box>
        </Box>


        <Box p={4} pb={10}>
          <Grid container spacing={4}>
            <Grid item xs={3} fontSize={14} color='#DFE3E8' fontWeight={600}>
              <StepperVertical etapaAtiva={etapa} />
            </Grid>

            <Grid item xs={3}>
              <Typography fontWeight={700} mb={3} fontSize={24} color='#637381'>
                {etapa === 0
                  ? 'Informações Básicas'
                  : 'Informações Profissionais'}
              </Typography>

              {etapa === 0 && (
                <>
                  <TextField
                    label="Nome"
                    error={!nome && !podeAvancar}
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />

                  <TextField
                    label="E-mail"
                    error={!nome && !podeAvancar}
                    placeholder="e.g. john@gmail.com"
                    fullWidth
                    size="small"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />

                  <Box display="flex" alignItems="center" mt={2}>
                    <Switch
                      checked={ativo}
                      onChange={e => setAtivo(e.target.checked)}
                    />
                    <Typography variant="body2">
                      Ativar ao criar
                    </Typography>
                  </Box>
                </>
              )}

              {etapa === 1 && (
                <FormControl fullWidth size="small">
                  <InputLabel id="departamento-label">
                    Departamento
                  </InputLabel>

                  <Select
                    labelId="departamento-label"
                    value={departamento}
                    label="Departamento"
                    onChange={e => setDepartamento(e.target.value)}
                  >
                    <MenuItem value="Design">Design</MenuItem>
                    <MenuItem value="Produto">Produto</MenuItem>
                    <MenuItem value="TI">TI</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
          </Grid>
        </Box>

        <Box
          position="fixed"
          bottom={0}
          left={240}
          right={0}
          bgcolor="#FFFFFF"
          borderTop="1px solid #E5E7EB"
          px={4}
          py={2}
        >
          <Box display="flex" justifyContent="space-between">
            <Button
              disabled={etapa === 0}
              sx={{ textTransform: 'none', color: '#6B7280' }}
              onClick={() => setEtapa(0)}
            >
              Voltar
            </Button>

            <Button
              variant="contained"
              disabled={
                carregando ||
                (etapa === 0 && !podeAvancar)
              }
              onClick={() =>
                etapa === 0 ? setEtapa(1) : cadastrarColaborador()
              }
              sx={{
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                px: 4,
              }}
            >
              {etapa === 0 ? 'Próximo' : 'Concluir'}
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={sucesso}
          autoHideDuration={3000}
          message="Colaborador cadastrado com sucesso!"
          onClose={() => setSucesso(false)}
        />

        <Snackbar
          open={!!erro}
          autoHideDuration={3000}
          message={erro}
          onClose={() => setErro('')}
        />
      </Box>
    </Box>
  );
}

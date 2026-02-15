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
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import StepperVertical from '../../components/StepperVertical';
import Sidebar from '../../components/Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Colaborador } from '../../types/Colaborador';

const emailValido = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function CadastroColaborador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const modoEdicao = Boolean(id);

  const [etapa, setEtapa] = useState(0);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [departamento, setDepartamento] = useState('');
  const [departamentoId, setDepartamentoId] = useState('');
  const [departamentoAnteriorId, setDepartamentoAnteriorId] = useState('');
  const [cargo, setCargo] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [nivel, setNivel] = useState('');
  const [gestorId, setGestorId] = useState('');
  const [salarioBase, setSalarioBase] = useState('');

  const [gestores, setGestores] = useState<any[]>([]);
  const [departamentos, setDepartamentos] = useState<any[]>([]);

  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const progresso = etapa === 0 ? 0 : etapa === 1 ? 50 : 100;

  const podeAvancar =
    nome.trim().length > 0 && 
    email.trim().length > 0 &&
    emailValido(email);
  
  const salvarColaborador = async () => {
    if (!departamentoId || !departamento) {
      setErro('O colaborador deve estar vinculado a um departamento');
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      if (modoEdicao && id) {
        await updateDoc(doc(db, 'colaboradores', id), {
          nome,
          email,
          ativo,
          departamentoId,
          departamento,
          cargo,
          dataAdmissao,
          nivel,
          gestorId: nivel === 'gestor' ? null : gestorId,
          salarioBase: Number(salarioBase),
        });
      } else {
        const novoColab = await addDoc(collection(db, 'colaboradores'), {
          nome,
          email,
          ativo,
          departamento,
          departamentoId,
          criadoEm: serverTimestamp(),
          cargo,
          dataAdmissao,
          nivel,
          gestorId: nivel === 'gestor' ? null : gestorId,
          salarioBase: Number(salarioBase),
        });

        const deptRef = doc(db, 'departamentos', departamentoId);
        const deptSnap = await getDoc(deptRef);

        await updateDoc(deptRef, {
          colaboradores: [...deptSnap.data()!.colaboradores, novoColab.id],
        });

        setSucesso(true);
        navigate('/colaboradores');
        return;
      }

      if (departamentoAnteriorId !== departamentoId) {
        const antigoRef = doc(db, 'departamentos', departamentoAnteriorId);
        const antigoSnap = await getDoc(antigoRef);

        await updateDoc(antigoRef, {
          colaboradores: antigoSnap
            .data()!
            .colaboradores.filter((c: string) => c !== id),
        });

        const novoRef = doc(db, 'departamentos', departamentoId);
        const novoSnap = await getDoc(novoRef);

        await updateDoc(novoRef, {
          colaboradores: [...novoSnap.data()!.colaboradores, id],
        });
      }

      setSucesso(true);

      setTimeout(() => {
        navigate('/colaboradores');
      }, 1200);
    } catch (e) {
      setErro('Erro ao salvar colaborador');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const buscarColaborador = async () => {
      const snapshot = await getDoc(doc(db, 'colaboradores', id));

      if (snapshot.exists()) {
        const data = snapshot.data();

        setNome(data.nome);
        setEmail(data.email);
        setAtivo(data.ativo);
        setDepartamento(data.departamento || 'N/A');
        setDepartamentoId(data.departamentoId);
        setDepartamentoAnteriorId(data.departamentoId);
        setCargo(data.cargo);
        setNivel(data.nivel);
        setGestorId(data.gestorId || '');
        setSalarioBase(data.salarioBase?.toString() || '');
        setDataAdmissao(data.dataAdmissao || '');
      }
    };

    buscarColaborador();
  }, [id]);


  useEffect(() => {
    const buscarGestores = async () => {
      const snapshot = await getDocs(collection(db, 'colaboradores'));

      const gestoresFiltrados = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Colaborador, 'id'>),
        }))
        .filter(colab => colab.nivel === 'gestor' && colab.ativo);

      setGestores(gestoresFiltrados);
    };

    buscarGestores();
  }, []);

  useEffect(() => {
    const buscarDepartamentos = async () => {
      const snapshot = await getDocs(collection(db, 'departamentos'));

      const departamentoFiltrados = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Colaborador, 'id'>),
        }))
        .filter(colab => colab.ativo);

      setDepartamentos(departamentoFiltrados);
    };

    buscarDepartamentos();
  }, []);

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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/colaboradores')}
            sx={{
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 500,
              color: '#637381',
              mb: 1,
              px: 0,
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: 'transparent',
                color: '#212B36',
              },
            }}
          >
            Voltar para colaboradores
          </Button>

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

       <Box p={4} pb={10} width="100%">
          <Box display="flex" gap={4} width="100%">
            <Box
              minWidth={180}
              color="#DFE3E8"
              fontWeight={600}
              fontSize={14}
            >
              <StepperVertical etapaAtiva={etapa} />
            </Box>

            <Box flex={1} width="100%">
              <Typography
                fontWeight={700}
                mb={3}
                fontSize={24}
                color="#637381"
              >
                {etapa === 0
                  ? 'Informações Básicas'
                  : 'Informações Profissionais'}
              </Typography>

              {etapa === 0 && (
                <>
                  <TextField
                    label="Nome"
                    placeholder="Luiz Filipe M. Kato"
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />

                  <TextField
                    label="E-mail"
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
                <Box display="flex" flexDirection="column" gap={2}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Departamento</InputLabel>
                    <Select
                      value={departamentoId}
                      label="Departamento"
                      onChange={e => {
                          const depId = e.target.value;
                          const depSelecionado = departamentos.find(d => d.id === depId);

                          setDepartamentoId(depId);
                          setDepartamento(depSelecionado.nome || 'N/A')
                        }
                      }
                    >
                      {departamentos.map(dep => (
                        <MenuItem key={dep.id} value={dep.id}>
                          {dep.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Cargo"
                    size="small"
                    fullWidth
                    value={cargo}
                    onChange={e => setCargo(e.target.value)}
                  />

                  <TextField
                    label="Data de admissão"
                    type="date"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={dataAdmissao}
                    onChange={e => setDataAdmissao(e.target.value)}
                  />

                  <FormControl fullWidth size="small">
                    <InputLabel>Nível hierárquico</InputLabel>
                    <Select
                      value={nivel}
                      label="Nível hierárquico"
                      onChange={e => setNivel(e.target.value)}
                    >
                      <MenuItem value="junior">Júnior</MenuItem>
                      <MenuItem value="pleno">Pleno</MenuItem>
                      <MenuItem value="senior">Sênior</MenuItem>
                      <MenuItem value="gestor">Gestor</MenuItem>
                    </Select>
                  </FormControl>

                  {nivel !== 'gestor' && (
                    <FormControl fullWidth size="small">
                      <InputLabel>Gestor responsável</InputLabel>
                      <Select
                        value={gestorId}
                        label="Gestor responsável"
                        onChange={e => setGestorId(e.target.value)}
                      >
                        {gestores.map(gestor => (
                          <MenuItem key={gestor.id} value={gestor.id}>
                            {gestor.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  <TextField
                    label="Salário base"
                    type="number"
                    size="small"
                    fullWidth
                    value={salarioBase}
                    onChange={e => setSalarioBase(e.target.value)}
                    InputProps={{ startAdornment: 'R$ ' }}
                  />
                </Box>
              )}
            </Box>
          </Box>
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
                etapa === 0 ? setEtapa(1) : salvarColaborador()
              }
              sx={{
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                px: 4,
                bgcolor: 'green'
              }}
            >
              {etapa === 0 ? 'Salvar alterações' : 'Concluir'}
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

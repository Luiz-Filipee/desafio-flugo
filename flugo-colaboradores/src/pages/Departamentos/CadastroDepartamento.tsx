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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useState, useEffect } from 'react';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import Sidebar from '../../components/Sidebar';
import StepperVertical from '../../components/StepperVertical';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Colaborador } from '../../types/Colaborador';

interface Departamento {
  id: string;
  nome: string;
}

export default function CadastroDepartamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modoEdicao = Boolean(id);

  const [etapa, setEtapa] = useState(0);

  const [nome, setNome] = useState('');
  const [gestorId, setGestorId] = useState('');
  const [ativo, setAtivo] = useState(true);

  const [gestores, setGestores] = useState<Colaborador[]>([]);
  const [todosColaboradores, setTodosColaboradores] = useState<Colaborador[]>([]);
  const [colaboradoresDepto, setColaboradoresDepto] = useState<Colaborador[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  const [novoColaboradorId, setNovoColaboradorId] = useState('');

  const [modalAberto, setModalAberto] = useState(false);
  const [colabTransferir, setColabTransferir] = useState<Colaborador | null>(null);
  const [destinoDeptoId, setDestinoDeptoId] = useState('');

  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const [colaboradoresCriacao, setColaboradoresCriacao] = useState<Colaborador[]>([]);
  const [novoColaboradorCriacaoId, setNovoColaboradorCriacaoId] = useState('');

  const progresso = etapa === 0 ? 50 : 100;
  const podeAvancar = nome.trim().length >= 3 && gestorId.length > 0;

  useEffect(() => {
    getDocs(collection(db, 'colaboradores')).then(snapshot => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Colaborador, 'id'>),
      }));
      setTodosColaboradores(lista);
      setGestores(lista.filter(c => c.nivel === 'gestor' && c.ativo));
    });
  }, []);

  useEffect(() => {
    getDocs(collection(db, 'departamentos')).then(snapshot => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome,
      }));
      setDepartamentos(lista.filter(d => d.id !== id));
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;

    getDoc(doc(db, 'departamentos', id)).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setNome(data.nome);
        setGestorId(data.gestorId);
        setAtivo(data.ativo);
        setColaboradoresDepto(
          todosColaboradores.filter(c => data.colaboradores?.includes(c.id!))
        );
      }
    });
  }, [id, todosColaboradores]);

  const adicionarColaborador = async () => {
    if (!novoColaboradorId || !id) return;

    const colab = todosColaboradores.find(c => c.id === novoColaboradorId);
    if (!colab) return;

    await updateDoc(doc(db, 'colaboradores', colab.id!), {
      departamentoId: id,
      departamentoNome: nome,
    });

    const deptRef = doc(db, 'departamentos', id);
    const deptSnap = await getDoc(deptRef);

    await updateDoc(deptRef, {
      colaboradores: [...deptSnap.data()!.colaboradores, colab.id],
    });

    setColaboradoresDepto(prev => [...prev, colab]);
    setNovoColaboradorId('');
  };

  const confirmarTransferencia = async () => {
    if (!colabTransferir || !destinoDeptoId || !id) return;

    const destino = departamentos.find(d => d.id === destinoDeptoId);
    if (!destino) return;

    await updateDoc(doc(db, 'departamentos', id), {
      colaboradores: colaboradoresDepto
        .map(c => c.id)
        .filter(cid => cid !== colabTransferir.id),
    });

    const destRef = doc(db, 'departamentos', destinoDeptoId);
    const destSnap = await getDoc(destRef);

    await updateDoc(destRef, {
      colaboradores: [...destSnap.data()!.colaboradores, colabTransferir.id],
    });

    await updateDoc(doc(db, 'colaboradores', colabTransferir.id!), {
      departamentoId: destinoDeptoId,
      departamentoNome: destino.nome,
    });

    setColaboradoresDepto(prev =>
      prev.filter(c => c.id !== colabTransferir.id)
    );

    setModalAberto(false);
    setColabTransferir(null);
    setDestinoDeptoId('');
  };

  const salvarDepartamento = async () => {
    try {
      setCarregando(true);
      setErro('');

      const gestor = gestores.find(g => g.id === gestorId);
      if (!gestor) {
        setErro('Selecione um gestor válido');
        return;
      }

      const payload = {
        nome,
        gestorId,
        gestorNome: gestor.nome,
        colaboradores: modoEdicao
          ? colaboradoresDepto.map(c => c.id)
          : colaboradoresCriacao.map(c => c.id),
        ativo,
        criadoEm: serverTimestamp(),
      };

      if (modoEdicao && id) {
        await updateDoc(doc(db, 'departamentos', id), payload);
      } else {
        await addDoc(collection(db, 'departamentos'), payload);
      }

      setSucesso(true);
      setTimeout(() => navigate('/departamentos'), 1200);
    } catch {
      setErro('Erro ao salvar departamento');
    } finally {
      setCarregando(false);
    }
  };

  const adicionarColaboradorCriacao = () => {
    if (!novoColaboradorCriacaoId) return;

    const colab = todosColaboradores.find(c => c.id === novoColaboradorCriacaoId);
    if (!colab) return;

    setColaboradoresCriacao(prev => [...prev, colab]);
    setNovoColaboradorCriacaoId('');
  };

  const abrirTransferencia = (colaborador: Colaborador) => {
    setColabTransferir(colaborador);
    setDestinoDeptoId('');
    setModalAberto(true);
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />

      <Box flex={1} bgcolor="#FFFFFF">
        <Box height={80} px={4} display="flex" justifyContent="flex-end">
          <Avatar />
        </Box>

        <Box px={4} pt={3} pb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/departamentos')}
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
            Voltar para departamentos
          </Button>

          <Typography fontSize={14} color="#637381" mb={1}>
            <Box
              component="span"
              fontWeight={etapa === 0 ? 400 : 200}
              color={etapa === 0 ? '#212B36' : '#637381'}
            >
              Departamentos
            </Box>

            {' '} › {' '}

            <Box
              component="span"
              fontWeight={etapa === 1 ? 400 : 200}
              fontSize={14}
              color={etapa === 1 ? '#212B36' : '#637381'}
            >
              Cadastrar Departamento
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
                '& .MuiLinearProgress-bar': { backgroundColor: '#22C55E' },
              }}
            />
            <Typography>{progresso}%</Typography>
          </Box>
        </Box>

        <Box p={4} pb={10}>
          <Box display="flex" gap={4}>
            <Box minWidth={180}>
              <StepperVertical etapaAtiva={etapa} />
            </Box>

            <Box flex={1}>
              {etapa === 0 && (
                <>
                  <TextField
                    label="Nome do departamento"
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />

                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Gestor responsável</InputLabel>
                    <Select
                      value={gestorId}
                      label="Gestor responsável"
                      onChange={e => setGestorId(e.target.value)}
                    >
                      {gestores.map(g => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

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

              {etapa === 1 && !modoEdicao && (
                <>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Adicionar colaborador</InputLabel>
                    <Select
                      value={novoColaboradorCriacaoId}
                      label="Adicionar colaborador"
                      onChange={e => setNovoColaboradorCriacaoId(e.target.value)}
                    >
                      {todosColaboradores
                        .filter(
                          c =>
                            c.ativo &&
                            !colaboradoresCriacao.some(cc => cc.id === c.id)
                        )
                        .map(c => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.nome}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <Button onClick={adicionarColaboradorCriacao}>
                    Adicionar colaborador
                  </Button>

                  <List>
                    {colaboradoresCriacao.map(c => (
                      <ListItem key={c.id}>
                        <ListItemText primary={c.nome} secondary={c.email} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {etapa === 1 && modoEdicao && (
                <>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Adicionar colaborador</InputLabel>
                    <Select
                      value={novoColaboradorId}
                      label="Adicionar colaborador"
                      onChange={e => setNovoColaboradorId(e.target.value)}
                    >
                      {todosColaboradores
                        .filter(c => c.ativo && c.departamentoId !== id)
                        .map(c => (
                          <MenuItem key={c.id} value={c.id}>
                            {c.nome}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <Button onClick={adicionarColaborador}>
                    Adicionar colaborador
                  </Button>

                  <List>
                    {colaboradoresDepto.map(c => (
                      <ListItem
                        key={c.id}
                        secondaryAction={
                          <IconButton onClick={() => abrirTransferencia(c)}>
                            <SwapHorizIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={c.nome} secondary={c.email} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>
          </Box>
        </Box>

        <Box position="fixed" bottom={0} left={240} right={0} px={4} py={2}>
          <Box display="flex" justifyContent="space-between">
            <Button disabled={etapa === 0} onClick={() => setEtapa(0)}>
              Voltar
            </Button>
            <Button
              variant="contained"
              disabled={carregando || (etapa === 0 && !podeAvancar)}
              onClick={() => (etapa === 0 ? setEtapa(1) : salvarDepartamento())}
              sx={{
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                px: 4,
                bgcolor: 'green'
              }}
            >
              {etapa == 0 ? 'Avançar' : 'Concluir'}
            </Button>
          </Box>
        </Box>

        <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
          <DialogTitle>Transferir colaborador</DialogTitle>
          <DialogContent>
            <FormControl fullWidth size="small">
              <InputLabel>Departamento destino</InputLabel>
              <Select
                value={destinoDeptoId}
                label="Departamento destino"
                onChange={e => setDestinoDeptoId(e.target.value)}
              >
                {departamentos.map(d => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button variant="contained" onClick={confirmarTransferencia} 
              sx={{
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                px: 4,
                bgcolor: 'green'
              }}>
              Transferir
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={sucesso} message="Departamento salvo com sucesso!" />
        <Snackbar open={!!erro} message={erro} />
      </Box>
    </Box>
  );
}

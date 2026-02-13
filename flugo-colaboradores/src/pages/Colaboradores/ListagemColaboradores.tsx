import {
  Box,
  Button,
  Typography,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  CircularProgress,
  TextField,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import IconButton from '@mui/material/IconButton';
import Sidebar from '../../components/Sidebar';
import { db } from '../../services/firebase';
import type { Colaborador } from '../../types/Colaborador';

type Ordem = 'asc' | 'desc';

export default function ListaColaboradores() {
  const navigate = useNavigate();

  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [ordem, setOrdem] = useState<Ordem>('asc');
  const [ordenarPor, setOrdenarPor] = useState<keyof Colaborador>('nome');

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('');

  const [selecionados, setSelecionados] = useState<string[]>([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [acaoStatus, setAcaoStatus] = useState<boolean | null>(null);
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const buscarColaboradores = async () => {
      const snapshot = await getDocs(collection(db, 'colaboradores'));
      const dados = snapshot.docs.map(
        (doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<Colaborador, 'id'>),
        })
      );
      setColaboradores(dados);
      setCarregando(false);
    };

    buscarColaboradores();
  }, []);

  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroEmail('');
    setFiltroDepartamento('');
  };

  const handleOrdenar = (campo: keyof Colaborador) => {
    const isAsc = ordenarPor === campo && ordem === 'asc';
    setOrdem(isAsc ? 'desc' : 'asc');
    setOrdenarPor(campo);
  };

  const colaboradoresFiltradosOrdenados = [...colaboradores]
    .filter(c =>
      c.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
      c.email.toLowerCase().includes(filtroEmail.toLowerCase()) &&
      c.departamento?.toLowerCase().includes(filtroDepartamento.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[ordenarPor]!;
      const bVal = b[ordenarPor]!;
      return ordem === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  const abrirConfirmacao = (id: string | null, novoStatus: boolean) => {
    setIdSelecionado(id);
    setAcaoStatus(novoStatus);
    setModalAberto(true);
  };

  const confirmarAcao = async () => {
    if (idSelecionado) {
      await updateDoc(doc(db, 'colaboradores', idSelecionado), {
        ativo: acaoStatus,
      });

      setColaboradores(prev =>
        prev.map(c =>
          c.id === idSelecionado ? { ...c, ativo: acaoStatus! } : c
        )
      );
    } else {
      await Promise.all(
        selecionados.map(id =>
          updateDoc(doc(db, 'colaboradores', id), { ativo: false })
        )
      );

      setColaboradores(prev =>
        prev.map(c =>
          selecionados.includes(c.id!) ? { ...c, ativo: false } : c
        )
      );

      setSelecionados([]);
    }

    setModalAberto(false);
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />

      <Box flex={1} p={4}>
        <Box
            height={20}
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

            <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            height={150}
            >
            <Typography fontSize={24} fontWeight={700} color='#212B36'>
                Colaboradores
            </Typography>

            <Button
                variant="contained"
                sx={{ textTransform: 'none', fontWeight: 600, color: 'white' }}
                onClick={() => navigate('/colaboradores/novo')}
            >
                Novo Colaborador
            </Button>
        </Box>

        <Box display="flex" gap={2} mb={3}>
          <TextField label="Nome" size="small" fullWidth value={filtroNome} onChange={e => setFiltroNome(e.target.value)} />
          <TextField label="Email" size="small" fullWidth value={filtroEmail} onChange={e => setFiltroEmail(e.target.value)} />
          <TextField label="Departamento" size="small" fullWidth value={filtroDepartamento} onChange={e => setFiltroDepartamento(e.target.value)} />
          <Button onClick={limparFiltros} sx={{ border: '1px solid #ef4444', color: '#ef4444', px: 3, textTransform: 'none', fontWeight: 600 }}>
            Limpar
          </Button>
        </Box>

        {selecionados.length > 0 && (
          <Button
            color="error"
            variant="contained"
            onClick={() => abrirConfirmacao(null, false)}
          >
            Desativar selecionados ({selecionados.length})
          </Button>
        )}

        {carregando ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  {['nome', 'email', 'departamento', 'ativo'].map(campo => (
                    <TableCell key={campo}>
                      <TableSortLabel
                        active={ordenarPor === campo}
                        direction={ordem}
                        onClick={() => handleOrdenar(campo as keyof Colaborador)}
                      >
                        {campo}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {colaboradoresFiltradosOrdenados.map(colaborador => (
                  <TableRow key={colaborador.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        disabled={!colaborador.ativo}
                        checked={selecionados.includes(colaborador.id!)}
                        onChange={e =>
                          setSelecionados(prev =>
                            e.target.checked
                              ? [...prev, colaborador.id!]
                              : prev.filter(id => id !== colaborador.id!)
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>{colaborador.nome}</TableCell>
                    <TableCell>{colaborador.email}</TableCell>
                    <TableCell>{colaborador.departamento}</TableCell>

                    <TableCell>
                      <Chip
                        label={colaborador.ativo ? 'Ativo' : 'Inativo'}
                        color={colaborador.ativo ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton onClick={() => navigate(`/colaboradores/editar/${colaborador.id}`)}>
                        <EditOutlinedIcon />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          abrirConfirmacao(colaborador.id!, !colaborador.ativo)
                        }
                        sx={{
                          color: colaborador.ativo ? '#ef4444' : '#22c55e',
                        }}
                      >
                        {colaborador.ativo ? <DeleteOutlineIcon /> : <CheckCircleOutlineIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
          <DialogTitle fontWeight={600}>
            Confirmar ação
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja {acaoStatus ? 'ativar' : 'desativar'} este colaborador?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button
              variant="contained"
              color={acaoStatus ? 'success' : 'error'}
              onClick={confirmarAcao}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

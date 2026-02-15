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
import type { Departamento } from '../../types/Departamento';

type Ordem = 'asc' | 'desc';

export default function ListaDepartamentos() {
  const navigate = useNavigate();

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [ordem, setOrdem] = useState<Ordem>('asc');
  const [ordenarPor, setOrdenarPor] = useState<keyof Departamento>('nome');

  const [filtroNome, setFiltroNome] = useState('');
  const [filtroGestor, setFiltroGestor] = useState('');

  const [selecionados, setSelecionados] = useState<string[]>([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [acaoStatus, setAcaoStatus] = useState<boolean | null>(null);
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const buscarDepartamentos = async () => {
      const snapshot = await getDocs(collection(db, 'departamentos'));
      const dados = snapshot.docs.map(
        (doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<Departamento, 'id'>),
        })
      );
      setDepartamentos(dados);
      setCarregando(false);
    };

    buscarDepartamentos();
  }, []);

  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroGestor('');
  };

  const handleOrdenar = (campo: keyof Departamento) => {
    const isAsc = ordenarPor === campo && ordem === 'asc';
    setOrdem(isAsc ? 'desc' : 'asc');
    setOrdenarPor(campo);
  };

  const dadosFiltradosOrdenados = [...departamentos]
    .filter(d =>
      d.nome.toLowerCase().includes(filtroNome.toLowerCase()) &&
      d.gestorNome.toLowerCase().includes(filtroGestor.toLowerCase())
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
      await updateDoc(doc(db, 'departamentos', idSelecionado), {
        ativo: acaoStatus,
      });

      setDepartamentos(prev =>
        prev.map(d =>
          d.id === idSelecionado ? { ...d, ativo: acaoStatus! } : d
        )
      );
    } else {
      await Promise.all(
        selecionados.map(id =>
          updateDoc(doc(db, 'departamentos', id), { ativo: false })
        )
      );

      setDepartamentos(prev =>
        prev.map(d =>
          selecionados.includes(d.id!) ? { ...d, ativo: false } : d
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
        >
          <Avatar
            src="https://i.pravatar.cc/150?img=12"
            sx={{ width: 40, height: 40 }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} height={150}>
          <Typography fontSize={24} fontWeight={700}>
            Departamentos
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate('/departamentos/novo')}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'green' }}
          >
            Novo Departamento
          </Button>
        </Box>

        <Box display="flex" gap={2} mb={3}>
          <TextField label="Nome" size="small" fullWidth value={filtroNome} onChange={e => setFiltroNome(e.target.value)} />
          <TextField label="Gestor" size="small" fullWidth value={filtroGestor} onChange={e => setFiltroGestor(e.target.value)} />
          <Button onClick={limparFiltros} sx={{ border: '1px solid #ef4444', color: '#ef4444' }}>
            Limpar
          </Button>
        </Box>

        {selecionados.length > 0 && (
          <Button color="error" variant="contained" onClick={() => abrirConfirmacao(null, false)}>
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
                  {['Nome', 'Gestor', 'Status'].map(campo => (
                    <TableCell key={campo}>
                      <TableSortLabel
                        active={ordenarPor === campo}
                        direction={ordem}
                        onClick={() => handleOrdenar(campo as keyof Departamento)}
                      >
                        {campo}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {dadosFiltradosOrdenados.map(dep => (
                  <TableRow key={dep.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        disabled={!dep.ativo}
                        checked={selecionados.includes(dep.id!)}
                        onChange={e =>
                          setSelecionados(prev =>
                            e.target.checked
                              ? [...prev, dep.id!]
                              : prev.filter(id => id !== dep.id!)
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>{dep.nome}</TableCell>
                    <TableCell>{dep.gestorNome}</TableCell>

                    <TableCell>
                      <Chip
                        label={dep.ativo ? 'Ativo' : 'Inativo'}
                        color={dep.ativo ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton onClick={() => navigate(`/departamentos/editar/${dep.id}`)}>
                        <EditOutlinedIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => abrirConfirmacao(dep.id!, !dep.ativo)}
                        sx={{ color: dep.ativo ? '#ef4444' : '#22c55e' }}
                      >
                        {dep.ativo ? <DeleteOutlineIcon /> : <CheckCircleOutlineIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
          <DialogTitle fontWeight={600}>Confirmar ação</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja {acaoStatus ? 'ativar' : 'desativar'} este departamento?
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

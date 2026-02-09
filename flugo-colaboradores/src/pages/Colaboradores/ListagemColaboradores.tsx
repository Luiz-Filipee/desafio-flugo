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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  updateDoc,
} from 'firebase/firestore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { db } from '../../services/firebase';
import Sidebar from '../../components/Sidebar';
import type { Colaborador } from '../../types/Colaborador';
import { doc } from 'firebase/firestore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';


type Ordem = 'asc' | 'desc';

export default function ListaColaboradores() {
    const [modalAberto, setModalAberto] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null);

    const navigate = useNavigate();

    const [colaboradores, setColaboradores] = useState<
        Colaborador[]
    >([]);
    const [carregando, setCarregando] = useState(true);

    const [ordem, setOrdem] = useState<Ordem>('asc');
    const [ordenarPor, setOrdenarPor] =
        useState<keyof Colaborador>('nome');

    useEffect(() => {
        const buscarColaboradores = async () => {
        try {
            const snapshot = await getDocs(
            collection(db, 'colaboradores')
            );

            const dados = snapshot.docs.map(
            (doc: QueryDocumentSnapshot) => ({
                id: doc.id,
                ...(doc.data() as Omit<Colaborador, 'id'>),
            })
            );

            setColaboradores(dados);
        } catch (error) {
            console.error('Erro ao buscar colaboradores', error);
        } finally {
            setCarregando(false);
        }
        };

        buscarColaboradores();
    }, []);

    const colaboradoresOrdenados = [...colaboradores].sort(
        (a, b) => {
        const valorA = a[ordenarPor];
        const valorB = b[ordenarPor];

        if (!valorA < !valorB) return ordem === 'asc' ? -1 : 1;
        if (!valorA > !valorB) return ordem === 'asc' ? 1 : -1;
        return 0;
        }
    );

    const abrirModalExcluir = (id: string) => {
        setIdParaExcluir(id);
        setModalAberto(true);
    };

    const fecharModalExcluir = () => {
        setModalAberto(false);
        setIdParaExcluir(null);
    };

    const handleOrdenar = (campo: keyof Colaborador) => {
        const isAsc = ordenarPor === campo && ordem === 'asc';
        setOrdem(isAsc ? 'desc' : 'asc');
        setOrdenarPor(campo);
    };

    const excluirColaborador = async () => {
        if (!idParaExcluir) return;

        try {
            await updateDoc(
            doc(db, 'colaboradores', idParaExcluir),
            {
                ativo: false,
            }
            );

            setColaboradores(prev =>
            prev.map(colaborador =>
                colaborador.id === idParaExcluir
                ? { ...colaborador, ativo: false }
                : colaborador
            )
            );

            fecharModalExcluir();
        } catch (error) {
            console.error('Erro ao inativar colaborador', error);
        }
    };

    return (
        <Box display="flex" minHeight="100vh">
        <Sidebar />

        <Box flex={1} p={4} bgcolor="#FFFFFF">
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

            {carregando ? (
            <Box
                display="flex"
                justifyContent="center"
                mt={6}
            >
                <CircularProgress />
            </Box>
            ) : (
            <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 2,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
                    }}
                >
                <Table>
                <TableHead sx={{ backgroundColor: '#F4F6F8' }}>
                    <TableRow>
                    <TableCell>
                        <TableSortLabel
                            active={ordenarPor === 'nome'}
                            direction={ordem}
                            onClick={() => handleOrdenar('nome')}
                            sx={{
                                color: '#637381',
                                fontWeight: 600,
                                '&.Mui-active': {
                                color: '#212B36',
                                },
                                '&:hover': {
                                color: '#212B36',
                                },
                            }}
                        >
                        Nome
                        </TableSortLabel>
                    </TableCell>

                    <TableCell>
                        <TableSortLabel
                            active={ordenarPor === 'email'}
                            direction={ordem}
                            onClick={() => handleOrdenar('email')}
                            sx={{
                                color: '#637381',
                                fontWeight: 600,
                                '&.Mui-active': {
                                color: '#212B36',
                                },
                                '&:hover': {
                                color: '#212B36',
                                },
                            }}
                        >
                        Email
                        </TableSortLabel>
                    </TableCell>

                    <TableCell>
                        <TableSortLabel
                            active={ordenarPor === 'departamento'}
                            direction={ordem}
                            onClick={() =>
                                handleOrdenar('departamento')
                            }
                            sx={{
                                color: '#637381',
                                fontWeight: 600,
                                '&.Mui-active': {
                                color: '#212B36',
                                },
                                '&:hover': {
                                color: '#212B36',
                                },
                            }}
                        >
                        Departamento
                        </TableSortLabel>
                    </TableCell>

                    <TableCell align="right">
                        <TableSortLabel
                            active={ordenarPor === 'ativo'}
                            direction={ordem}
                            onClick={() => handleOrdenar('ativo')}
                            sx={{
                                color: '#637381',
                                fontWeight: 600,
                                '&.Mui-active': {
                                color: '#212B36',
                                },
                                '&:hover': {
                                color: '#212B36',
                                },
                            }}
                        >
                        Status
                        </TableSortLabel>
                    </TableCell>

                    <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {colaboradoresOrdenados.map(colaborador => (
                    <TableRow key={colaborador.id} hover>
                        <TableCell>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                        >
                            <Avatar />
                            <Typography fontWeight={500}>
                                {colaborador.nome}
                            </Typography>
                        </Box>
                        </TableCell>

                        <TableCell>
                            {colaborador.email}
                        </TableCell>

                        <TableCell>
                            {colaborador.departamento}
                        </TableCell>

                        <TableCell align="right">
                            <Chip
                                label={
                                colaborador.ativo
                                    ? 'Ativo'
                                    : 'Inativo'
                                }
                                color={
                                colaborador.ativo
                                    ? 'success'
                                    : 'error'
                                }
                                size="small"
                            />
                        </TableCell>

                        <TableCell align="right">
                            <IconButton
                                size="small"
                                onClick={() =>
                                navigate(`/colaboradores/editar/${colaborador.id}`)
                                }
                            >
                                <EditOutlinedIcon fontSize="small" />
                            </IconButton>

                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => abrirModalExcluir(String(colaborador.id))}
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            )}
        </Box>
        <Dialog
            open={modalAberto}
            onClose={fecharModalExcluir}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle fontWeight={600}>
                Desativar colaborador
            </DialogTitle>

            <DialogContent>
                <DialogContentText color="#637381">
                Tem certeza que deseja desativar este colaborador?
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={fecharModalExcluir}
                    sx={{ textTransform: 'none', color: '#637381' }}
                >
                Cancelar
                </Button>

                <Button
                    onClick={excluirColaborador}
                    variant="contained"
                    color="error"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                Desativar
                </Button>
            </DialogActions>
            </Dialog>
        </Box>
    );
}

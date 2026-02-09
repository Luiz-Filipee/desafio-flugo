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
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import Sidebar from '../../components/Sidebar';
import type { Colaborador } from '../../types/Colaborador';

type Ordem = 'asc' | 'desc';

export default function ListaColaboradores() {
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

  const handleOrdenar = (campo: keyof Colaborador) => {
    const isAsc = ordenarPor === campo && ordem === 'asc';
    setOrdem(isAsc ? 'desc' : 'asc');
    setOrdenarPor(campo);
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}

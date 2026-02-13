import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    try {
      setCarregando(true);
      setErro('');

      await login(email, senha);

      navigate('/colaboradores');
    } catch (e) {
      setErro('E-mail ou senha inválidos');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#F9FAFB"
    >
      <Paper
        elevation={0}
        sx={{
          width: 420,
          p: 4,
          borderRadius: 3,
          boxShadow: '0px 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <Box display="flex" justifyContent="center" mb={3}>
          <img
            src="/src/assets/logo-flugo.png"
            alt="Flugo"
            height={36}
          />
        </Box>

        <Typography
          fontSize={22}
          fontWeight={700}
          textAlign="center"
          color="#212B36"
          mb={1}
        >
          Acesse sua conta
        </Typography>

        <Typography
          fontSize={14}
          color="#637381"
          textAlign="center"
          mb={4}
        >
          Entre para gerenciar seus colaboradores
        </Typography>

        <TextField
          label="E-mail"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          size="small"
          sx={{ mb: 3 }}
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        {erro && (
          <Typography
            color="error"
            fontSize={13}
            mb={2}
            textAlign="center"
          >
            {erro}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={carregando || !email || !senha}
          sx={{
            backgroundColor: '#22C55E',
            textTransform: 'none',
            fontWeight: 700,
            height: 42,
            '&:hover': {
              backgroundColor: '#16A34A',
            },
          }}
        >
          {carregando ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            'Entrar'
          )}
        </Button>

        <Typography
          fontSize={12}
          color="#9CA3AF"
          textAlign="center"
          mt={3}
        >
          © {new Date().getFullYear()} Flugo. Todos os direitos reservados.
        </Typography>
      </Paper>
    </Box>
  );
}

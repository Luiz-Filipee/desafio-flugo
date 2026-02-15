import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';

export default function CriarConta() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState('');

    const handleCriarConta = async () => {
        if (senha !== confirmarSenha) {
        setErro('As senhas não coincidem');
        return;
        }

        try {
        setCarregando(true);
        setErro('');

        await register(email, senha);

        navigate('/colaboradores');
        } catch (e: any) {
        setErro('Erro ao criar conta. Verifique os dados.');
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
                <Box display="flex" justifyContent="center" mb={3}>
                <img src="/src/assets/logo-flugo.png" alt="Flugo" height={36} />
                </Box>

                <Typography fontSize={22} fontWeight={700} textAlign="center" mb={1}>
                Criar conta
                </Typography>

                <Typography fontSize={14} color="#637381" textAlign="center" mb={4}>
                Crie sua conta para acessar o sistema
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
                sx={{ mb: 2 }}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                />

                <TextField
                label="Confirmar senha"
                type="password"
                fullWidth
                size="small"
                sx={{ mb: 3 }}
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                />

                {erro && (
                <Typography color="error" fontSize={13} mb={2} textAlign="center">
                    {erro}
                </Typography>
                )}

                <Button
                fullWidth
                variant="contained"
                onClick={handleCriarConta}
                disabled={carregando || !email || !senha || !confirmarSenha}
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
                    'Criar conta'
                )}
                </Button>

                <Button
                fullWidth
                onClick={() => navigate('/login')}
                sx={{
                    mt: 2,
                    textTransform: 'none',
                    fontSize: 14,
                }}
                >
                Já tenho conta
                </Button>
            </Paper>

            <Snackbar
                open={sucesso}
                autoHideDuration={3000}
                message="Conta criada com sucesso!"
                onClose={() => setSucesso(false)}
            />

            <Snackbar
                open={!!erro}
                autoHideDuration={3000}
                message="Erro ao criar conta!"
                onClose={() => setErro('')}
            />
        </Box>
    );
}

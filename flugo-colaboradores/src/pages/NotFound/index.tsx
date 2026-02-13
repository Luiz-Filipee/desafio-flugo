import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#F9FAFB"
    >
      <Box
        textAlign="center"
        p={6}
        borderRadius={2}
        bgcolor="#FFFFFF"
        boxShadow="0px 10px 25px rgba(0,0,0,0.08)"
        maxWidth={420}
      >
        <Typography
          fontSize={72}
          fontWeight={700}
          color="#22C55E"
        >
          404
        </Typography>

        <Typography
          fontSize={20}
          fontWeight={600}
          mb={1}
        >
          Página não encontrada
        </Typography>

        <Typography
          fontSize={14}
          color="#6B7280"
          mb={4}
        >
          A página que você tentou acessar não existe ou foi movida.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
          }}
        >
          Voltar para o início
        </Button>
      </Box>
    </Box>
  );
}

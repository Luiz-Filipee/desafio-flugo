import { Box, LinearProgress, Typography } from '@mui/material';

interface Props {
  progresso: number;
}

export default function Cabecalho({ progresso }: Props) {
  return (
    <Box px={4} py={2} bgcolor="#FFF" borderBottom="1px solid #E5E7EB">
      <Typography variant="body2" color="text.secondary">
        Colaboradores • Cadastrar Colaborador
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progresso}
        sx={{
          mt: 1,
          height: 4,
          borderRadius: 2,
          backgroundColor: '#E5E7EB',
        }}
      />
    </Box>
  );
}

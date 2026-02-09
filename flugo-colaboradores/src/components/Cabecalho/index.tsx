import { Box, LinearProgress, Typography } from '@mui/material';

interface CabecalhoProps {
  progresso: number;
}

export default function Cabecalho({ progresso }: CabecalhoProps) {
  return (
    <Box px={4} py={2} bgcolor="#FFFFFF">
      <Box display="flex" alignItems="center" gap={2}>
        <LinearProgress
          variant="determinate"
          value={progresso}
          sx={{
            flex: 1,
            height: 8,
            borderRadius: 4,
          }}
        />

        <Typography fontSize={14} fontWeight={500}>
          {progresso}%
        </Typography>
      </Box>
    </Box>
  );
}

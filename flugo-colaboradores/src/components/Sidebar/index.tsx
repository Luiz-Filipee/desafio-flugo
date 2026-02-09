import { Box, Typography } from '@mui/material';

export default function Sidebar() {
  return (
    <Box
      width={240}
      borderRight="1px solid #E5E7EB"
      p={2}
      bgcolor="#FFFFFF"
    >
      <Typography fontWeight={600}>Flugo</Typography>
    </Box>
  );
}

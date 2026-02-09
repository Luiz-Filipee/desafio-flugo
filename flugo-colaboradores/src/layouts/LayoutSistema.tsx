import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';

export default function LayoutSistema({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} bgcolor="#F9FAFB">
        {children}
      </Box>
    </Box>
  );
}

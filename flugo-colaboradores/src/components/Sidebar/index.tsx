import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
} from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

export default function Sidebar() {
  const [aberto, setAberto] = useState(true);
  const navigate = useNavigate();

  return (
    <Box
      width={240}
      borderRight="1px solid #E5E7EB"
      bgcolor="#FFFFFF"
      minHeight="100vh"
    >
      <Box p={2}>
        <Typography fontWeight={600} fontSize={18}>
          <img height={28} width={75} src="/src/assets/logo-flugo.png" alt="logo-fluxo" />
        </Typography>
      </Box>

      <List disablePadding>
        <ListItemButton
          onClick={() => setAberto(!aberto)}
          sx={{
            px: 2,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#F3F4F6',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <PeopleOutlineIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Colaboradores"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 500,
            }}
          />

          <IconButton
            size="small"
            sx={{
              transform: aberto ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: '0.2s',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </ListItemButton>

        <Collapse in={!aberto} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 6,
                py: 1,
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }}
              onClick={() => navigate('/colaboradores')}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <FormatListBulletedOutlinedIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText
                primary="Listagem de colaboradores"
                primaryTypographyProps={{
                  fontSize: 13,
                }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{
                pl: 6,
                py: 1,
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                },
              }}
              onClick={() => navigate('/colaboradores/novo')}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <PersonAddAltOutlinedIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText
                primary="Cadastro de colaborador"
                primaryTypographyProps={{
                  fontSize: 13,
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
}

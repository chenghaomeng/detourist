import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { NaturalSearchFlow } from './NaturalSearchFlow';

interface GoogleMapsSidebarProps {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  isSemanticMode: boolean;
}

export function GoogleMapsSidebar({
  open,
  onClose,
  searchQuery,
  isSemanticMode,
}: GoogleMapsSidebarProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      variant="persistent"
      sx={{
        width: open ? 400 : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 400,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h6" component="h1">
              Natural Search Routing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Describe your drive, not just your destination
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
          }}
        >
          <NaturalSearchFlow 
            searchQuery={searchQuery} 
            isSemanticMode={isSemanticMode} 
          />
        </Box>
      </Box>
    </Drawer>
  );
}

interface HamburgerMenuButtonProps {
  onClick: () => void;
}

export function HamburgerMenuButton({ onClick }: HamburgerMenuButtonProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: '8px',
        boxShadow: '0 1px 6px rgba(32,33,36,.28)',
      }}
    >
      <IconButton 
        onClick={onClick}
        sx={{
          p: 1.5,
          '&:hover': {
            backgroundColor: 'rgba(95, 99, 104, 0.08)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
}



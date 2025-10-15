import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { theme } from './theme';
import { GoogleMapsSearchBar } from './components/GoogleMapsSearchBar';
import { GoogleMapsSidebar, HamburgerMenuButton } from './components/GoogleMapsSidebar';
import { SemanticMapView } from './components/SemanticMapView';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSemanticMode, setIsSemanticMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      setIsSidebarOpen(true);
    }
  };

  const handleSemanticModeToggle = () => {
    setIsSemanticMode(!isSemanticMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: 'background.default',
        }}
      >
        {/* Map View */}
        <SemanticMapView searchQuery={searchQuery} isSemanticMode={isSemanticMode} />

        {/* Sidebar */}
        <GoogleMapsSidebar
          open={isSidebarOpen}
          onClose={toggleSidebar}
          searchQuery={searchQuery}
          isSemanticMode={isSemanticMode}
        />

        {/* Search Bar Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            left: isSidebarOpen ? 424 : 24,
            right: 24,
            transition: 'left 0.3s ease',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          {/* Hamburger Menu - Only show when sidebar is closed */}
          {!isSidebarOpen && <HamburgerMenuButton onClick={toggleSidebar} />}
          
          {/* Search Bar */}
          <GoogleMapsSearchBar
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            isSemanticMode={isSemanticMode}
            onSemanticModeToggle={handleSemanticModeToggle}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

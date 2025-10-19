import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Box,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsIcon from '@mui/icons-material/Directions';

interface GoogleMapsSearchBarProps {
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  isSemanticMode: boolean;
  onSemanticModeToggle: () => void;
}

export function GoogleMapsSearchBar({
  onSearchChange,
  onSearchSubmit,
  isSemanticMode,
  onSemanticModeToggle,
}: GoogleMapsSearchBarProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(value);
  };

  const handleClear = () => {
    setValue('');
    onSearchChange('');
  };

  return (
    <Paper
      elevation={isFocused ? 8 : 2}
      sx={{
        width: '100%',
        maxWidth: '600px',
        borderRadius: '8px',
        transition: 'box-shadow 0.2s',
      }}
    >
      <Box sx={{ p: 1 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isSemanticMode ? "Describe your ideal drive..." : "Search for a place"}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {value && (
                    <IconButton size="small" onClick={handleClear} edge="end">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton 
                    size="small" 
                    onClick={onSemanticModeToggle}
                    edge="end"
                    color={isSemanticMode ? 'primary' : 'default'}
                  >
                    <DirectionsIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                '& fieldset': {
                  border: 'none',
                },
                backgroundColor: 'background.paper',
              },
            }}
          />
        </form>
        {isSemanticMode && (
          <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Chip
              label="Semantic Mode"
              size="small"
              color="primary"
              variant="outlined"
              icon={<DirectionsIcon />}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}



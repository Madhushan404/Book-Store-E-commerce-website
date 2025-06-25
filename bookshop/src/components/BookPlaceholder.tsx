import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface BookPlaceholderProps {
  title?: string;
  author?: string;
  height?: number | string;
}

const PlaceholderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  overflow: 'hidden',
}));

const BookPlaceholder: React.FC<BookPlaceholderProps> = ({ 
  title = 'Book Title', 
  author = 'Author Name',
  height = 280 
}) => {
  return (
    <PlaceholderContainer sx={{ height }}>
      <MenuBookIcon sx={{ fontSize: 80, color: '#2C1810', opacity: 0.7, mb: 2 }} />
      
      {title && (
        <Typography 
          variant="subtitle1" 
          align="center" 
          sx={{ 
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>
      )}
      
      {author && (
        <Typography 
          variant="body2" 
          align="center"
          sx={{ 
            color: 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
        >
          {author}
        </Typography>
      )}
    </PlaceholderContainer>
  );
};

export default BookPlaceholder; 
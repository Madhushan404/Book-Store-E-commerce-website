import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Button,
  Chip,
  CardActionArea,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { 
  BookVolume, 
  getOptimalImageUrl, 
  getSecureImageUrl, 
  getAuthorText,
  getDisplayPrice
} from '../utils/api';

interface BookCardProps {
  book: BookVolume;
  onAddToCart?: (book: BookVolume) => void;
  showAddToCart?: boolean;
  isDiscount?: boolean;
  discountPercent?: number;
  variant?: 'default' | 'overlay' | 'simple';
  onClick?: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9 )',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  padding: theme.spacing(2),
  color: 'white',
  '&:hover': {
    opacity: 1,
  },
}));

const DiscountBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  color: 'white',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
}));

const AddToCartButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2C1810 30%, #FF6B6B 90%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF6B6B 30%, #2C1810 90%)',
  },
}));

const StandardBookCard: React.FC<BookCardProps> = ({
  book,
  onAddToCart,
  showAddToCart = true,
  isDiscount = false,
  discountPercent = 0,
  variant = 'default',
  onClick,
}) => {
  const { volumeInfo, id } = book;
  const imageUrl = getSecureImageUrl(getOptimalImageUrl(volumeInfo.imageLinks));
  const authorText = getAuthorText(volumeInfo.authors);
  const { price, isDiscounted, originalPrice } = getDisplayPrice(book);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(book);
    }
  };

  const isLoggedIn = !!localStorage.getItem('token');

  const renderCardContent = () => (
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography 
        variant="h6" 
        component="h3" 
        gutterBottom 
        sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.2,
          height: '2.4em'
        }}
      >
        {volumeInfo.title}
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {authorText}
      </Typography>
      
      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography 
            variant="h6" 
            component="span" 
            color={isDiscounted || isDiscount ? 'error' : 'primary'}
          >
            {price}
          </Typography>
          
          {(isDiscounted || isDiscount) && originalPrice && (
            <Typography
              variant="body2"
              component="span"
              sx={{ ml: 1, textDecoration: 'line-through', opacity: 0.6 }}
            >
              {originalPrice}
            </Typography>
          )}
        </Box>
        
        {showAddToCart && isLoggedIn && (
          <AddToCartButton
            size="small"
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
          >
            Add
          </AddToCartButton>
        )}
      </Box>
    </CardContent>
  );

  const renderOverlayVariant = () => (
    <>
      <CardMedia
        component="img"
        image={imageUrl}
        alt={volumeInfo.title}
        sx={{ 
          height: 280,
          objectFit: 'contain',
          bgcolor: 'rgba(245, 245, 245, 0.05)'
        }}
      />
      
      {renderCardContent()}
      
      <CardOverlay>
        <Typography variant="body2" align="center" paragraph>
          {volumeInfo.description 
            ? `${volumeInfo.description.slice(0, 150)}${volumeInfo.description.length > 150 ? '...' : ''}`
            : 'No description available'}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: 200 }}>
          {showAddToCart && isLoggedIn && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          )}
          
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            component={RouterLink}
            to={`/books/${id}`}
            onClick={(e) => e.stopPropagation()}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            View Details
          </Button>
        </Box>
      </CardOverlay>
    </>
  );

  const renderDefaultVariant = () => (
    <>
      <CardMedia
        component="img"
        image={imageUrl}
        alt={volumeInfo.title}
        sx={{ 
          height: 280,
          objectFit: 'contain',
          bgcolor: 'rgba(245, 245, 245, 0.05)'
        }}
      />
      {renderCardContent()}
    </>
  );

  const renderSimpleVariant = () => (
    <>
      <CardMedia
        component="img"
        image={imageUrl}
        alt={volumeInfo.title}
        sx={{ 
          height: 200,
          objectFit: 'contain',
          bgcolor: 'rgba(255, 255, 255, 0.9)'
        }}
      />
      <CardContent>
        <Typography 
          variant="subtitle1" 
          component="h3" 
          gutterBottom 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {volumeInfo.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {authorText}
        </Typography>
        <Typography variant="h6" color="white" sx={{ mt: 1 }}>
          {price}
        </Typography>
      </CardContent>
    </>
  );

  return (
    <StyledCard>
      {isDiscount && <DiscountBadge label={`${discountPercent}% OFF`} />}
      
      <CardActionArea 
        component={onClick ? 'div' : RouterLink} 
        to={onClick ? undefined : `/books/${id}`}
        onClick={onClick}
        sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        {variant === 'overlay' && renderOverlayVariant()}
        {variant === 'default' && renderDefaultVariant()}
        {variant === 'simple' && renderSimpleVariant()}
      </CardActionArea>
    </StyledCard>
  );
};

export default StandardBookCard; 
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
  Rating,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BusinessIcon from '@mui/icons-material/Business';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TranslateIcon from '@mui/icons-material/Translate';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { fetchBookDetails, BookVolume, getOptimalImageUrl, getSecureImageUrl, getDisplayPrice } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  background: '#fff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: 'linear-gradient(90deg, #2C1810 0%, #FF6B6B 100%)',
  },
}));

const BookImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  maxHeight: '500px',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
  borderRadius: 12,
  transition: 'transform 0.3s ease',
  objectFit: 'contain',
  '&:hover': {
    transform: 'scale(1.03)',
  },
  [theme.breakpoints.down('md')]: {
    maxHeight: '350px',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2C1810 30%, #FF6B6B 90%)',
  border: 0,
  borderRadius: 8,
  boxShadow: '0 3px 5px 2px rgba(44, 24, 16, .3)',
  color: 'white',
  padding: '10px 30px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF6B6B 30%, #2C1810 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(255, 107, 107, 0.3)',
  },
}));

const DescriptionBox = styled(Box)(({ theme }) => ({
  maxHeight: '300px',
  overflowY: 'auto',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '10px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
}));

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookVolume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const loadBookDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const bookData = await fetchBookDetails(id);
        setBook(bookData);
        setError('');
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBookDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (book) {
      addToCart(book);
      setSnackbarMessage(`"${book.volumeInfo.title}" added to cart!`);
      setSnackbarOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (book) {
      addToCart(book);
      navigate('/checkout');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#FF6B6B' }} />
      </Box>
    );
  }

  if (error || !book) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" color="error" align="center">
          {error || 'Book not found'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            component={RouterLink}
            to="/books"
            startIcon={<ArrowBackIcon />}
            variant="contained"
            color="primary"
          >
            Back to Books
          </Button>
        </Box>
      </Container>
    );
  }

  const { volumeInfo, saleInfo, accessInfo } = book;

  const getPrice = () => {
    if (!book) return 'Price not available';
    const priceInfo = getDisplayPrice(book);
    if (priceInfo.isDiscounted) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" color="primary">
            {priceInfo.price}
          </Typography>
          <Typography
            variant="body1"
            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
          >
            {priceInfo.originalPrice}
          </Typography>
          <Chip
            label={`${priceInfo.discountPercentage}% OFF`}
            color="error"
            size="small"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              color: 'white'
            }}
          />
        </Box>
      );
    }
    return priceInfo.price;
  };

  const getBookRating = () => {
    // Google Books API doesn't provide ratings, so we'll use a placeholder
    // In a real application, you might want to implement your own rating system
    return Math.floor(Math.random() * 2) + 3.5; // Random rating between 3.5 and 5
  };

  const imageUrl = getSecureImageUrl(getOptimalImageUrl(volumeInfo.imageLinks));

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 4 }}
      >
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/books" color="inherit">
          Books
        </Link>
        <Typography color="text.primary">
          {volumeInfo.title}
        </Typography>
      </Breadcrumbs>

      <StyledPaper>
        <Grid container spacing={4}>
          {/* Book Image */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
              <BookImage src={imageUrl} alt={volumeInfo.title} />

              {saleInfo?.isEbook && (
                <Chip
                  label="E-Book Available"
                  color="secondary"
                  sx={{ alignSelf: 'center' }}
                />
              )}

              {/* Additional book info card */}
              <Card variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
                <List dense>
                  {volumeInfo.pageCount && (
                    <ListItem>
                      <ListItemIcon>
                        <MenuBookIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Page Count"
                        secondary={volumeInfo.pageCount}
                      />
                    </ListItem>
                  )}
                  {volumeInfo.language && (
                    <ListItem>
                      <ListItemIcon>
                        <TranslateIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Language"
                        secondary={volumeInfo.language.toUpperCase()}
                      />
                    </ListItem>
                  )}
                  {volumeInfo.publishedDate && (
                    <ListItem>
                      <ListItemIcon>
                        <CalendarMonthIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Published Date"
                        secondary={volumeInfo.publishedDate}
                      />
                    </ListItem>
                  )}
                  {volumeInfo.publisher && (
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Publisher"
                        secondary={volumeInfo.publisher}
                      />
                    </ListItem>
                  )}
                </List>
              </Card>
            </Box>
          </Grid>

          {/* Book Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {volumeInfo.title}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {volumeInfo.authors?.join(', ')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={getBookRating()} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {getBookRating().toFixed(1)} rating
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              {getPrice()}
            </Box>

            <Box sx={{ my: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <GradientButton
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                size="large"
                onClick={handleAddToCart}
              >
                Add to Cart
              </GradientButton>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ShoppingBagIcon />}
                size="large"
                onClick={handleBuyNow}
                sx={{
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
                  },
                }}
              >
                Buy Now
              </Button>

           
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Description</Typography>
            <DescriptionBox>
              {volumeInfo.description ? (
                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: volumeInfo.description }} />
              ) : (
                <Typography variant="body1">No description available for this book.</Typography>
              )}
            </DescriptionBox>

            {volumeInfo.categories && volumeInfo.categories.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Categories</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {volumeInfo.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                component={RouterLink}
                to="/books"
                startIcon={<ArrowBackIcon />}
                color="primary"
              >
                Back to Books
              </Button>
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookDetails; 
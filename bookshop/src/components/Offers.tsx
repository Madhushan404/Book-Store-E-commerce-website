import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Skeleton,
  Stack,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchBooks, fetchBooksByCategory, BookVolume, getOptimalImageUrl, getSecureImageUrl, getAuthorText, getDisplayPrice } from '../utils/api';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const OffersSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#2C1810',
  padding: theme.spacing(8, 0),
  color: 'white',
}));

const SuperOfferCard = styled(Card)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  display: 'flex',
  marginBottom: theme.spacing(6),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '5px',
    background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  padding: '4px 16px',
  borderRadius: '20px',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
  zIndex: 2,
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  padding: '8px 24px',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
  },
}));

const BookCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const Offers = () => {
  const [loading, setLoading] = useState(true);
  const [discountedBooks, setDiscountedBooks] = useState<BookVolume[]>([]);
  const [featuredBook, setFeaturedBook] = useState<BookVolume | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const response = await fetchBooks('latest releases', 0, 4, 'newest', 'books');
        setDiscountedBooks(response.items || []);

        const featuredResponse = await fetchBooks('new bestseller', 0, 1, 'newest', 'books');
        if (featuredResponse.items && featuredResponse.items.length > 0) {
          setFeaturedBook(featuredResponse.items[0]);
        }
      } catch (error) {
        console.error('Error loading offer books:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const getBookImage = (book: BookVolume) => {
    return getSecureImageUrl(getOptimalImageUrl(book.volumeInfo.imageLinks));
  };

  const getBookPricing = (book: BookVolume) => {
    return getDisplayPrice(book, true);
  };

  const handleBookClick = (bookId: string) => {
    if (bookId) {
      navigate(`/books/${bookId}`);
    }
  };

  const handleAddToCart = (book: BookVolume, event: React.MouseEvent) => {
    event.stopPropagation();
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    addToCart(book);
    setSnackbarMessage(`"${book.volumeInfo.title}" added to cart!`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <OffersSection>
      <Container maxWidth="lg">
        {/* Super Offer Card */}
        {loading ? (
          <SuperOfferCard>
            <Skeleton
              variant="rectangular"
              sx={{
                width: { xs: '100%', md: 300 },
                height: { xs: 200, md: 400 },
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }}
            />
            <Box sx={{ padding: 3, width: '100%' }}>
              <Skeleton variant="text" width="40%" height={30} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              <Skeleton variant="text" width="70%" height={50} sx={{ mt: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              <Skeleton variant="text" width="90%" height={80} sx={{ mt: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
              <Skeleton variant="rectangular" width="40%" height={50} sx={{ mt: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
            </Box>
          </SuperOfferCard>
        ) : featuredBook ? (
          <SuperOfferCard>
            <DiscountBadge>
              {getBookPricing(featuredBook).discountPercentage || 30}% OFF
            </DiscountBadge>
            <CardMedia
              component="img"
              sx={{
                width: { md: 300 },
                minHeight: { xs: 200, md: 400 },
                objectFit: 'contain',
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                padding: 2,
              }}
              image={getBookImage(featuredBook)}
              alt={featuredBook.volumeInfo.title}
            />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ opacity: 0.7 }}>
                  Featured Book Offer
                </Typography>
                <Typography variant="h4" component="h2" gutterBottom>
                  {featuredBook.volumeInfo.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
                  by {getAuthorText(featuredBook.volumeInfo.authors)}
                </Typography>

                <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

                <Typography variant="body1" paragraph sx={{ opacity: 0.9, mb: 3 }}>
                  {featuredBook.volumeInfo.description
                    ? `${featuredBook.volumeInfo.description.slice(0, 200)}${featuredBook.volumeInfo.description.length > 200 ? '...' : ''}`
                    : 'Discover this amazing book at a special discounted price. Limited time offer available now!'}
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                  <Typography variant="h5" color="#FF6B6B">
                    {getBookPricing(featuredBook).price}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textDecoration: 'line-through', opacity: 0.7 }}
                  >
                    {getBookPricing(featuredBook).originalPrice}
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <RouterLink to={`/books/${featuredBook.id}`} style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
                    <GradientButton
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                    >
                      View Details
                    </GradientButton>
                  </RouterLink>

                  <Button
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                    startIcon={<ShoppingCartIcon />}
                    onClick={(e) => handleAddToCart(featuredBook, e)}
                  >
                    Add to Cart
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </SuperOfferCard>
        ) : (
          <SuperOfferCard>
            <CardMedia
              component="img"
              sx={{
                width: { md: 300 },
                height: { xs: 200, md: 'auto' },
                objectFit: 'cover',
              }}
              image="/image/special-offer.jpg"
              alt="Super Offer"
            />
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="overline" sx={{ opacity: 0.7 }}>
                Limited Time Offer
              </Typography>
              <Typography variant="h3" component="h2" gutterBottom>
                30% Off Bestsellers
              </Typography>
              <Typography variant="body1" paragraph sx={{ opacity: 0.9 }}>
                Get amazing discounts on our bestselling books. Don't miss out on this incredible opportunity
                to expand your library at unbeatable prices. Sale ends soon!
              </Typography>
              <RouterLink to="/books" style={{ textDecoration: 'none', alignSelf: 'flex-start', width: '70%' }}>
                <GradientButton
                  variant="contained"
                  fullWidth
                  startIcon={<LocalOfferIcon />}
                >
                  Shop Now
                </GradientButton>
              </RouterLink>
            </CardContent>
          </SuperOfferCard>
        )}

        {}
        <Grid container spacing={4}>
          {loading ? (
            Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <Skeleton
                    variant="rectangular"
                    height={280}
                    animation="wave"
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                  <CardContent>
                    <Skeleton
                      variant="text"
                      height={28}
                      animation="wave"
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      animation="wave"
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      height={36}
                      width="100%"
                      animation="wave"
                      sx={{ mt: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            discountedBooks.map((book) => {
              const pricing = getBookPricing(book);
              return (
                <Grid item xs={12} sm={6} md={3} key={book.id}>
                  <BookCard onClick={() => handleBookClick(book.id)}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="280"
                        image={getBookImage(book)}
                        alt={book.volumeInfo.title}
                        sx={{ objectFit: 'contain', bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                      />
                      <DiscountBadge>
                        {pricing.discountPercentage}% OFF
                      </DiscountBadge>
                    </Box>
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h3"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {book.volumeInfo.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          opacity: 0.7,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" component="span" sx={{ color: '#FF6B6B' }}>
                          {pricing.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ textDecoration: 'line-through', opacity: 0.5 }}
                        >
                          {pricing.originalPrice}
                        </Typography>
                      </Box>
                      <GradientButton
                        variant="contained"
                        fullWidth
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => handleAddToCart(book, e)}
                      >
                        Add to Cart
                      </GradientButton>
                    </CardContent>
                  </BookCard>
                </Grid>
              );
            })
          )}
        </Grid>
      </Container>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </OffersSection>
  );
};

export default Offers; 
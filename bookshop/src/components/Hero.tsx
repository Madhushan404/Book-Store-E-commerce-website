import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Button, Paper, Skeleton, Rating, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { fadeIn, slideUp, pulse, gradientFlow, durations, timingFunctions } from '../utils/animations';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { fetchBooks, BookVolume, getOptimalImageUrl, getSecureImageUrl, getAuthorText, getDisplayPrice } from '../utils/api';
import { useCart } from '../contexts/CartContext';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  animation: `${pulse} 2s ${timingFunctions.smooth} infinite`,
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(255, 105, 135, .4)',
  },
}));

const HotLabel = styled(Box)({
  position: 'absolute',
  top: 10,
  right: 10,
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontWeight: 'bold',
  animation: `${pulse} 2s ${timingFunctions.smooth} infinite`,
  zIndex: 2,
});

const FeaturedBookImage = styled('img')(({ theme }) => ({
  width: '70%',
  height: 'auto',
  borderRadius: '4px',
  display: 'block',
  margin: '0 auto',
  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 70,
  right: -15,
  backgroundColor: '#FF6B6B',
  color: 'white',
  padding: '8px 20px',
  transform: 'rotate(20deg)',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
  borderRadius: '4px',
  zIndex: 2,
  animation: `${pulse} 2s ${timingFunctions.smooth} infinite`,
}));

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const [featuredBook, setFeaturedBook] = useState<BookVolume | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadFeaturedBook = async () => {
      try {
        const response = await fetchBooks('new releases', 0, 1, 'newest', 'books');
        if (response.items && response.items.length > 0) {
          setFeaturedBook(response.items[0]);
        }
      } catch (error) {
        console.error('Error loading featured book:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedBook();
  }, []);

  const handleViewBook = () => {
    if (featuredBook) {
      navigate(`/books/${featuredBook.id}`);
    }
  };

  const handleAddToCart = () => {
    if (featuredBook) {
      addToCart(featuredBook);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const getRandomRating = () => {
    return (Math.random() * 1.5 + 3.5).toFixed(1);
  };

  const getBookPrice = () => {
    if (!featuredBook) return null;
    const priceInfo = getDisplayPrice(featuredBook);
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {priceInfo.price}
        </Typography>
        {priceInfo.isDiscounted && (
          <Typography 
            variant="body2" 
            sx={{ ml: 1, textDecoration: 'line-through', opacity: 0.7 }}
          >
            {priceInfo.originalPrice}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box 
      sx={{
        backgroundImage: 'url("/image/Hero.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        animation: `${gradientFlow} 15s ${timingFunctions.smooth} infinite`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)',
          animation: `${gradientFlow} 15s ${timingFunctions.smooth} infinite`,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h1"
              color="#FF8E53"
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                opacity: 0,
                animation: `${fadeIn} 0.8s ${timingFunctions.smooth} forwards`,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Discover Your Next
              <br />
              Favorite Book
            </Typography>
            <Typography 
              color="white" 
              paragraph
              sx={{
                opacity: 0,
                animation: `${fadeIn} 0.8s ${timingFunctions.smooth} forwards`,
                animationDelay: '0.2s',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Explore our vast collection of books across all genres.
              Find the perfect read for your next adventure. We have thousands
              of titles available with new releases added regularly.
            </Typography>
            <Box sx={{ opacity: 0, animation: `${fadeIn} 0.8s ${timingFunctions.smooth} forwards`, animationDelay: '0.4s' }}>
              <RouterLink to="/books" style={{ textDecoration: 'none' }}>
                <GradientButton variant="contained" size="large" startIcon={<AutoStoriesIcon />}>
                  Browse Books
                </GradientButton>
              </RouterLink>
            </Box>
          </Grid>
          
          <Grid item xs={10} md={4}>
            <Paper
              elevation={8}
              sx={{
                p: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                transform: 'rotate(-3deg)',
                transition: `all ${durations.medium} ${timingFunctions.smooth}`,
                color: 'white',
                opacity: 0,
                animation: `${fadeIn} 0.8s ${timingFunctions.smooth} forwards`,
                animationDelay: '0.6s',
                borderRadius: 2,
                '&:hover': {
                  transform: 'rotate(0deg) scale(1.02)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                },
              }}
            >
              <HotLabel>FEATURED</HotLabel>
              
              {loading ? (
                <>
                  <Skeleton 
                    variant="rectangular" 
                    width="70%" 
                    height={200} 
                    sx={{ 
                      margin: '0 auto', 
                      borderRadius: 1, 
                      bgcolor: 'rgba(255, 255, 255, 0.1)' 
                    }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="80%" 
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.1)', 
                      margin: '8px auto' 
                    }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="60%" 
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.1)', 
                      margin: '0 auto' 
                    }} 
                  />
                  <Skeleton 
                    variant="text" 
                    width="100%" 
                    height={80} 
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.1)' 
                    }} 
                  />
                </>
              ) : featuredBook ? (
                <>
                  <FeaturedBookImage
                    src={getSecureImageUrl(getOptimalImageUrl(featuredBook.volumeInfo.imageLinks))}
                    alt={featuredBook.volumeInfo.title}
                  />
                  
                  {getDisplayPrice(featuredBook, true).isDiscounted && (
                    <PriceTag>
                      {getDisplayPrice(featuredBook, true).discountPercentage}% OFF
                    </PriceTag>
                  )}
                  
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      }}
                    >
                      {featuredBook.volumeInfo.title}
                    </Typography>
                    
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        opacity: 0.9,
                        mb: 1 
                      }}
                    >
                      by {getAuthorText(featuredBook.volumeInfo.authors)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                      <Rating value={parseFloat(getRandomRating())} precision={0.1} readOnly />
                      <Typography sx={{ ml: 1 }}>
                        {getRandomRating()}
                      </Typography>
                    </Box>
                    
                    {getBookPrice()}
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 3,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {featuredBook.volumeInfo.description?.slice(0, 150)}
                      {featuredBook.volumeInfo.description && featuredBook.volumeInfo.description.length > 150 ? '...' : ''}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleViewBook}
                      >
                        View Details
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                        sx={{ 
                          color: 'white', 
                          borderColor: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  <img
                    src="/image/featured-book.jpg"
                    alt="Featured Book"
                    style={{
                      width: '70%',
                      height: 'auto',
                      borderRadius: '4px',
                      marginLeft: '15%',
                      transition: `all ${durations.medium} ${timingFunctions.smooth}`,
                    }}
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mt: 2, 
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Featured Book of the Week
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="white" 
                    paragraph
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    Discover why this book is making waves in the literary world.
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <GradientButton variant="contained">
                      Pre-Order Book
                    </GradientButton>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Book added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Hero; 
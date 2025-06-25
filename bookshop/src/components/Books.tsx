import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Tabs,
  Tab,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { fetchBooks, fetchBooksByCategory, BookVolume, getOptimalImageUrl, getSecureImageUrl } from '../utils/api';

const BooksSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: '#f5f5f5',
}));

const BookCard = styled(Card)(({ theme }) => ({
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
  '&:hover .overlay': {
    opacity: 1,
  },
}));

const BookOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  padding: theme.spacing(2),
  color: 'white',
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

const TabPanel = styled(Box)({
  padding: '24px 0',
});

const Books = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [popularBooks, setPopularBooks] = useState<BookVolume[]>([]);
  const [newReleases, setNewReleases] = useState<BookVolume[]>([]);
  const [fictionBooks, setFictionBooks] = useState<BookVolume[]>([]);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
      
        const popularResponse = await fetchBooks('popular books', 0, 8, 'relevance');
        setPopularBooks(popularResponse.items || []);

      
        const newReleasesResponse = await fetchBooks('new releases', 0, 8, 'newest');
        setNewReleases(newReleasesResponse.items || []);

      
        const fictionResponse = await fetchBooksByCategory('fiction', 0, 8);
        setFictionBooks(fictionResponse.items || []);
      } catch (error) {
        console.error('Error loading books:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getBookPrice = (book: BookVolume) => {
    if (book?.saleInfo?.retailPrice?.amount) {
      return `$${book.saleInfo.retailPrice.amount.toFixed(2)}`;
    } else if (book?.saleInfo?.listPrice?.amount) {
      return `$${book.saleInfo.listPrice.amount.toFixed(2)}`;
    } else {
      return '$9.99';
    }
  };

  const handleBookClick = (bookId: string) => {
    if (bookId) {
      navigate(`/books/${bookId}`);
    }
  };

  const getBookImage = (book: BookVolume) => {
    return getSecureImageUrl(getOptimalImageUrl(book.volumeInfo.imageLinks));
  };

  const renderBookGrid = (books: BookVolume[]) => (
    <Grid container spacing={4}>
      {loading
        ? Array.from(new Array(8)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={280} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        : books.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id || index}>
              <BookCard 
                onClick={() => handleBookClick(book.id)}
              >
                <CardMedia
                  component="img"
                  height="280"
                  image={getBookImage(book)}
                  alt={book.volumeInfo.title}
                  sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
                />
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
                    color="text.secondary"
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {getBookPrice(book)}
                  </Typography>
                </CardContent>
                <BookOverlay className="overlay">
                  <Typography variant="body1" align="center" paragraph>
                    {book.volumeInfo.description?.slice(0, 120) + '...' || 'No description available'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    {isLoggedIn && (
                      <GradientButton 
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
      
                        }}
                      >
                        Add to Cart
                      </GradientButton>
                    )}
                    <Button
                      variant="outlined"
                      color="inherit"
                      component={RouterLink}
                      to={`/books/${book.id}`}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ 
                        borderColor: 'white', 
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </BookOverlay>
              </BookCard>
            </Grid>
          ))}
    </Grid>
  );

  return (
    <BooksSection>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Our Collection
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            centered
          >
            <Tab label="Popular Books" />
            <Tab label="New Releases" />
            <Tab label="Fiction" />
          </Tabs>
        </Box>

        <TabPanel hidden={activeTab !== 0}>
          {renderBookGrid(popularBooks)}
        </TabPanel>

        <TabPanel hidden={activeTab !== 1}>
          {renderBookGrid(newReleases)}
        </TabPanel>

        <TabPanel hidden={activeTab !== 2}>
          {renderBookGrid(fictionBooks)}
        </TabPanel>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <RouterLink to="/books" style={{ textDecoration: 'none' }}>
            <GradientButton
              variant="contained"
              size="large"
              sx={{ minWidth: 200 }}
            >
              Visit Book Store
            </GradientButton>
          </RouterLink>
        </Box>
      </Container>
    </BooksSection>
  );
};

export default Books; 
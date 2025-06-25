import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  Grid,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Chip,
  Fade,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import { searchBooks, BookVolume, getOptimalImageUrl, getSecureImageUrl, getAuthorText, getDisplayPrice } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { fadeIn, slideUp } from '../utils/animations';

const SearchContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  animation: `${fadeIn} 0.6s ease-in-out`,
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  animation: `${slideUp} 0.6s ease-in-out`,
}));

const ResultCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const BookImage = styled(CardMedia)(({ theme }) => ({
  width: 120,
  objectFit: 'cover',
  backgroundColor: theme.palette.grey[100],
})) as typeof CardMedia;

const PriceChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #2C1810 30%, #FF6B6B 90%)',
  color: 'white',
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  color: 'white',
  fontSize: '0.75rem',
}));

const SearchBooks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<BookVolume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await searchBooks(query, 15);
      setResults(response.items || []);
      setSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching for books. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query);
    }, 500),
    [performSearch]
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      setResults([]);
      setSearched(false);
    }
  }, [searchQuery, debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setSearched(false);
  };

  const handleViewBook = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  const handleAddToCart = (book: BookVolume, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book);
    const button = e.currentTarget as HTMLButtonElement;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.disabled = true;
    setTimeout(() => {
      if (button) {
        button.textContent = originalText;
        button.disabled = false;
      }
    }, 1500);
  };

  const renderBookPrice = (book: BookVolume) => {
    const priceInfo = getDisplayPrice(book);
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <PriceChip label={priceInfo.price} />
        
        {priceInfo.isDiscounted && priceInfo.discountPercentage && (
          <DiscountChip 
            label={`${priceInfo.discountPercentage}% OFF`} 
            size="small" 
          />
        )}
      </Box>
    );
  };

  return (
    <SearchContainer maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Search Books
      </Typography>
      
      <SearchBar elevation={0}>
        <form onSubmit={handleSearch} style={{ width: '100%', display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={handleClearSearch}
                    edge="end"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
          <Button 
            type="submit"
            variant="contained" 
            sx={{ 
              ml: 2,
              background: 'linear-gradient(45deg, #2C1810 30%, #FF6B6B 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #231209 30%, #e65f5f 90%)',
              }
            }}
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </form>
      </SearchBar>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : searched && results.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No books found for "{searchQuery}"
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search terms or browse our categories instead.
          </Typography>
        </Paper>
      ) : results.length > 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            Search Results ({results.length})
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {results.map((book) => (
              <Grid item xs={12} key={book.id}>
                <ResultCard onClick={() => handleViewBook(book.id)}>
                  <BookImage
                    component="img"
                    image={getSecureImageUrl(getOptimalImageUrl(book.volumeInfo.imageLinks))}
                    alt={book.volumeInfo.title}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {book.volumeInfo.title}
                      </Typography>
                      
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {getAuthorText(book.volumeInfo.authors)}
                      </Typography>
                      
                      {book.volumeInfo.categories && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          {book.volumeInfo.categories.slice(0, 2).map((category, index) => (
                            <Chip 
                              key={index}
                              label={category} 
                              size="small"
                              variant="outlined" 
                              color="primary"
                            />
                          ))}
                        </Box>
                      )}
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2,
                        }}
                      >
                        {book.volumeInfo.description || 'No description available for this book.'}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1
                      }}>
                        {renderBookPrice(book)}
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<InfoIcon />}
                            onClick={() => handleViewBook(book.id)}
                          >
                            Details
                          </Button>
                          
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ShoppingCartIcon />}
                            onClick={(e) => handleAddToCart(book, e)}
                            sx={{ 
                              background: 'linear-gradient(45deg, #2C1810 30%, #FF6B6B 90%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #231209 30%, #e65f5f 90%)',
                              }
                            }}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Box>
                </ResultCard>
              </Grid>
            ))}
          </Grid>
        </>
      ) : searched ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No results found.
        </Typography>
      ) : null}
    </SearchContainer>
  );
};

export default SearchBooks; 
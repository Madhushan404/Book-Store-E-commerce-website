import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Pagination,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { fadeIn, slideUp, scaleUp, hoverLift, durations, timingFunctions } from '../utils/animations';
import { fetchBooks, fetchBooksByCategory, BookVolume, getOptimalImageUrl, getSecureImageUrl, getDisplayPrice } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const BookListSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: 'linear-gradient(135deg, #2C1810 0%, #1a0f0a 100%)',
  color: 'white',
  minHeight: '100vh',
  animation: `${fadeIn} ${durations.long} ${timingFunctions.smooth}`,
}));

const BookCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  animation: `${scaleUp} ${durations.medium} ${timingFunctions.smooth}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    transition: `all ${durations.medium} ${timingFunctions.smooth}`,
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
      transition: `all ${durations.medium} ${timingFunctions.smooth}`,
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF6B6B',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2C1810 30%, #FF6B6B 90%)',
  border: 0,
  borderRadius: 8,
  boxShadow: '0 3px 5px 2px rgba(44, 24, 16, .3)',
  color: 'white',
  padding: '8px 24px',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  '&:hover': {
    background: 'linear-gradient(45deg, #FF6B6B 30%, #2C1810 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(255, 107, 107, 0.3)',
  },
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 300,
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
}));

const PriceTag = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  borderRadius: '4px',
  padding: '6px 10px',
  color: 'white',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  position: 'relative',
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: -10,
  background: '#FF6B6B',
  color: 'white',
  borderRadius: '50%',
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  zIndex: 1,
}));

const categories = [
  'all',
  'Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'History',
  'Biography',
  'Self-Help',
  'Business',
  'Computers',
  'Cooking',
  'Education',
  'Health',
  'Travel'
];

const BookList = () => {
  const [books, setBooks] = useState<BookVolume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const booksPerPage = 12;
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadBooks = async () => {
    setLoading(true);
    try {
      if (category !== 'all') {
        const response = await fetchBooksByCategory(
          category,
          (page - 1) * booksPerPage,
          booksPerPage
        );
        setBooks(response.items || []);
        setTotalItems(response.totalItems);
        setTotalPages(Math.ceil(Math.min(response.totalItems, 100) / booksPerPage)); // Google Books API limits to 100 results max
      } else if (searchTerm) {
        const response = await fetchBooks(
          searchTerm,
          (page - 1) * booksPerPage,
          booksPerPage,
          sortBy as 'relevance' | 'newest'
        );
        setBooks(response.items || []);
        setTotalItems(response.totalItems);
        setTotalPages(Math.ceil(Math.min(response.totalItems, 100) / booksPerPage));
      } else {
        // Default search - popular books
        const response = await fetchBooks(
          'popular books',
          (page - 1) * booksPerPage,
          booksPerPage,
          sortBy as 'relevance' | 'newest'
        );
        setBooks(response.items || []);
        setTotalItems(response.totalItems);
        setTotalPages(Math.ceil(Math.min(response.totalItems, 100) / booksPerPage));
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [category, page, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    loadBooks();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBookImage = (book: BookVolume) => {
    return getSecureImageUrl(getOptimalImageUrl(book.volumeInfo.imageLinks));
  };

  const handleAddToCart = (book: BookVolume) => {
    addToCart(book);
    setSnackbarMessage(`"${book.volumeInfo.title}" added to cart!`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <BookListSection>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{
            mb: 6,
            animation: `${slideUp} ${durations.long} ${timingFunctions.smooth}`,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Our Book Collection
        </Typography>

        {/* Filters */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            mb: 6,
            animation: `${slideUp} ${durations.long} ${timingFunctions.smooth}`,
            animationDelay: '0.2s',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                label="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1); // Reset to first page
                  }}
                  sx={{
                    color: 'white',
                    transition: `all ${durations.medium} ${timingFunctions.smooth}`,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    color: 'white',
                    transition: `all ${durations.medium} ${timingFunctions.smooth}`,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  }}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <GradientButton
                fullWidth
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{ height: '56px' }}
              >
                Search
              </GradientButton>
            </Grid>
          </Grid>
        </Box>

        {/* Results Count */}
        {!loading && totalItems > 0 && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Chip
              label={`${totalItems.toLocaleString()} books found`}
              color="secondary"
              variant="outlined"
            />
          </Box>
        )}

        {/* Loading indicator */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress sx={{ color: '#FF6B6B' }} />
          </Box>
        ) : books.length === 0 ? (
          <Box sx={{ textAlign: 'center', my: 8 }}>
            <Typography variant="h6">No books found. Try a different search term or category.</Typography>
          </Box>
        ) : (
          <>
            {/* Book Grid */}
            <Grid container spacing={4}>
              {books.map((book, index) => (
                <Grid
                  item
                  key={book.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{
                    animation: `${scaleUp} ${durations.medium} ${timingFunctions.smooth}`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <BookCard onClick={() => navigate(`/books/${book.id}`)}>
                    {/* Display discount badge if available */}
                    {getDisplayPrice(book).isDiscounted && (
                      <DiscountBadge>
                        -{getDisplayPrice(book).discountPercentage}%
                      </DiscountBadge>
                    )}
                    <StyledCardMedia
                      image={getBookImage(book)}
                      sx={{ height: 300 }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {book.volumeInfo.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <PriceTag>
                            {getDisplayPrice(book).price}
                          </PriceTag>
                          {getDisplayPrice(book).isDiscounted && (
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: 'line-through',
                                color: 'rgba(255,255,255,0.6)',
                                ml: 1
                              }}
                            >
                              {getDisplayPrice(book).originalPrice}
                            </Typography>
                          )}
                        </Box>
                        <GradientButton
                          size="small"
                          variant="contained"
                          startIcon={<ShoppingCartIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(book);
                          }}
                        >
                          Add to Cart
                        </GradientButton>
                      </Box>
                    </CardContent>
                  </BookCard>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="secondary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'white',
                    },
                    '& .Mui-selected': {
                      backgroundColor: 'rgba(255, 107, 107, 0.3)',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </BookListSection>
  );
};

export default BookList; 
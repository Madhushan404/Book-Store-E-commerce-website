import React from 'react';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import Gift from './pages/Gift';
import Footer from './components/Footer';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Cart from './pages/Cart';
import VoucherManager from './components/VoucherManager';
import Checkout from './pages/Checkout';
import UserAccount from './pages/UserAccount';
import { authService } from './utils/api';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C1810',
    },
    secondary: {
      main: '#FF6B6B',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const user = authService.getCurrentUser();
  
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CartProvider>
          <CssBaseline />
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box 
              component="main" 
              sx={{ 
                flexGrow: 1,
                pt: { xs: 8, sm: 9 }, 
                mt: 1, 
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/gift" element={<Gift />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account" element={<UserAccount />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/vouchers" element={<VoucherManager />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  InputBase,
  styled,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fade,
  Badge,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  AccountCircle as AccountIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { fadeIn, slideInLeft, slideInRight, hoverLift, durations, timingFunctions } from '../utils/animations';
import { useCart } from '../contexts/CartContext';
import { authService } from '../utils/api';
import { GradientButton } from '../utils/commonStyles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(44, 24, 16, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  position: 'fixed',
  zIndex: 1000,
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  '&:hover': {
    background: 'rgba(44, 24, 16, 0.9)',
  },
}));

const Logo = styled(RouterLink)(({ theme }) => ({
  color: '#FF6B6B',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  animation: `${fadeIn} ${durations.long} ${timingFunctions.smooth}`,
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'brightness(1.1)',
  },
}));

const StyledRouterLink = styled(RouterLink)({
  textDecoration: 'none',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textTransform: 'none',
  position: 'relative',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '2px',
    bottom: 0,
    left: '50%',
    background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
    transition: `all ${durations.medium} ${timingFunctions.smooth}`,
    transform: 'translateX(-50%)',
  },
  '&:hover': {
    backgroundColor: 'transparent',
    transform: 'translateY(-2px)',
    '&:after': {
      width: '80%',
    },
  },
  '&.active': {
    '&:after': {
      width: '80%',
    },
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textTransform: 'none',
  borderRadius: '20px',
  padding: '6px 20px',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '100%',
    maxWidth: '300px',
    background: 'linear-gradient(135deg, #2C1810 0%, #1a0f0a 100%)',
    color: 'white',
    padding: theme.spacing(2),
    animation: `${slideInRight} ${durations.medium} ${timingFunctions.smooth}`,
  },
}));

const MobileMenuItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateX(8px)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '24px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(8px)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: '300px',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  animation: `${slideInRight} ${durations.medium} ${timingFunctions.smooth}`,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
    maxWidth: '400px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255, 255, 255, 0.7)',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'white',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: `all ${durations.medium} ${timingFunctions.smooth}`,
    width: '100%',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.7)',
      opacity: 1,
    },
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '25ch',
      },
    },
  },
}));

const CartButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { getItemCount } = useCart();

  const cartItemCount = getItemCount();
  const user = authService.getCurrentUser();
  const isLoggedIn = !!user;

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigateToCart = () => {
    navigate('/cart');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    authService.logout();
    handleUserMenuClose();
    navigate('/');
    window.location.reload(); 
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/gift', label: 'Gift' },
    { path: '/books', label: 'Book store' },
  ];

  const renderNavItems = () => (
    <>
      {navItems.map((item) => (
        <StyledRouterLink key={item.path} to={item.path}>
          <NavButton className={isActiveRoute(item.path) ? 'active' : ''}>
            {item.label}
          </NavButton>
        </StyledRouterLink>
      ))}
    </>
  );

  const renderMobileMenu = () => (
    <MobileDrawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton
          onClick={toggleMobileMenu}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <StyledRouterLink key={item.path} to={item.path}>
            <MobileMenuItem
              onClick={toggleMobileMenu}
              selected={isActiveRoute(item.path)}
            >
              <ListItemText primary={item.label} />
            </MobileMenuItem>
          </StyledRouterLink>
        ))}
        {!isLoggedIn && (
          <>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <StyledRouterLink to="/login">
            <GradientButton variant="contained" fullWidth>
                  Login
            </GradientButton>
          </StyledRouterLink>
              <StyledRouterLink to="/signup">
            <GradientButton
              variant="contained"
              fullWidth
            >
                  Sign Up
            </GradientButton>
          </StyledRouterLink>
        </Box>
          </>
        )}
        {isLoggedIn && (
          <>
            <ListItem disablePadding>
              <StyledRouterLink to="/account">
                <MobileMenuItem onClick={toggleMobileMenu}>
                  <ListItemText primary="My Account" />
                </MobileMenuItem>
              </StyledRouterLink>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </MobileDrawer>
  );

  return (
    <StyledAppBar>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Logo to="/" sx={{ flex: 1 }}>
           
            <Typography variant="h6" sx={{ ml: 1 }}>BooK StorE</Typography>
          </Logo>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderNavItems()}
            </Box>
          )}

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CartButton 
                color="inherit" 
                aria-label="cart"
                onClick={navigateToCart}
              >
                <Badge badgeContent={cartItemCount} color="secondary">
                  <CartIcon />
                </Badge>
              </CartButton>

              {isLoggedIn && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    color="inherit"
                    onClick={() => navigate('/account')}
                    aria-label="account"
                  >
                    <AccountIcon />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={handleUserMenuOpen}
                    aria-label="account menu"
                    size="small"
                    sx={{ p: 0 }}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                </Box>
              )}

              <IconButton
                color="inherit"
                onClick={toggleMobileMenu}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <form onSubmit={handleSearch}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search books…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Search>
              </form>

              {!isLoggedIn ? (
                <>
                  <StyledRouterLink to="/login">
                    <GradientButton variant="contained">
                      Login
                    </GradientButton>
                  </StyledRouterLink>

                  <StyledRouterLink to="/signup">
                    <GradientButton
                      variant="contained"
                      sx={{ ml: 1 }}
                    >
                      Sign Up
                    </GradientButton>
                  </StyledRouterLink>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <IconButton
                    color="inherit"
                    onClick={() => navigate('/account')}
                    aria-label="account"
                  >
                    <AccountIcon />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={handleUserMenuOpen}
                    aria-label="account menu"
                    size="small"
                    sx={{ p: 0 }}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                </Box>
              )}

              <CartButton 
                color="inherit" 
                aria-label="cart" 
                sx={{ ml: 1 }}
                onClick={navigateToCart}
              >
                <Badge badgeContent={cartItemCount} color="secondary">
                  <CartIcon />
                </Badge>
              </CartButton>

              {isLoggedIn && (
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem disabled>
                    Hi, {user?.firstName}
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleUserMenuClose();
                    navigate('/account');
                  }}>
                    My Account
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              )}
            </Box>
          )}

          {renderMobileMenu()}
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar; 
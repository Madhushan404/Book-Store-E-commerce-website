import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Divider,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DiscountIcon from '@mui/icons-material/Discount';
import { useCart } from '../contexts/CartContext';
import { getOptimalImageUrl, getSecureImageUrl, getAuthorText, getDisplayPrice, BookVolume } from '../utils/api';
import { fadeIn, slideUp } from '../utils/animations';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  animation: `${fadeIn} 0.5s ease-in-out`,
}));

const CartItemCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  width: 'fit-content',
}));

const OrderSummary = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  animation: `${slideUp} 0.5s ease-in-out`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
}));

const ItemSummary = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
}));

const ItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 0),
  fontSize: '0.875rem',
}));

const CheckoutButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  padding: '10px 30px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(255, 105, 135, .4)',
  },
}));

const SummaryListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  display: 'flex',
  justifyContent: 'space-between',
}));

const SavingsChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
  color: 'white',
  fontWeight: 'bold',
  height: '28px',
}));

const PriceDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const DiscountLabel = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  color: 'white',
  fontWeight: 'bold',
  height: '24px',
}));

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuantityChange = (bookId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(bookId, newQuantity);
    }
  };

  const handleRemoveItem = (bookId: string, title: string) => {
    removeFromCart(bookId);
    setSnackbarMessage(`"${title}" removed from cart`);
    setSnackbarOpen(true);
  };

  const handleClearCart = () => {
    clearCart();
    setDialogOpen(false);
    setSnackbarMessage('Cart cleared');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    // Handle NaN, negative values, or other invalid inputs
    const validPrice = isNaN(price) || price < 0 ? 0 : price;
    return `$${validPrice.toFixed(2)}`;
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateSubtotal = () => {
    return getTotalPrice();
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // Assuming 10% tax
  };

  const calculateShipping = () => {
    // Free shipping for orders over $35, otherwise $4.99
    return calculateSubtotal() > 35 ? 0 : 4.99;
  };

  const calculateSavings = () => {
    // Calculate total savings from discounts
    return items.reduce((total, item) => {
      const pricing = getItemPrice(item);
      if (pricing.isDiscounted) {
        // The originalPrice is now safely available as a string with '$' prefix
        const originalPrice = parseFloat(pricing.originalPrice.replace(/[^0-9.]/g, ''));
        const originalTotal = originalPrice * item.quantity;
        return total + (originalTotal - pricing.totalPrice);
      }
      return total;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = calculateShipping();
    
    // Sum all components, ensuring they are valid numbers
    return (
      (isNaN(subtotal) ? 0 : subtotal) + 
      (isNaN(tax) ? 0 : tax) + 
      (isNaN(shipping) ? 0 : shipping)
    );
  };

  const getItemPrice = (item: {book: BookVolume, quantity: number}) => {
    const priceInfo = getDisplayPrice(item.book);
    
    // Convert price string to number safely
    const unitPrice = priceInfo.price ? parseFloat(priceInfo.price.replace(/[^0-9.]/g, '')) : 0;
    const totalPrice = unitPrice * item.quantity;
    
    // For discounted items, ensure originalPrice is available
    const isDiscounted = priceInfo.isDiscounted && !!priceInfo.originalPrice;
    const originalPrice = priceInfo.originalPrice || `$${unitPrice.toFixed(2)}`;
    
    return {
      unitPrice,
      totalPrice,
      isDiscounted,
      originalPrice,
      discountPercentage: priceInfo.discountPercentage || 0
    };
  };

  const calculateTaxBreakdown = () => {
    // Different tax rates for different categories of products could be implemented here
    const generalTaxRate = 0.1; // 10% general tax
    
    return {
      generalTax: calculateSubtotal() * generalTaxRate,
      rate: generalTaxRate * 100 // Convert to percentage for display
    };
  };

  return (
    <StyledContainer maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Add some books to get started!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/books')}
          >
            Browse Books
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {items.map((item) => {
              const pricing = getItemPrice(item);
              return (
                <CartItemCard key={item.book.id}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120, objectFit: 'contain' }}
                    image={getSecureImageUrl(getOptimalImageUrl(item.book.volumeInfo.imageLinks))}
                    alt={item.book.volumeInfo.title}
                  />
                  <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                    <Typography component="h5" variant="h6">
                      {item.book.volumeInfo.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      by {getAuthorText(item.book.volumeInfo.authors)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <PriceDisplay>
                        <Typography variant="body1" fontWeight="bold" color="primary">
                          ${pricing.unitPrice.toFixed(2)}
                        </Typography>
                        {pricing.isDiscounted && (
                          <>
                            <Typography 
                              variant="body2" 
                              sx={{ textDecoration: 'line-through', opacity: 0.7 }}
                            >
                              {pricing.originalPrice}
                            </Typography>
                            {pricing.discountPercentage > 0 && (
                              <DiscountLabel 
                                label={`${pricing.discountPercentage}% off`}
                                size="small" 
                              />
                            )}
                          </>
                        )}
                      </PriceDisplay>
                      <QuantityControl sx={{ ml: 3 }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleQuantityChange(item.book.id, item.quantity - 1)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          variant="standard"
                          value={item.quantity}
                          inputProps={{ 
                            min: 1, 
                            style: { textAlign: 'center', width: '30px' },
                            'aria-label': 'quantity'
                          }}
                          sx={{ 
                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:after': { borderBottom: 'none' },
                          }}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleQuantityChange(item.book.id, value);
                            }
                          }}
                        />
                        <IconButton 
                          size="small"
                          onClick={() => handleQuantityChange(item.book.id, item.quantity + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </QuantityControl>
                      <Typography variant="body2" sx={{ ml: 3 }}>
                        Total: ${pricing.totalPrice.toFixed(2)}
                      </Typography>
                      <IconButton 
                        sx={{ ml: 'auto' }}
                        onClick={() => handleRemoveItem(item.book.id, item.book.volumeInfo.title)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </CartItemCard>
              );
            })}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button color="inherit" onClick={() => navigate('/books')}>
                Continue Shopping
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={() => setDialogOpen(true)}
              >
                Clear Cart
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <OrderSummary elevation={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <ShoppingCartCheckoutIcon sx={{ mr: 1 }} />
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* Detailed item breakdown section */}
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Item Details
              </Typography>
              
              {items.map((item, index) => {
                const pricing = getItemPrice(item);
                return (
                  <ItemSummary key={item.book.id}>
                    <ItemRow>
                      <Typography variant="body2" noWrap sx={{ width: '70%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.book.volumeInfo.title}
                      </Typography>
                      <Typography variant="body2" sx={{ width: '30%', textAlign: 'right' }}>
                        ${pricing.unitPrice.toFixed(2)} × {item.quantity}
                      </Typography>
                    </ItemRow>
                    <ItemRow>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                        Subtotal
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        ${pricing.totalPrice.toFixed(2)}
                      </Typography>
                    </ItemRow>
                    {pricing.isDiscounted && (
                      <ItemRow>
                        <Typography variant="body2" color="success.main" sx={{ pl: 1, display: 'flex', alignItems: 'center' }}>
                          <DiscountIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          Savings ({pricing.discountPercentage}%)
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -${((parseFloat(pricing.originalPrice.replace(/[^0-9.]/g, '')) * item.quantity) - pricing.totalPrice).toFixed(2)}
                        </Typography>
                      </ItemRow>
                    )}
                  </ItemSummary>
                );
              })}
              
              <Divider sx={{ my: 2 }} />
              
              <List disablePadding>
                <SummaryListItem>
                  <ListItemText primary={`Subtotal (${getTotalItems()} items)`} />
                  <Typography variant="body2">
                    {formatPrice(calculateSubtotal())}
                  </Typography>
                </SummaryListItem>
                
                {calculateSavings() > 0.01 && (
                  <SummaryListItem>
                    <ListItemText 
                      primary="Total Savings" 
                      primaryTypographyProps={{ 
                        color: 'success.main',
                        sx: { display: 'flex', alignItems: 'center' }
                      }}
                    />
                    <SavingsChip
                      label={`-${formatPrice(calculateSavings())}`}
                      size="small"
                    />
                  </SummaryListItem>
                )}
                
                {/* Detailed tax breakdown */}
                <SummaryListItem>
                  <ListItemText 
                    primary={`Tax (${calculateTaxBreakdown().rate}%)`} 
                    secondary="Applied to subtotal"
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                  <Typography variant="body2">
                    {formatPrice(calculateTaxBreakdown().generalTax)}
                  </Typography>
                </SummaryListItem>
                
                <SummaryListItem>
                  <ListItemText 
                    primary="Shipping" 
                    secondary={calculateShipping() === 0 ? "Free Shipping" : "Standard Delivery"}
                    secondaryTypographyProps={{ 
                      color: calculateShipping() === 0 ? 'success.main' : 'text.secondary',
                      fontSize: '0.75rem'
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalShippingIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}
                    </Typography>
                  </Box>
                </SummaryListItem>
                
                <Divider sx={{ my: 1.5 }} />
                
                <SummaryListItem>
                  <ListItemText 
                    primary="Total" 
                    primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                  />
                  <Typography variant="body1" fontWeight="bold" fontSize="1.1rem">
                    {formatPrice(calculateTotal())}
                  </Typography>
                </SummaryListItem>
              </List>
              
              {calculateSubtotal() < 35 && calculateShipping() > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.85rem', textAlign: 'center' }}>
                  Add {formatPrice(35 - calculateSubtotal())} more to qualify for FREE shipping
                </Typography>
              )}
              
              <CheckoutButton 
                fullWidth 
                variant="contained" 
                sx={{ mt: 3 }}
                onClick={handleCheckout}
                startIcon={<ShoppingCartCheckoutIcon />}
              >
                Proceed to Checkout
              </CheckoutButton>
            </OrderSummary>
          </Grid>
        </Grid>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Clear Shopping Cart</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearCart} color="error" autoFocus>
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default Cart; 
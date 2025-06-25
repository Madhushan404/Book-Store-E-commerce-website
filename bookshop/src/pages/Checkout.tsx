import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fadeIn, slideUp } from '../utils/animations';
import { getDisplayPrice, BookVolume } from '../utils/api';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  animation: `${fadeIn} 0.5s ease-in-out`,
}));

const CheckoutPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  animation: `${slideUp} 0.5s ease-in-out`,
}));

const OrderSummaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
  position: 'sticky',
  top: 100,
}));

const PaymentMethod = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2],
  },
}));

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2),
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
  color: 'white',
  fontWeight: 'bold',
  height: '20px',
}));

const steps = ['Shipping Information', 'Payment Method', 'Review Order'];

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if cart is empty
  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateShippingForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'creditCard') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardName) newErrors.cardName = 'Name on card is required';
      if (!formData.expiry) newErrors.expiry = 'Expiration date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (activeStep === 0) {
      isValid = validateShippingForm();
    } else if (activeStep === 1) {
      isValid = validatePaymentForm();
    } else {
      isValid = true;
    }
    
    if (isValid) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    
    // Simulate API call to place order
    setTimeout(() => {
      // Generate random order number
      const generatedOrderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(generatedOrderNumber);
      setOrderPlaced(true);
      clearCart();
      setLoading(false);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getItemPrice = (item: {book: BookVolume, quantity: number}) => {
    const priceInfo = getDisplayPrice(item.book);
    return {
      unitPrice: parseFloat(priceInfo.price.replace('$', '')),
      totalPrice: parseFloat(priceInfo.price.replace('$', '')) * item.quantity,
      isDiscounted: priceInfo.isDiscounted,
      originalPrice: priceInfo.originalPrice,
      discountPercentage: priceInfo.discountPercentage
    };
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + getItemPrice(item).totalPrice;
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 50 ? 0 : 5.99; // Free shipping over $50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const renderShippingForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="firstName"
          name="firstName"
          label="First name"
          fullWidth
          autoComplete="given-name"
          variant="outlined"
          value={formData.firstName}
          onChange={handleInputChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="lastName"
          name="lastName"
          label="Last name"
          fullWidth
          autoComplete="family-name"
          variant="outlined"
          value={formData.lastName}
          onChange={handleInputChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="address"
          name="address"
          label="Address"
          fullWidth
          autoComplete="shipping address-line1"
          variant="outlined"
          value={formData.address}
          onChange={handleInputChange}
          error={!!errors.address}
          helperText={errors.address}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="city"
          name="city"
          label="City"
          fullWidth
          autoComplete="shipping address-level2"
          variant="outlined"
          value={formData.city}
          onChange={handleInputChange}
          error={!!errors.city}
          helperText={errors.city}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id="state"
          name="state"
          label="State/Province/Region"
          fullWidth
          variant="outlined"
          value={formData.state}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="zipCode"
          name="zipCode"
          label="Zip / Postal code"
          fullWidth
          autoComplete="shipping postal-code"
          variant="outlined"
          value={formData.zipCode}
          onChange={handleInputChange}
          error={!!errors.zipCode}
          helperText={errors.zipCode}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="country"
          name="country"
          label="Country"
          fullWidth
          autoComplete="shipping country"
          variant="outlined"
          value={formData.country}
          onChange={handleInputChange}
          error={!!errors.country}
          helperText={errors.country}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="email"
          name="email"
          label="Email Address"
          fullWidth
          autoComplete="email"
          variant="outlined"
          value={formData.email}
          onChange={handleInputChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="phone"
          name="phone"
          label="Phone Number"
          fullWidth
          autoComplete="tel"
          variant="outlined"
          value={formData.phone}
          onChange={handleInputChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
      </Grid>
    </Grid>
  );

  const renderPaymentForm = () => (
    <>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup
          name="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <PaymentMethod>
            <FormControlLabel
              value="creditCard"
              control={<Radio />}
              label="Credit / Debit Card"
            />
            {paymentMethod === 'creditCard' && (
              <Box sx={{ pl: 4, pt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardNumber"
                      name="cardNumber"
                      label="Card number"
                      fullWidth
                      autoComplete="cc-number"
                      variant="outlined"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardName"
                      name="cardName"
                      label="Name on card"
                      fullWidth
                      autoComplete="cc-name"
                      variant="outlined"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      error={!!errors.cardName}
                      helperText={errors.cardName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="expiry"
                      name="expiry"
                      label="Expiry date"
                      fullWidth
                      autoComplete="cc-exp"
                      variant="outlined"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      error={!!errors.expiry}
                      helperText={errors.expiry}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="cvv"
                      name="cvv"
                      label="CVV"
                      fullWidth
                      autoComplete="cc-csc"
                      variant="outlined"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      error={!!errors.cvv}
                      helperText={errors.cvv}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </PaymentMethod>
          
          <PaymentMethod>
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label="PayPal"
            />
            {paymentMethod === 'paypal' && (
              <Box sx={{ pl: 4, pt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  You will be redirected to PayPal to complete your payment.
                </Alert>
              </Box>
            )}
          </PaymentMethod>
          
          <PaymentMethod>
            <FormControlLabel
              value="bankTransfer"
              control={<Radio />}
              label="Bank Transfer"
            />
            {paymentMethod === 'bankTransfer' && (
              <Box sx={{ pl: 4, pt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Bank transfer details will be provided once you place your order.
                </Alert>
              </Box>
            )}
          </PaymentMethod>
        </RadioGroup>
      </FormControl>
    </>
  );

  const renderOrderSummary = () => (
    <OrderSummaryPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <List disablePadding>
        {items.map((item) => {
          const pricing = getItemPrice(item);
          return (
            <ListItem key={item.book.id} sx={{ py: 1, px: 0 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item.book.volumeInfo.title}
                    {pricing.isDiscounted && pricing.discountPercentage && (
                      <DiscountChip
                        label={`${pricing.discountPercentage}% off`}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
                secondary={`Qty: ${item.quantity}`}
                primaryTypographyProps={{ 
                  variant: 'body2',
                  noWrap: true,
                  sx: { maxWidth: '150px' } 
                }}
              />
              <Box>
                <Typography variant="body2">
                  ${pricing.totalPrice.toFixed(2)}
                </Typography>
                {pricing.isDiscounted && pricing.originalPrice && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      textDecoration: 'line-through', 
                      display: 'block', 
                      textAlign: 'right',
                      color: 'text.secondary'
                    }}
                  >
                    ${(parseFloat(pricing.originalPrice.replace('$', '')) * item.quantity).toFixed(2)}
                  </Typography>
                )}
              </Box>
            </ListItem>
          );
        })}
        
        <Divider sx={{ my: 2 }} />
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Subtotal" />
          <Typography variant="body2">
            {formatPrice(calculateSubtotal())}
          </Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Tax (10%)" />
          <Typography variant="body2">
            {formatPrice(calculateTax())}
          </Typography>
        </ListItem>
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body2">
            {calculateShipping() > 0 ? formatPrice(calculateShipping()) : 'Free'}
          </Typography>
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText 
            primary="Total" 
            primaryTypographyProps={{ fontWeight: 'bold' }}
          />
          <Typography variant="body1" fontWeight="bold">
            {formatPrice(calculateTotal())}
          </Typography>
        </ListItem>
      </List>
    </OrderSummaryPaper>
  );

  const renderOrderReview = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Information
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Name:</strong> {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {formData.email}
          </Typography>
          <Typography variant="body2">
            <strong>Phone:</strong> {formData.phone}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Address:</strong> {formData.address}
          </Typography>
          <Typography variant="body2">
            <strong>City:</strong> {formData.city}{formData.state ? `, ${formData.state}` : ''}
          </Typography>
          <Typography variant="body2">
            <strong>ZIP/Postal Code:</strong> {formData.zipCode}
          </Typography>
          <Typography variant="body2">
            <strong>Country:</strong> {formData.country}
          </Typography>
        </Grid>
      </Grid>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        {paymentMethod === 'creditCard' && (
          <>
            <strong>Credit Card:</strong> ****{formData.cardNumber.slice(-4)}
            <br />
            <strong>Name on Card:</strong> {formData.cardName}
          </>
        )}
        {paymentMethod === 'paypal' && 'PayPal'}
        {paymentMethod === 'bankTransfer' && 'Bank Transfer'}
      </Typography>
    </>
  );

  const renderOrderSuccess = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <SuccessIcon />
      <Typography variant="h4" gutterBottom>
        Thank You For Your Order!
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Your order number is #{orderNumber}
      </Typography>
      <Typography variant="body1" paragraph>
        We've sent a confirmation email to {formData.email} with your order details.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        You'll receive another email when your order ships.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/')}
      >
        Continue Shopping
      </Button>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderShippingForm();
      case 1:
        return renderPaymentForm();
      case 2:
        return renderOrderReview();
      default:
        throw new Error('Unknown step');
    }
  };

  if (orderPlaced) {
    return (
      <StyledContainer maxWidth="md">
        <CheckoutPaper elevation={3}>
          {renderOrderSuccess()}
        </CheckoutPaper>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      <Divider sx={{ mb: 4 }} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <CheckoutPaper elevation={3}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            {renderStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={activeStep === 0 ? () => navigate('/cart') : handleBack}
                sx={{ mr: 1 }}
              >
                {activeStep === 0 ? 'Back to Cart' : 'Back'}
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
                disabled={loading}
                sx={{ minWidth: '150px' }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : activeStep === steps.length - 1 ? (
                  'Place Order'
                ) : (
                  'Next'
                )}
              </Button>
            </Box>
          </CheckoutPaper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {renderOrderSummary()}
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Checkout; 
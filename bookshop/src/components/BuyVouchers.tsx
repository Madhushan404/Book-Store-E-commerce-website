import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const BuyVouchersSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #2C1810 0%, #1a0f0a 100%)',
  color: 'white',
}));

const VoucherCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  '&.selected': {
    border: '2px solid #FE6B8B',
    backgroundColor: 'rgba(254, 107, 139, 0.1)',
  },
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FE6B8B',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#FE6B8B',
  },
}));

const CustomVoucherButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2C1810 30%, #4A2B1D 90%)',
  border: '2px solid #FE6B8B',
  borderRadius: 3,
  color: 'white',
  padding: '12px 32px',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  '&:hover': {
    background: 'linear-gradient(45deg, #4A2B1D 30%, #2C1810 90%)',
    borderColor: '#FF8E53',
  },
}));

interface Voucher {
  id: string | number;
  value: number;
  price: number;
  description: string;
}

const BuyVouchers = () => {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [openCustomDialog, setOpenCustomDialog] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const vouchers: Voucher[] = [
    {
      id: 1,
      value: 1000,
      price: 1000,
      description: 'Perfect for a single book purchase',
    },
    {
      id: 2,
      value: 2000,
      price: 2000,
      description: 'Great for multiple books',
    },
    {
      id: 3,
      value: 5000,
      price: 5000,
      description: 'Best value for bulk purchases',
    },
  ];

  const handleVoucherSelect = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handlePaymentMethodChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  const handleCustomAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setCustomAmount(value);
    }
  };

  const handleCustomVoucherSubmit = () => {
    if (customAmount && parseInt(customAmount) > 0) {
      const customVoucher: Voucher = {
        id: 'custom',
        value: parseInt(customAmount),
        price: parseInt(customAmount),
        description: 'Custom amount gift voucher',
      };
      setSelectedVoucher(customVoucher);
      setOpenCustomDialog(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedVoucher) return 0;
    return selectedVoucher.price * quantity;
  };

  return (
    <BuyVouchersSection>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Buy Gift Vouchers
        </Typography>

        <Grid container spacing={4}>
          {vouchers.map((voucher) => (
            <Grid item xs={12} md={4} key={voucher.id}>
              <VoucherCard
                className={selectedVoucher?.id === voucher.id ? 'selected' : ''}
                onClick={() => handleVoucherSelect(voucher)}
              >
                <CardContent>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: '#FF6B6B',
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    {voucher.value} LKR
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, opacity: 0.9 }}
                  >
                    {voucher.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Price: {voucher.price} LKR
                  </Typography>
                </CardContent>
              </VoucherCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CustomVoucherButton
            onClick={() => setOpenCustomDialog(true)}
          >
            Set Your Gift Voucher Amount
          </CustomVoucherButton>
        </Box>

        <Dialog 
          open={openCustomDialog} 
          onClose={() => setOpenCustomDialog(false)}
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #2C1810 0%, #1a0f0a 100%)',
              color: 'white',
            }
          }}
        >
          <DialogTitle>Set Custom Voucher Amount</DialogTitle>
          <DialogContent>
            <StyledTextField
              autoFocus
              margin="dense"
              label="Amount (LKR)"
              type="number"
              fullWidth
              value={customAmount}
              onChange={handleCustomAmountChange}
              inputProps={{ min: 1 }}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenCustomDialog(false)}
              sx={{ color: 'white' }}
            >
              Cancel
            </Button>
            <GradientButton
              onClick={handleCustomVoucherSubmit}
              disabled={!customAmount || parseInt(customAmount) <= 0}
            >
              Set Amount
            </GradientButton>
          </DialogActions>
        </Dialog>

        {selectedVoucher && (
          <Box
            sx={{
              mt: 6,
              p: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Purchase Details
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Quantity
                  </Typography>
                  <StyledTextField
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1 }}
                    fullWidth
                  />
                </Box>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend" sx={{ color: 'white' }}>
                    Payment Method
                  </FormLabel>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <FormControlLabel
                      value="credit"
                      control={<Radio sx={{ color: 'white' }} />}
                      label="Credit Card"
                      sx={{ color: 'white' }}
                    />
                    <FormControlLabel
                      value="debit"
                      control={<Radio sx={{ color: 'white' }} />}
                      label="Debit Card"
                      sx={{ color: 'white' }}
                    />
                    <FormControlLabel
                      value="bank"
                      control={<Radio sx={{ color: 'white' }} />}
                      label="Bank Transfer"
                      sx={{ color: 'white' }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Voucher Value:</Typography>
                    <Typography>{selectedVoucher.value} LKR</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Quantity:</Typography>
                    <Typography>{quantity}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography>Total Amount:</Typography>
                    <Typography variant="h6" color="#FF6B6B">
                      {calculateTotal()} LKR
                    </Typography>
                  </Box>
                  <GradientButton
                    variant="contained"
                    fullWidth
                    size="large"
                  >
                    Proceed to Payment
                  </GradientButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </BuyVouchersSection>
  );
};

export default BuyVouchers; 
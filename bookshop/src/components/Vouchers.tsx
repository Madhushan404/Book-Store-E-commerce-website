import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const VouchersSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #2C1810 0%, #1a0f0a 100%)',
  color: 'white',
}));

const VoucherCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
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

const Vouchers = () => {
  const vouchers = [
    {
      id: 1,
      title: 'Student Discount',
      value: '20% OFF',
      description: 'Valid for all students with valid ID',
      code: 'STUDENT20',
    },
    {
      id: 2,
      title: 'First Purchase',
      value: '15% OFF',
      description: 'Get 15% off on your first purchase',
      code: 'FIRST15',
    },
    {
      id: 3,
      title: 'Bulk Purchase',
      value: '25% OFF',
      description: 'Buy 5 or more books and get 25% off',
      code: 'BULK25',
    },
  ];

  return (
    <VouchersSection>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Special Vouchers
        </Typography>

        <Grid container spacing={4}>
          {vouchers.map((voucher) => (
            <Grid item xs={12} md={4} key={voucher.id}>
              <VoucherCard>
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {voucher.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: '#FF6B6B',
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    {voucher.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, opacity: 0.9 }}
                  >
                    {voucher.description}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      p: 2,
                      borderRadius: 1,
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'monospace',
                        letterSpacing: 2,
                      }}
                    >
                      {voucher.code}
                    </Typography>
                  </Box>
                  <GradientButton variant="contained" fullWidth>
                    Apply Voucher
                  </GradientButton>
                </CardContent>
              </VoucherCard>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Have a Voucher Code?
          </Typography>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                label="Enter Voucher Code"
                variant="outlined"
                size="medium"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <GradientButton
                variant="contained"
                fullWidth
                size="large"
                sx={{ height: 56 }}
              >
                Apply Code
              </GradientButton>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </VouchersSection>
  );
};

export default Vouchers; 
import React from 'react';
import BuyVouchers from '../components/BuyVouchers';
import Vouchers from '../components/Vouchers';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const GiftPageWrapper = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2C1810 0%, #1a0f0a 100%)',
  minHeight: '100vh',
}));

const Gift = () => {
  return (
    <GiftPageWrapper>
      <Vouchers />
      <BuyVouchers />
    </GiftPageWrapper>
  );
};

export default Gift; 
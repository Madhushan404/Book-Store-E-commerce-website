import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { durations, timingFunctions } from './animations';

export const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 20,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  padding: '6px 20px',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(255, 105, 135, .4)',
  },
  '&.Mui-disabled': {
    background: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
  }
}));

// Different gradient variations if needed
export const PrimaryGradientButton = styled(GradientButton)({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
  },
});

export const SecondaryGradientButton = styled(GradientButton)({
  background: 'linear-gradient(45deg, #2C1810 30%, #FF6B6B 90%)',
  boxShadow: '0 3px 5px 2px rgba(44, 24, 16, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF6B6B 30%, #2C1810 90%)',
    boxShadow: '0 6px 10px rgba(255, 107, 107, 0.3)',
  },
});

export const SuccessGradientButton = styled(GradientButton)({
  background: 'linear-gradient(45deg, #43A047 30%, #66BB6A 90%)',
  boxShadow: '0 3px 5px 2px rgba(67, 160, 71, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #66BB6A 30%, #43A047 90%)',
    boxShadow: '0 6px 10px rgba(67, 160, 71, .4)',
  },
}); 
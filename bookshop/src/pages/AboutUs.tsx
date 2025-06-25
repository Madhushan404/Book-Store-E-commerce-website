import React from 'react';
import { Container, Typography, Grid, Box, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fadeIn, slideUp, scaleUp, pulse, gradientFlow, durations, timingFunctions } from '../utils/animations';

const AboutSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: 'linear-gradient(135deg, #2C1810 0%, #1a0f0a 100%)',
  color: 'white',
  minHeight: '100vh',
  animation: `${gradientFlow} 15s ${timingFunctions.smooth} infinite`,
  backgroundSize: '200% 200%',
}));

const AnimatedPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255,255,255,0.07)',
  color: 'white',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  animation: `${pulse} 2.5s ${timingFunctions.smooth} infinite`,
  backdropFilter: 'blur(6px)',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.04)',
    boxShadow: '0 12px 36px rgba(0,0,0,0.28)',
  },
}));

const AnimatedImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  animation: `${scaleUp} 1.2s ${timingFunctions.smooth}`,
  transition: 'transform 0.5s',
  '&:hover': {
    transform: 'scale(1.05) rotate(-2deg)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2.2rem',
  color: '#FE6B8B',
  marginBottom: theme.spacing(2),
  letterSpacing: 1,
  animation: `${fadeIn} 1.2s ${timingFunctions.smooth}`,
}));

const AboutUs = () => {
  return (
    <AboutSection>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <SectionTitle variant="h3">About Our Bookshop</SectionTitle>
            <Divider sx={{ bgcolor: '#FE6B8B', mb: 3, width: 80 }} />
            <AnimatedPaper elevation={0}>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
                Welcome to Sri Lanka's premier online bookstore. Since our establishment, we have been dedicated to bringing the joy of reading to book lovers across the country.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
                Our carefully curated collection spans across various genres, from classic literature to contemporary bestsellers, academic texts to children's books. We take pride in offering both local and international publications.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
                Our mission is to make quality books accessible to everyone while promoting reading culture in Sri Lanka. We believe in the power of books to educate, inspire, and transform lives.
              </Typography>
            </AnimatedPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnimatedImage src="/image/Hero.jpg" alt="Our Bookstore" />
          </Grid>
        </Grid>

        <Grid container spacing={6} sx={{ mt: 6 }}>
          <Grid item xs={12} md={4}>
            <AnimatedPaper elevation={0} sx={{ animationDelay: '0.2s' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#FE6B8B', fontWeight: 600 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                To be the leading online bookstore in Sri Lanka, making literature accessible to everyone while fostering a love for reading.
              </Typography>
            </AnimatedPaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <AnimatedPaper elevation={0} sx={{ animationDelay: '0.4s' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#FE6B8B', fontWeight: 600 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                To provide an extensive collection of books at competitive prices, delivered with exceptional customer service.
              </Typography>
            </AnimatedPaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <AnimatedPaper elevation={0} sx={{ animationDelay: '0.6s' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#FE6B8B', fontWeight: 600 }}>
                Our Values
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Quality, Customer Satisfaction, Innovation, and Passion for Literature are the core values that drive our business.
              </Typography>
            </AnimatedPaper>
          </Grid>
        </Grid>
      </Container>
    </AboutSection>
  );
};

export default AboutUs; 
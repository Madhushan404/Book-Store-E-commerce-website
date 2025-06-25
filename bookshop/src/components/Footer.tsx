import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Link,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';

const FooterWrapper = styled(Box)(({ theme }) => ({
  background: '#2C1810',
  color: 'white',
  padding: theme.spacing(8, 0, 2),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(to right, #FE6B8B, #FF8E53)',
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
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: 'white',
  margin: theme.spacing(0, 1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    color: '#FE6B8B',
  },
}));

const QuickLink = styled(Link)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  display: 'block',
  marginBottom: theme.spacing(1),
  '&:hover': {
    color: '#FE6B8B',
    transform: 'translateX(5px)',
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    marginRight: theme.spacing(2),
    color: '#FE6B8B',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  padding: '8px 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
  },
}));

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FE6B8B' }}>
              About Book Shop
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              Your premier destination for books in Sri Lanka. Discover a world of knowledge,
              adventure, and imagination through our carefully curated collection.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <SocialIcon aria-label="facebook">
                <FacebookIcon />
              </SocialIcon>
              <SocialIcon aria-label="twitter">
                <TwitterIcon />
              </SocialIcon>
              <SocialIcon aria-label="instagram">
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon aria-label="linkedin">
                <LinkedInIcon />
              </SocialIcon>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FE6B8B' }}>
              Quick Links
            </Typography>
            <QuickLink href="/">Home</QuickLink>
            <QuickLink href="/about">About Us</QuickLink>
            <QuickLink href="/books">Books</QuickLink>
            <QuickLink href="/services">Services</QuickLink>
            <QuickLink href="/contact">Contact</QuickLink>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FE6B8B' }}>
              Contact Us
            </Typography>
            <ContactItem>
              <LocationOnIcon />
              <Typography variant="body2">
                123 Book Street, Colombo, Sri Lanka
              </Typography>
            </ContactItem>
            <ContactItem>
              <PhoneIcon />
              <Typography variant="body2">
                +94 11 234 5678
              </Typography>
            </ContactItem>
            <ContactItem>
              <EmailIcon />
              <Typography variant="body2">
                info@bookshop.com
              </Typography>
            </ContactItem>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#FE6B8B' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              Subscribe to our newsletter for updates on new books and exclusive offers.
            </Typography>
            <Box component="form" onSubmit={handleNewsletterSubmit}>
              <StyledTextField
                fullWidth
                label="Email Address"
                variant="outlined"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <GradientButton
                type="submit"
                variant="contained"
                fullWidth
                endIcon={<SendIcon />}
              >
                Subscribe
              </GradientButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright */}
        <Typography
          variant="body2"
          align="center"
          sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
        >
          © {new Date().getFullYear()} Book Shop. All rights reserved.(Develop By Madhushan(Daspi))
        </Typography>
      </Container>
    </FooterWrapper>
  );
};

export default Footer; 
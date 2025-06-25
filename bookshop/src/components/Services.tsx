import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

const ServicesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: '#fff',
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: '100%',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  background: 'white',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
    '& .service-icon': {
      transform: 'scale(1.1)',
      color: theme.palette.secondary.main,
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FE6B8B 0%, #FF8E53 100%)',
  '& svg': {
    fontSize: 40,
    color: 'white',
    transition: 'all 0.3s ease',
  },
}));

const services = [
  {
    icon: <LocalShippingOutlinedIcon />,
    title: 'Island Wide Fast Delivery',
    description: 'Swift and reliable delivery service covering all regions of Sri Lanka, ensuring your books reach you quickly and safely.',
  },
  {
    icon: <SecurityOutlinedIcon />,
    title: 'Secure Payment System',
    description: 'Multiple secure payment options with advanced encryption to protect your financial transactions.',
  },
  {
    icon: <SupportAgentOutlinedIcon />,
    title: 'Customer Support',
    description: 'Dedicated support team ready to assist you with any queries or concerns about your book purchases.',
  },
  {
    icon: <AccessTimeOutlinedIcon />,
    title: '24/7 Availability',
    description: 'Shop for your favorite books anytime, anywhere. Our online store is always open for your convenience.',
  },
];

const Services = () => {
  return (
    <ServicesSection>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          color="primary"
          gutterBottom
          sx={{
            mb: 6,
            fontWeight: 600,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 4,
              background: 'linear-gradient(to right, #FE6B8B, #FF8E53)',
              borderRadius: 2,
            },
          }}
        >
          Our Services
        </Typography>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <ServiceCard>
                <CardContent>
                  <IconWrapper className="service-icon">
                    {service.icon}
                  </IconWrapper>
                  <Typography
                    variant="h6"
                    component="h3"
                    color="primary"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ServicesSection>
  );
};

export default Services; 
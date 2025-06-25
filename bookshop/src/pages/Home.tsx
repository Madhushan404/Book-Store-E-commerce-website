import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Offers from '../components/Offers';
import Books from '../components/Books';
import BuyVouchers from '../components/BuyVouchers';
import FeedbackAndRequests from '../components/FeedbackAndRequests';

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <Offers />
      <Books />
      <BuyVouchers />
      <FeedbackAndRequests />
    </>
  );
};

export default Home; 
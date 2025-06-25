import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Rating,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: 'linear-gradient(135deg, #2C1810 0%, #1a0f0a 100%)',
  color: 'white',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  color: 'white',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FE6B8B 0%, #FF8E53 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px',
  '& svg': {
    fontSize: 30,
    color: 'white',
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
    '&.Mui-focused': {
      color: '#FE6B8B',
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#FE6B8B',
  },
  '& .MuiSelect-icon': {
    color: 'white',
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

interface FeedbackForm {
  name: string;
  email: string;
  feedback: string;
}

interface RequestForm {
  name: string;
  email: string;
  bookTitle: string;
  author: string;
  genre: string;
  additionalInfo: string;
}

const FeedbackAndRequests = () => {
  const [rating, setRating] = useState<number>(0);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    name: '',
    email: '',
    feedback: '',
  });

  const [requestForm, setRequestForm] = useState<RequestForm>({
    name: '',
    email: '',
    bookTitle: '',
    author: '',
    genre: '',
    additionalInfo: '',
  });

  const handleFeedbackSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Feedback:', { ...feedbackForm, rating });
  };

  const handleRequestSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Book Request:', requestForm);
  };

  const handleFeedbackChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (event: SelectChangeEvent<unknown>, child: React.ReactNode) => {
    const value = event.target.value as string;
    setRequestForm(prev => ({ ...prev, genre: value }));
  };

  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    setRating(newValue || 0);
  };

  return (
    <SectionWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {}
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <IconWrapper>
                  <FeedbackOutlinedIcon />
                </IconWrapper>
                <Typography variant="h4" align="center" gutterBottom>
                  Share Your Feedback
                </Typography>
                <Box component="form" onSubmit={handleFeedbackSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={feedbackForm.name}
                        onChange={handleFeedbackChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={feedbackForm.email}
                        onChange={handleFeedbackChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Typography component="legend" sx={{ mb: 1 }}>
                          Rate Your Experience
                        </Typography>
                        <Rating
                          size="large"
                          value={rating}
                          onChange={handleRatingChange}
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#FE6B8B',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Your Feedback"
                        name="feedback"
                        multiline
                        rows={4}
                        value={feedbackForm.feedback}
                        onChange={handleFeedbackChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <GradientButton type="submit" fullWidth size="large">
                        Submit Feedback
                      </GradientButton>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>

          {}
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <IconWrapper>
                  <MenuBookOutlinedIcon />
                </IconWrapper>
                <Typography variant="h4" align="center" gutterBottom>
                  Request a Book
                </Typography>
                <Box component="form" onSubmit={handleRequestSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={requestForm.name}
                        onChange={handleRequestChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={requestForm.email}
                        onChange={handleRequestChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Book Title"
                        name="bookTitle"
                        value={requestForm.bookTitle}
                        onChange={handleRequestChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Author (if known)"
                        name="author"
                        value={requestForm.author}
                        onChange={handleRequestChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Genre
                        </InputLabel>
                        <StyledSelect
                          value={requestForm.genre}
                          name="genre"
                          label="Genre"
                          onChange={handleGenreChange}
                        >
                          <MenuItem value="fiction">Fiction</MenuItem>
                          <MenuItem value="non-fiction">Non-Fiction</MenuItem>
                          <MenuItem value="mystery">Mystery</MenuItem>
                          <MenuItem value="scifi">Science Fiction</MenuItem>
                          <MenuItem value="romance">Romance</MenuItem>
                          <MenuItem value="biography">Biography</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </StyledSelect>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Additional Information"
                        name="additionalInfo"
                        multiline
                        rows={4}
                        value={requestForm.additionalInfo}
                        onChange={handleRequestChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <GradientButton type="submit" fullWidth size="large">
                        Submit Request
                      </GradientButton>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </SectionWrapper>
  );
};

export default FeedbackAndRequests; 
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  styled,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/api';
import { fadeIn, slideInLeft, durations, timingFunctions } from '../utils/animations';
import { GradientButton, SuccessGradientButton } from '../utils/commonStyles';

// Styled components
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  animation: `${fadeIn} ${durations.medium} ${timingFunctions.smooth}`,
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  animation: `${slideInLeft} ${durations.medium} ${timingFunctions.smooth}`,
  overflow: 'hidden',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: '0 auto',
  backgroundColor: theme.palette.secondary.main,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  transition: `all ${durations.medium} ${timingFunctions.smooth}`,
  '&.Mui-selected': {
    color: theme.palette.secondary.main,
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const UserAccount: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      setUser(currentUser);
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        contactNumber: currentUser.contactNumber || '',
        address: currentUser.address || '',
        password: '',
        confirmPassword: '',
      });
      setLoading(false);
    };
    
    fetchUserData();
  }, [navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Only validate fields that have been modified
    if (formData.firstName.trim() === '') {
      newErrors.firstName = 'First name is required';
    }
    
    if (formData.lastName.trim() === '') {
      newErrors.lastName = 'Last name is required';
    }
    
    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.contactNumber.trim() === '') {
      newErrors.contactNumber = 'Contact number is required';
    }
    
    if (formData.address.trim() === '') {
      newErrors.address = 'Address is required';
    }
    
    // Only validate password fields if the user is trying to update password
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Prepare data for API - only include fields that have changed
      const updateData: Record<string, string> = {};
      
      if (formData.firstName !== user.firstName) updateData.firstName = formData.firstName;
      if (formData.lastName !== user.lastName) updateData.lastName = formData.lastName;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.contactNumber !== user.contactNumber) updateData.contactNumber = formData.contactNumber;
      if (formData.address !== user.address) updateData.address = formData.address;
      if (formData.password) updateData.password = formData.password;
      
      // Only proceed if there are changes
      if (Object.keys(updateData).length === 0) {
        setEditing(false);
        return;
      }
      
      const response = await authService.updateProfile(updateData);
      
      if (response.success) {
        setUser(response.data);
        setSuccess('Profile updated successfully');
        setEditing(false);
        // Update form data with new values
        setFormData({
          ...formData,
          password: '',
          confirmPassword: '',
        });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      contactNumber: user.contactNumber || '',
      address: user.address || '',
      password: '',
      confirmPassword: '',
    });
    setEditing(false);
    setErrors({});
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer maxWidth="md">
      <Box sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Account
        </Typography>
        <Divider />
      </Box>

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12}>
          <ProfilePaper>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="user account tabs"
                textColor="secondary"
                indicatorColor="secondary"
              >
                <StyledTab label="Profile Information" />
                <StyledTab label="Password" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ProfileAvatar>
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </ProfileAvatar>
                  <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User ID: {user.userId}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {!editing ? (
                      <GradientButton
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => setEditing(true)}
                      >
                        Edit Profile
                      </GradientButton>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                        <SuccessGradientButton
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? <CircularProgress size={24} /> : 'Save'}
                        </SuccessGradientButton>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!editing}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!editing}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!editing}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Contact Number"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        disabled={!editing}
                        error={!!errors.contactNumber}
                        helperText={errors.contactNumber}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!editing}
                        multiline
                        rows={3}
                        error={!!errors.address}
                        helperText={errors.address}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!editing}
                    error={!!errors.password}
                    helperText={errors.password}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={!editing}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    margin="normal"
                  />
                  {!editing ? (
                    <GradientButton
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setEditing(true)}
                      sx={{ mt: 2 }}
                    >
                      Edit Password
                    </GradientButton>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <SuccessGradientButton
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? <CircularProgress size={24} /> : 'Save'}
                      </SuccessGradientButton>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
          </ProfilePaper>
        </Grid>
      </Grid>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default UserAccount; 
'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material'
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person,
  Phone
} from '@mui/icons-material'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'

interface RegisterFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
})

const RegisterForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting, resetForm }: FormikHelpers<RegisterFormValues>) => {
    try {
      setRegisterError('')
      setRegisterSuccess(false)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Register values:', values)
      
      setRegisterSuccess(true)
      resetForm()
      
    } catch {
      setRegisterError('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const initialValues: RegisterFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop={25}
    >
      <Paper
        elevation={20}
        sx={{
          width: '100%',
          maxWidth: 1200,
          borderRadius: '20px',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left Column - Animation */}
          <Box 
            sx={{
              flex: { xs: '0 0 auto', md: '1 1 50%' },
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src="/animations/sign-up-animate.svg"
                alt="Sign Up Animation"
                sx={{
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography 
                variant="h5" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  mb: 2,
                }}
              >
                Join DoughVault!
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  fontSize: '0.95rem'
                }}
              >
                Create your account and start managing your finances with ease
              </Typography>
            </Box>
          </Box>

          {/* Right Column - Form */}
          <Box 
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 50%' },
              padding: { xs: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1a202c',
                  mb: 1 
                }}
              >
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Join DoughVault to manage your finances
              </Typography>
            </Box>

            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
            {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
              <Form>
                <Stack spacing={2}>
                  {registerError && (
                    <Alert severity="error">
                      {registerError}
                    </Alert>
                  )}

                  {registerSuccess && (
                    <Alert severity="success">
                      Account created successfully! Please check your email to verify your account.
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      name="firstName"
                      label="First Name"
                      placeholder="Enter first name"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#64748b' }} />
                          </InputAdornment>
                        ),
                      }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        '& fieldset': {
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease-in-out',
                        },
                        '& input': {
                          color: '#1a202c',
                          fontWeight: 500,
                        },
                        '&:hover': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 3px rgba(0, 53, 102, 0.1)',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#ef4444',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#003566',
                        },
                      },
                    }}
                    />

                    <TextField
                      fullWidth
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter last name"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#64748b' }} />
                          </InputAdornment>
                        ),
                      }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        '& fieldset': {
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease-in-out',
                        },
                        '& input': {
                          color: '#1a202c',
                          fontWeight: 500,
                        },
                        '&:hover': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 3px rgba(0, 53, 102, 0.1)',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#ef4444',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#003566',
                        },
                      },
                    }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        '& fieldset': {
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease-in-out',
                        },
                        '& input': {
                          color: '#1a202c',
                          fontWeight: 500,
                        },
                        '&:hover': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 3px rgba(0, 53, 102, 0.1)',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#ef4444',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#003566',
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        '& fieldset': {
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease-in-out',
                        },
                        '& input': {
                          color: '#1a202c',
                          fontWeight: 500,
                        },
                        '&:hover': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 3px rgba(0, 53, 102, 0.1)',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#ef4444',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#003566',
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Create a strong password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            sx={{ 
                              color: '#64748b',
                              '&:hover': {
                                color: '#003566',
                                backgroundColor: 'rgba(0, 53, 102, 0.04)',
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        '& fieldset': {
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease-in-out',
                        },
                        '& input': {
                          color: '#1a202c',
                          fontWeight: 500,
                        },
                        '&:hover': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 3px rgba(0, 53, 102, 0.1)',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#ef4444',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#003566',
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                            sx={{ 
                              color: '#64748b',
                              '&:hover': {
                                color: '#003566',
                                backgroundColor: 'rgba(0, 53, 102, 0.04)',
                              }
                            }}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        '& fieldset': {
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease-in-out',
                        },
                        '& input': {
                          color: '#1a202c',
                          fontWeight: 500,
                        },
                        '&:hover': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#003566',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 3px rgba(0, 53, 102, 0.1)',
                          },
                          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                            color: '#003566',
                          },
                          '& input': {
                            color: '#1a202c',
                          }
                        },
                        '&.Mui-error fieldset': {
                          borderColor: '#ef4444',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#64748b',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#003566',
                        },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      backgroundColor: '#003566',
                      color: 'white',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      py: 2,
                      mt: 2,
                      boxShadow: '0 4px 14px rgba(0, 53, 102, 0.4)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#002347',
                        boxShadow: '0 6px 20px rgba(0, 53, 102, 0.6)',
                        transform: 'translateY(-1px)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&:disabled': {
                        backgroundColor: '#cbd5e1',
                        color: '#64748b',
                        boxShadow: 'none',
                        transform: 'none',
                      },
                    }}
                    startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <Box textAlign="center" mt={2}>
                    <Typography variant="body2" color="#64748b" sx={{ fontSize: '0.95rem' }}>
                      Already have an account?{' '}
                      <Button
                        variant="text"
                        onClick={() => router.push('/login')}
                        sx={{ 
                          color: '#003566',
                          fontWeight: 600,
                          textTransform: 'none',
                          p: 0,
                          minWidth: 'auto',
                          fontSize: '0.95rem',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 53, 102, 0.04)',
                            borderRadius: '6px',
                            px: 1,
                          }
                        }}
                      >
                        Sign In
                      </Button>
                    </Typography>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default RegisterForm
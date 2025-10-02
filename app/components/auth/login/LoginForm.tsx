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
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import { Formik, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'

interface LoginFormValues {
  email: string
  password: string
}

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
})

const LoginForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
    try {
      setLoginError('')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    console.log("🚀 ~ handleSubmit ~ values:", values)
      
    } catch {
      setLoginError('Invalid email or password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const initialValues: LoginFormValues = {
    email: '',
    password: ''
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
          maxWidth: 1000,
          borderRadius: '20px',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, }}>
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
                maxWidth: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src="/animations/login-animate.svg"
                alt="Login Animation"
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
                  color: '#1a202c',
                  mb: 2,
                }}
              >
                Welcome Back!
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#1a202c',
                  //fontWeight: 100,
                  textAlign: 'center',
                  lineHeight: 1.5,
                  fontSize: '0.95rem'
                }}
              >
                Enter your personal details to continue your journey with DoughVault
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
                Sign In
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Access your DoughVault account
              </Typography>
            </Box>

          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
              <Form>
                <Stack spacing={2}>
                  {loginError && (
                    <Alert severity="error">
                      {loginError}
                    </Alert>
                  )}

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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
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
                          '& .MuiIconButton-root': {
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
                          '& .MuiIconButton-root': {
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
                    {isSubmitting ? 'Signing In...' : 'Sign In to DoughVault'}
                  </Button>

                  <Box textAlign="center" mt={2}>
                    <Typography variant="body2" color="#64748b" sx={{ fontSize: '0.95rem' }}>
                      Don&apos;t have an account?{' '}
                      <Button
                        variant="text"
                        onClick={() => router.push('/register')}
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
                        Sign Up
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

export default LoginForm
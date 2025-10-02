'use client'

import { SignIn } from '@clerk/nextjs'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export default function Page() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <div>Loading...</div>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1000,
          borderRadius: '20px',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
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
            backgroundColor: '#ffffff',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 500,
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
                textAlign: 'center',
                lineHeight: 1.5,
                fontSize: '0.95rem'
              }}
            >
              Enter your details to continue managing your pizza shop inventory with DoughVault
            </Typography>
          </Box>
        </Box>

        {/* Right Column - Clerk Form */}
        <Box 
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 50%' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: 4, md: 5 },
            backgroundColor: '#ffffff',
          }}
        >
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: '#003566',
                  '&:hover': {
                    backgroundColor: '#002347',
                  }
                },
                card: {
                  boxShadow: 'none',
                  border: 'none',
                  backgroundColor: 'transparent',
                }
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

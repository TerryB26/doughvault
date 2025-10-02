'use client'

import { SignUp } from '@clerk/nextjs'
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
          maxWidth: 1200,
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
              Create your account and start managing your pizza shop inventory with ease
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
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: '#003566',
                  '&:hover': {
                    backgroundColor: '#002347',
                  }
                },
                card: {
                  //boxShadow: 'none',
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

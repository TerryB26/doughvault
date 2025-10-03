'use client';

import { Box, Typography, Button, Stack, keyframes } from '@mui/material';
import Link from 'next/link';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.05); }
`;

const PizzaShopLanding = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fff8f0',
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(255, 152, 0, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.03) 0%, transparent 50%)
        `,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff9800' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }
      }}
    >
      {/* Floating pizza ingredients */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 40,
          height: 40,
          backgroundColor: '#ff6b35',
          borderRadius: '50%',
          opacity: 0.1,
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          right: '10%',
          width: 30,
          height: 30,
          backgroundColor: '#22c55e',
          borderRadius: '50%',
          opacity: 0.15,
          animation: `${float} 4s ease-in-out infinite reverse`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: 25,
          height: 25,
          backgroundColor: '#fbbf24',
          borderRadius: '50%',
          opacity: 0.1,
          animation: `${float} 5s ease-in-out infinite`,
        }}
      />

      <Box
        sx={{
          maxWidth: 1200,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 4, md: 8 },
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          mx: 'auto',
          px: 2,
          py: 4,
        }}
      >
        {/* Left Column - Content */}
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          {/* Pizza badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#ff6b35',
              color: 'white',
              px: 3,
              py: 1.5,
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: 600,
              mb: 4,
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
            }}
          >
            🍕 #1 Pizza Shop Software
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b35 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 3,
              fontSize: { xs: '3rem', md: '4rem', lg: '5rem' },
              lineHeight: 1.1,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            DoughVault
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              color: '#8b4513',
              mb: 4,
              fontWeight: 600,
              fontSize: { xs: '1.5rem', md: '2rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            Your Pizza Shop&apos;s Digital Pantry 🧄
          </Typography>

          <Typography
            sx={{
              color: '#6b46c1',
              mb: 6,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              lineHeight: 1.6,
              maxWidth: { xs: '100%', md: '500px' },
              mx: { xs: 'auto', md: 0 },
              fontWeight: 500,
            }}
          >
            From flour to pepperoni, track every ingredient with style! 
            Keep your pizza shop stocked with smart inventory management 
            that&apos;s as fresh as your dough. 🍅 Built by pizza lovers, for pizza lovers.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent={{ xs: 'center', md: 'flex-start' }}
          >
            <Button
              component={Link}
              href="/sign-up"
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #d32f2f 30%, #ff6b35 90%)',
                color: 'white',
                px: 6,
                py: 3.5,
                borderRadius: '25px',
                textTransform: 'none',
                fontSize: '1.2rem',
                fontWeight: 700,
                boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '"🚀"',
                  marginRight: 1,
                },
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 15px 40px rgba(211, 47, 47, 0.5)',
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(0.98)',
                },
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              Start Your Pizza Journey
            </Button>
            
            <Button
              component={Link}
              href="/sign-in"
              variant="outlined"
              size="large"
              sx={{
                color: '#8b4513',
                borderColor: '#ff6b35',
                borderWidth: '2px',
                px: 6,
                py: 3.5,
                borderRadius: '25px',
                textTransform: 'none',
                fontSize: '1.2rem',
                fontWeight: 700,
                position: 'relative',
                '&:before': {
                  content: '"🍕"',
                  marginRight: 1,
                },
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  transform: 'translateY(-2px)',
                  borderWidth: '2px',
                  color: '#d32f2f',
                },
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              I&apos;m Already Cooking
            </Button>
          </Stack>
        </Box>

        {/* Right Column - Pizza Image */}
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Pizza oven background effect */}
          <Box
            sx={{
              position: 'absolute',
              width: '120%',
              height: '120%',
              background: 'radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: `${pulse} 4s ease-in-out infinite`,
            }}
          />
          
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 500,
              aspectRatio: '1',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#fff8f0',
              boxShadow: `
                0 25px 80px rgba(211, 47, 47, 0.2),
                0 0 0 8px rgba(255, 107, 53, 0.1),
                0 0 0 16px rgba(255, 152, 0, 0.05)
              `,
              border: '4px solid rgba(255, 107, 53, 0.2)',
              transform: 'rotate(-5deg)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(0deg) scale(1.02)',
              },
            }}
          >
            <Box
              component="img"
              src="/images/mainpizza.png"
              alt="Fresh Pizza - DoughVault Inventory Management"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'rotate(5deg) scale(1.1)',
              }}
            />
            
            {/* Pizza toppings floating elements */}
            <Box
              sx={{
                position: 'absolute',
                top: '15%',
                right: '20%',
                width: 15,
                height: 15,
                backgroundColor: '#22c55e',
                borderRadius: '50%',
                opacity: 0.8,
                animation: `${float} 3s ease-in-out infinite`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '25%',
                left: '15%',
                width: 20,
                height: 20,
                backgroundColor: '#dc2626',
                borderRadius: '50%',
                opacity: 0.7,
                animation: `${float} 4s ease-in-out infinite reverse`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '40%',
                left: '10%',
                width: 12,
                height: 12,
                backgroundColor: '#fbbf24',
                borderRadius: '50%',
                opacity: 0.6,
                animation: `${float} 5s ease-in-out infinite`,
              }}
            />
          </Box>

          {/* Ingredient labels */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              backgroundColor: '#ffffff',
              px: 2,
              py: 1,
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#8b4513',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              border: '2px solid rgba(255, 107, 53, 0.2)',
            }}
          >
            🧄 Fresh Garlic
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              right: '5%',
              backgroundColor: '#ffffff',
              px: 2,
              py: 1,
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#8b4513',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              border: '2px solid rgba(255, 107, 53, 0.2)',
            }}
          >
            🍅 San Marzano
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PizzaShopLanding;

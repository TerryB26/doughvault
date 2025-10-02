import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { Box, Typography, Paper } from '@mui/material'

export default async function Dashboard() {
  const user = await currentUser()

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c' }}>
          Welcome to DoughVault, {user?.firstName}!
        </Typography>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: {
                width: '40px',
                height: '40px',
              }
            }
          }}
        />
      </Box>
      
      <Paper
        sx={{
          p: 4,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Typography variant="h6" sx={{ color: '#64748b', mb: 2 }}>
          Your pizza shop inventory dashboard is ready!
        </Typography>
        <Typography sx={{ color: '#64748b' }}>
          Start managing your ingredients and stock levels with DoughVault&apos;s powerful inventory tools.
        </Typography>
      </Paper>
    </Box>
  )
}

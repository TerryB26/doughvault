'use client';

import { Paper, Typography } from '@mui/material';

interface ClerkIdDisplayProps {
  userId: string | undefined;
}

export default function ClerkIdDisplay({ userId }: ClerkIdDisplayProps) {
  const handleCopy = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      alert('Clerk User ID copied to clipboard!');
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '2px solid #f59e0b',
      }}
    >
      <Typography variant="h6" sx={{ color: '#92400e', mb: 2, fontWeight: 600 }}>
        🔑 Your Clerk User ID (Copy this for database setup)
      </Typography>
      <Paper
        sx={{
          p: 2,
          bgcolor: 'white',
          fontFamily: 'monospace',
          fontSize: '14px',
          wordBreak: 'break-all',
          cursor: 'pointer',
          '&:hover': { bgcolor: '#f9fafb' }
        }}
        onClick={handleCopy}
      >
        {userId || 'Loading...'}
      </Paper>
      <Typography sx={{ color: '#92400e', mt: 2, fontSize: '13px' }}>
        Click the box above to copy your User ID, then run the SQL commands in your database.
      </Typography>
    </Paper>
  );
}

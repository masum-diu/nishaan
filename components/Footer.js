import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'var(--secondary-color)',
        color: 'var(--text-light)',
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, sm: 4 },
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: 'center',
          }}
        >
          <Link href="/about" style={{ color: 'var(--text-light)' }}>About Us</Link>
          <Link href="/contact" style={{ color: 'var(--text-light)' }}>Contact</Link>
          <Link href="/terms" style={{ color: 'var(--text-light)' }}>Terms & Conditions</Link>
          <Link href="/privacy" style={{ color: 'var(--text-light)' }}>Privacy Policy</Link>
        </Box>
        <Typography variant="body2" align="center">
          &copy; {new Date().getFullYear()} eCommerce. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
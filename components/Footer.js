import Link from 'next/link';
import { Box, Container, Grid, Typography, IconButton, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedIcon from '@mui/icons-material/Verified';
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#585864',
        color: '#fff',
        py: 6,
        // mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              component="img"
              src="/assets/logo.png"
              alt="Nishaan Logo"
              sx={{
                height: { xs: 50, md: 100 },
                width: "auto",
                cursor: "pointer",
              }}
            />
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
            Nishaan is built to bring global products closer to you. We focus on quality, affordability,
              and items that make everyday life better.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                component="a"
                href="https://www.facebook.com/share/1CLxNSKbyn/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                sx={{ color: '#fff' }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Twitter" sx={{ color: '#fff' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton component="a"
                href=" https://www.instagram.com/nishaanbd/?hl=en"
                target="_blank"
                rel="noopener noreferrer" aria-label="Instagram" sx={{ color: '#fff' }}>
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn" sx={{ color: '#fff' }}>
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
              <Link href="/products" style={{ color: '#fff', textDecoration: 'none' }}>Shop</Link>
              <Link href="/about" style={{ color: '#fff', textDecoration: 'none' }}>About Us</Link>
              <Link href="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact Us</Link>
            </Stack>
          </Grid>

          {/* Customer Care */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Customer Care
            </Typography>
            <Stack spacing={1}>
              <Link href="/terms" style={{ color: '#fff', textDecoration: 'none' }}>Terms & Conditions</Link>
              <Link href="/privacy" style={{ color: '#fff', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/faq" style={{ color: '#fff', textDecoration: 'none' }}>FAQs</Link>
              <Link href="/returns" style={{ color: '#fff', textDecoration: 'none' }}>Return Policy</Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">Dhaka Bangladesh</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">+8801700990433</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">info@nishaans.com</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', mt: 4, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} Nishaan. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function ContactPage() {
  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Have questions or feedback? We'd love to hear from you. Reach out to us, and we'll get back to you shortly.
          </Typography>
        </Box>

        <Grid container spacing={5}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 12 }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={3}>Send us a message</Typography>
                <form>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Full Name" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField label="Email Address" type="email" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField label="Subject" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Your Message"
                        variant="outlined"
                        multiline
                        rows={5}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button type="submit" variant="contained" size="large" fullWidth>
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Info */}
          {/* <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>Contact Information</Typography>
            <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <PhoneIcon color="primary" />
                    <Typography>+880 1234 567890</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <EmailIcon color="primary" />
                    <Typography>support@nishaan.com</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <LocationOnIcon color="primary" />
                    <Typography>123 Gulshan Avenue, Dhaka, Bangladesh</Typography>
                </Stack>
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
}

export default ContactPage;
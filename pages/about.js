import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import FavoriteIcon from '@mui/icons-material/Favorite';

const teamMembers = [
  { name: "Masum Billah", role: "Founder & CEO", avatar: "/assets/avatar1.jpg" },
  { name: "Jane Doe", role: "Head of Design", avatar: "/assets/avatar2.jpg" },
  { name: "John Smith", role: "Lead Developer", avatar: "/assets/avatar3.jpg" },
];

const values = [
    {
        icon: <FavoriteIcon fontSize="large" color="primary" />,
        title: "Customer First",
        description: "We believe in creating a loyal customer base by providing an unparalleled shopping experience."
    },
    {
        icon: <EmojiObjectsIcon fontSize="large" color="primary" />,
        title: "Innovation",
        description: "We constantly seek out the latest trends and technologies to bring you the best products."
    },
    {
        icon: <PeopleIcon fontSize="large" color="primary" />,
        title: "Community",
        description: "We are more than a store; we are a community of fashion and tech enthusiasts."
    }
];

function AboutPage() {
  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            About Nishaan
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '750px', mx: 'auto' }}>
            Your one-stop shop for quality, style, and unbeatable prices. We are committed to bringing you the best products with an exceptional shopping experience.
          </Typography>
        </Box>

        {/* Our Mission Section */}
        <Grid container spacing={5} alignItems="center" sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box component="img" src="/assets/misson.jpg" alt="Our Mission" sx={{ width: '100%', borderRadius: 4, boxShadow: 3 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              At Nishaan, our mission is to redefine the online shopping experience by offering a curated selection of high-quality products that blend style, comfort, and innovation. We aim to inspire our customers and build a community around our shared passion for excellence.
            </Typography>
          </Grid>
        </Grid>

        {/* Our Values */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Our Values</Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
                {values.map(value => (
                    <Grid size={{ xs: 12, md: 4 }} key={value.title}>
                        <Card sx={{ p: 2, height: '100%', boxShadow: 0, bgcolor: 'transparent' }}>
                            <Box sx={{ mb: 2 }}>{value.icon}</Box>
                            <Typography variant="h6" fontWeight="bold">{value.title}</Typography>
                            <Typography color="text.secondary">{value.description}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Meet The Team
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {teamMembers.map((member) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={member.name}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                  <Avatar
                    alt={member.name}
                    src={member.avatar}
                    sx={{ width: 120, height: 120, margin: "20px auto", border: '3px solid', borderColor: 'primary.main' }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {member.name}
                    </Typography>
                    <Typography color="text.secondary">{member.role}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default AboutPage;
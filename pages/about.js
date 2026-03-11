import React from "react";
import MetaTags from "../components/MetaTags";
import { Box, Container, Typography, Divider, Stack, Paper } from "@mui/material";

function AboutPage() {
  return (
    <>
      <MetaTags
        title="Nishaans - About Us"
        description="Learn more about Nishaan, our mission and vision."
        url="https://yoursite.com/about"
      />

      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 5 }}>
            <Stack spacing={3}>

              <Typography variant="h4" fontWeight="bold">
                About Nishaan
              </Typography>

              <Typography color="text.secondary">
                <strong>Nishaan – The Mark of Trust.</strong>
              </Typography>

              <Typography textAlign="justify">
                Welcome to Nishaan! We believe that shopping is more than just
                buying products; it’s an experience. Our journey began with a
                simple mission: to bring high-quality, modern, and essential
                products directly to your doorstep with ease and reliability.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Why Choose Nishaan?
              </Typography>

              <Box component="ul" sx={{ pl: 3 }}>
                <li>
                  <Typography>
                    <strong>Premium Quality:</strong> We meticulously handpick
                    every item in our collection to ensure you receive nothing
                    but the best.
                  </Typography>
                </li>

                <li>
                  <Typography>
                    <strong>Integrity & Transparency:</strong> Honesty is the
                    backbone of our business. From accurate product descriptions
                    to fair pricing, we maintain transparency at every step.
                  </Typography>
                </li>

                <li>
                  <Typography>
                    <strong>Customer-Centric Approach:</strong> For us, the
                    customer always comes first. Our dedicated team is always
                    ready to assist you and ensure a seamless shopping journey.
                  </Typography>
                </li>
              </Box>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Our Vision
              </Typography>

              <Typography textAlign="justify">
                Our vision is to set a <strong>"Nishaan"</strong> (a benchmark)
                in the e-commerce industry of Bangladesh by providing a
                platform where every customer can shop with absolute confidence
                and convenience.
              </Typography>

            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default AboutPage;
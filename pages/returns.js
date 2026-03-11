import React from "react";
import MetaTags from "../components/MetaTags";
import { Box, Container, Typography, Paper, Stack, Divider } from "@mui/material";

function RefundPolicyPage() {
  return (
    <>
      <MetaTags
        title="Nishaans - Refund & Return Policy"
        description="Learn about our refund and return policy. We accept returns within 3 days of delivery if items meet eligibility criteria."
        url="https://nishaans.com/refund"
      />

      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 5 }}>
            <Stack spacing={3}>
              <Typography variant="h4" fontWeight="bold">
                Refund & Return Policy
              </Typography>

              <Typography color="text.secondary">
                We want you to be fully satisfied with your purchase. If you are not happy with your item, please review our refund policy below.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Return Period
              </Typography>

              <Typography>
                We have a <strong>3-day return policy</strong>. This means you have 3 days after receiving your item to request a return.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Eligibility
              </Typography>

              <Typography>
                To be eligible for a return:
              </Typography>

              <Box component="ul" sx={{ pl: 3 }}>
                <li>Your item must be in the same condition that you received it.</li>
                <li>Items must be unworn or unused, with tags attached.</li>
                <li>The item must be in its original packaging.</li>
                <li>You must provide the receipt or proof of purchase.</li>
              </Box>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                How to Request a Return
              </Typography>

              <Typography>
                Please contact our customer support team via email or phone to initiate a return. Our team will guide you through the process.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Contact Information
              </Typography>

              <Typography>Business Name: Nishaan</Typography>
              <Typography>Email: info@nishaans.bd</Typography>
              <Typography>Phone: +8801700990433</Typography>
              <Typography>Country: Bangladesh</Typography>

            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default RefundPolicyPage;
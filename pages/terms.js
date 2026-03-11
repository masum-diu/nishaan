import React from "react";
import MetaTags from "../components/MetaTags";
import { Box, Container, Typography, Divider, Stack, Paper } from "@mui/material";

function TermsPage() {
  return (
    <>
      <MetaTags
        title="Nishaans - Terms and Conditions"
        description="Read the terms and conditions for using Nishaan's website and services."
        url="https://nishaans.com/terms"
      />

      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 5 }}>
            <Stack spacing={3}>

              <Typography variant="h4" fontWeight="bold">
                Terms of Service
              </Typography>

              <Typography>
                This website is operated by Nishaan. Throughout the site, the terms
                “we”, “us” and “our” refer to Nishaan. By visiting our website or
                purchasing from us, you agree to the following Terms of Service.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 1 – Online Store Terms
              </Typography>

              <Typography>
                By agreeing to these Terms of Service, you confirm that you are at
                least the age of majority in your country or have permission from a
                legal guardian to use this website.
              </Typography>

              <Box component="ul" sx={{ pl: 3 }}>
                <li>You may not use our products for illegal purposes.</li>
                <li>You must not transmit viruses or malicious code.</li>
                <li>Violation of these Terms may result in termination of service.</li>
              </Box>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 2 – General Conditions
              </Typography>

              <Typography>
                We reserve the right to refuse service to anyone at any time for any
                reason.
              </Typography>

              <Box component="ul" sx={{ pl: 3 }}>
                <li>Content may be transferred across networks.</li>
                <li>Credit card information is always encrypted.</li>
                <li>You may not copy, resell, or exploit our services without permission.</li>
              </Box>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 3 – Accuracy of Information
              </Typography>

              <Typography>
                We are not responsible if information on this site is not accurate,
                complete, or current. Content is provided for general information
                only.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 4 – Modifications to Services and Prices
              </Typography>

              <Typography>
                Prices for products may change without notice. We reserve the right
                to modify or discontinue any service at any time.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 5 – Products or Services
              </Typography>

              <Typography>
                Some products may be available exclusively online and may have
                limited quantities. Returns and exchanges are subject to our refund
                policy.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 6 – Billing and Account Information
              </Typography>

              <Typography>
                We reserve the right to refuse any order placed with us. You agree
                to provide accurate and complete billing information for all
                purchases.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 7 – Third-Party Links
              </Typography>

              <Typography>
                Our site may contain links to third-party websites. We are not
                responsible for the content or privacy practices of these sites.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 8 – Prohibited Uses
              </Typography>

              <Box component="ul" sx={{ pl: 3 }}>
                <li>Using the website for unlawful purposes</li>
                <li>Violating laws or regulations</li>
                <li>Uploading malicious code or viruses</li>
                <li>Collecting personal information of others without consent</li>
              </Box>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 9 – Disclaimer of Warranties
              </Typography>

              <Typography>
                We do not guarantee that your use of our services will be
                uninterrupted or error-free. Use of the service is at your own
                risk.
              </Typography>

              <Divider />

              <Typography variant="h5" fontWeight="bold">
                Section 10 – Governing Law
              </Typography>

              <Typography>
                These Terms shall be governed by the laws of Bangladesh.
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

export default TermsPage;
import React from "react";
import {
  Container,
  Typography,
  Box,
  Divider,
  Stack,
  Paper,
} from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 5 }}>
        <Stack spacing={3}>
          <Typography variant="h4" fontWeight="bold">
            Privacy Policy
          </Typography>

          <Typography>
            This Privacy Policy describes how Nishaan’s (the “Site”, “we”,
            “us”, or “our”) collects, uses, and discloses your personal
            information when you visit, use our services, or make a purchase
            from nishaans.com (the “Site”) or otherwise communicate with us
            regarding the Site (collectively, the “Services”).
          </Typography>

          <Typography>
            For purposes of this Privacy Policy, “you” and “your” means you as
            the user of the Services, whether you are a customer, website
            visitor, or another individual whose information we have collected
            pursuant to this Privacy Policy.
          </Typography>

          <Typography>
            Please read this Privacy Policy carefully. By using and accessing
            any of the Services, you agree to the collection, use, and
            disclosure of your information as described in this Privacy Policy.
          </Typography>

          <Divider />

          <Typography variant="h5" fontWeight="bold">
            Changes to This Privacy Policy
          </Typography>

          <Typography>
            We may update this Privacy Policy from time to time, including to
            reflect changes to our practices or for operational, legal, or
            regulatory reasons. The updated policy will be posted on the Site
            with the revised “Last updated” date.
          </Typography>

          <Divider />

          <Typography variant="h5" fontWeight="bold">
            How We Collect and Use Your Personal Information
          </Typography>

          <Typography>
            To provide the Services, we collect personal information from
            various sources. The information collected depends on how you
            interact with our website and services.
          </Typography>

          <Typography>
            We may use your information to:
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            <li>Communicate with you</li>
            <li>Provide, operate and improve our services</li>
            <li>Comply with legal obligations</li>
            <li>Enforce our terms of service</li>
            <li>Protect our users and services</li>
          </Box>

          <Divider />

          <Typography variant="h5" fontWeight="bold">
            What Personal Information We Collect
          </Typography>

          <Typography variant="h6" fontWeight="bold">
            1. Information We Collect Directly from You
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            <li>Contact details: name, address, phone number, email</li>
            <li>Order information: billing & shipping address</li>
            <li>Account information: username, password</li>
            <li>Customer support messages</li>
          </Box>

          <Typography variant="h6" fontWeight="bold">
            2. Information Collected Automatically
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            <li>Device information</li>
            <li>Browser information</li>
            <li>IP address</li>
            <li>Pages viewed</li>
            <li>User actions on the website</li>
          </Box>

          <Typography variant="h6" fontWeight="bold">
            3. Information From Third Parties
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            <li>Hosting providers</li>
            <li>Payment processors</li>
            <li>Advertising partners</li>
            <li>Email marketing platforms</li>
          </Box>

          <Divider />

          <Typography variant="h5" fontWeight="bold">
            How We Use Your Personal Information
          </Typography>

          <Typography variant="h6">Providing Products and Services</Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            <li>Process payments</li>
            <li>Fulfill orders</li>
            <li>Manage user accounts</li>
            <li>Arrange shipping</li>
          </Box>

          <Typography variant="h6">Marketing and Advertising</Typography>

          <Typography>
            We may send promotional emails or SMS messages. You may opt out at
            any time.
          </Typography>

          <Typography variant="h6">Security and Fraud Prevention</Typography>

          <Typography>
            We monitor activity to prevent fraud or illegal activity and
            protect our services.
          </Typography>

          <Divider />

          <Typography variant="h5" fontWeight="bold">
            Cookies
          </Typography>

          <Typography>
            We use cookies to improve website functionality, remember user
            preferences, analyze traffic, and provide targeted advertising.
          </Typography>

          <Divider />

          <Typography variant="h5" fontWeight="bold">
            Security & Data Retention
          </Typography>

          <Typography>
            We take reasonable measures to protect your personal information.
            However, no system is completely secure.
          </Typography>

          <Divider />

          <Typography variant="h5" fontWeight="bold">
            Your Rights
          </Typography>

          <Typography>
            Depending on your location, you may have the right to access,
            correct, delete, or restrict processing of your personal data.
          </Typography>

          <Divider />

          <Typography variant="h5" fontWeight="bold">
            Contact Us
          </Typography>

          <Typography>
            If you have questions about this Privacy Policy, contact us:
          </Typography>

          <Box>
            <Typography>Business Name: Nishaan</Typography>
            <Typography>Email: info@nishaans.com</Typography>
            <Typography>Website: www.nishaans.com</Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
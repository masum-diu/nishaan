import React from "react";
import { Container, Typography, Box, Divider, Stack, Paper, Grid } from "@mui/material";

const bn = {
  heading: "গোপনীয়তা নীতি",
  intro1: "এই গোপনীয়তা নীতিতে বর্ণনা করা হয়েছে কিভাবে নিশান (\"সাইট\", \"আমরা\", \"আমাদের\") আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং প্রকাশ করে যখন আপনি nishaans.com পরিদর্শন করেন, আমাদের সেবা ব্যবহার করেন বা কেনাকাটা করেন।",
  intro2: "এই গোপনীয়তা নীতির উদ্দেশ্যে, \"আপনি\" এবং \"আপনার\" বলতে সেবার ব্যবহারকারী হিসেবে আপনাকে বোঝায়, আপনি গ্রাহক, ওয়েবসাইট দর্শনার্থী বা অন্য যেকোনো ব্যক্তি হোন।",
  intro3: "অনুগ্রহ করে এই গোপনীয়তা নীতি মনোযোগ দিয়ে পড়ুন। যেকোনো সেবা ব্যবহার করে আপনি এই নীতিতে বর্ণিত তথ্য সংগ্রহ, ব্যবহার ও প্রকাশে সম্মতি দিচ্ছেন।",
  changesHeading: "এই নীতিতে পরিবর্তন",
  changes: "আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। আপডেট করা নীতি সাইটে পোস্ট করা হবে।",
  collectHeading: "আমরা কিভাবে আপনার তথ্য সংগ্রহ ও ব্যবহার করি",
  collectIntro: "সেবা প্রদানের জন্য আমরা বিভিন্ন উৎস থেকে ব্যক্তিগত তথ্য সংগ্রহ করি।",
  useIntro: "আমরা আপনার তথ্য ব্যবহার করতে পারি:",
  usePoints: ["আপনার সাথে যোগাযোগ করতে", "আমাদের সেবা পরিচালনা ও উন্নত করতে", "আইনি বাধ্যবাধকতা পালন করতে", "আমাদের সেবার শর্তাবলী প্রয়োগ করতে", "আমাদের ব্যবহারকারী ও সেবা রক্ষা করতে"],
  whatHeading: "আমরা কী ব্যক্তিগত তথ্য সংগ্রহ করি",
  direct: "১. সরাসরি আপনার কাছ থেকে সংগৃহীত তথ্য",
  directPoints: ["যোগাযোগের তথ্য: নাম, ঠিকানা, ফোন নম্বর, ইমেইল", "অর্ডার তথ্য: বিলিং ও শিপিং ঠিকানা", "অ্যাকাউন্ট তথ্য: ব্যবহারকারীর নাম, পাসওয়ার্ড", "গ্রাহক সহায়তা বার্তা"],
  auto: "২. স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য",
  autoPoints: ["ডিভাইস তথ্য", "ব্রাউজার তথ্য", "আইপি ঠিকানা", "দেখা পেজসমূহ", "ওয়েবসাইটে ব্যবহারকারীর কার্যক্রম"],
  third: "৩. তৃতীয় পক্ষ থেকে তথ্য",
  thirdPoints: ["হোস্টিং প্রদানকারী", "পেমেন্ট প্রসেসর", "বিজ্ঞাপন অংশীদার", "ইমেইল মার্কেটিং প্ল্যাটফর্ম"],
  howUseHeading: "আমরা কিভাবে আপনার তথ্য ব্যবহার করি",
  products: "পণ্য ও সেবা প্রদান",
  productsPoints: ["পেমেন্ট প্রক্রিয়া করা", "অর্ডার পূরণ করা", "ব্যবহারকারীর অ্যাকাউন্ট পরিচালনা", "শিপিং ব্যবস্থা করা"],
  marketing: "মার্কেটিং ও বিজ্ঞাপন",
  marketingText: "আমরা প্রচারমূলক ইমেইল বা এসএমএস পাঠাতে পারি। আপনি যেকোনো সময় অপ্ট আউট করতে পারবেন।",
  security: "নিরাপত্তা ও জালিয়াতি প্রতিরোধ",
  securityText: "আমরা জালিয়াতি বা অবৈধ কার্যকলাপ প্রতিরোধ করতে এবং আমাদের সেবা রক্ষা করতে কার্যক্রম পর্যবেক্ষণ করি।",
  cookiesHeading: "কুকিজ",
  cookiesText: "আমরা ওয়েবসাইটের কার্যকারিতা উন্নত করতে, ব্যবহারকারীর পছন্দ মনে রাখতে, ট্র্যাফিক বিশ্লেষণ করতে এবং লক্ষ্যভিত্তিক বিজ্ঞাপন প্রদান করতে কুকিজ ব্যবহার করি।",
  retentionHeading: "নিরাপত্তা ও তথ্য সংরক্ষণ",
  retentionText: "আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষার জন্য যুক্তিসঙ্গত ব্যবস্থা গ্রহণ করি। তবে কোনো সিস্টেম সম্পূর্ণ নিরাপদ নয়।",
  rightsHeading: "আপনার অধিকার",
  rightsText: "আপনার অবস্থানের উপর নির্ভর করে, আপনার ব্যক্তিগত তথ্য অ্যাক্সেস, সংশোধন, মুছে ফেলা বা প্রক্রিয়াকরণ সীমাবদ্ধ করার অধিকার থাকতে পারে।",
  contactHeading: "যোগাযোগ করুন",
  contactIntro: "এই গোপনীয়তা নীতি সম্পর্কে প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন:",
};

const en = {
  heading: "Privacy Policy",
  intro1: "This Privacy Policy describes how Nishaan's (the \"Site\", \"we\", \"us\", or \"our\") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from nishaans.com.",
  intro2: "For purposes of this Privacy Policy, \"you\" and \"your\" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected.",
  intro3: "Please read this Privacy Policy carefully. By using and accessing any of the Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy.",
  changesHeading: "Changes to This Privacy Policy",
  changes: "We may update this Privacy Policy from time to time. The updated policy will be posted on the Site with the revised date.",
  collectHeading: "How We Collect and Use Your Personal Information",
  collectIntro: "To provide the Services, we collect personal information from various sources.",
  useIntro: "We may use your information to:",
  usePoints: ["Communicate with you", "Provide, operate and improve our services", "Comply with legal obligations", "Enforce our terms of service", "Protect our users and services"],
  whatHeading: "What Personal Information We Collect",
  direct: "1. Information We Collect Directly from You",
  directPoints: ["Contact details: name, address, phone number, email", "Order information: billing & shipping address", "Account information: username, password", "Customer support messages"],
  auto: "2. Information Collected Automatically",
  autoPoints: ["Device information", "Browser information", "IP address", "Pages viewed", "User actions on the website"],
  third: "3. Information From Third Parties",
  thirdPoints: ["Hosting providers", "Payment processors", "Advertising partners", "Email marketing platforms"],
  howUseHeading: "How We Use Your Personal Information",
  products: "Providing Products and Services",
  productsPoints: ["Process payments", "Fulfill orders", "Manage user accounts", "Arrange shipping"],
  marketing: "Marketing and Advertising",
  marketingText: "We may send promotional emails or SMS messages. You may opt out at any time.",
  security: "Security and Fraud Prevention",
  securityText: "We monitor activity to prevent fraud or illegal activity and protect our services.",
  cookiesHeading: "Cookies",
  cookiesText: "We use cookies to improve website functionality, remember user preferences, analyze traffic, and provide targeted advertising.",
  retentionHeading: "Security & Data Retention",
  retentionText: "We take reasonable measures to protect your personal information. However, no system is completely secure.",
  rightsHeading: "Your Rights",
  rightsText: "Depending on your location, you may have the right to access, correct, delete, or restrict processing of your personal data.",
  contactHeading: "Contact Us",
  contactIntro: "If you have questions about this Privacy Policy, contact us:",
};

function PrivacyColumn({ t }) {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight="bold">{t.heading}</Typography>
      <Typography>{t.intro1}</Typography>
      <Typography>{t.intro2}</Typography>
      <Typography>{t.intro3}</Typography>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.changesHeading}</Typography>
      <Typography>{t.changes}</Typography>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.collectHeading}</Typography>
      <Typography>{t.collectIntro}</Typography>
      <Typography>{t.useIntro}</Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        {t.usePoints.map((p, i) => <li key={i}><Typography>{p}</Typography></li>)}
      </Box>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.whatHeading}</Typography>
      <Typography variant="h6" fontWeight="bold">{t.direct}</Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        {t.directPoints.map((p, i) => <li key={i}><Typography>{p}</Typography></li>)}
      </Box>
      <Typography variant="h6" fontWeight="bold">{t.auto}</Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        {t.autoPoints.map((p, i) => <li key={i}><Typography>{p}</Typography></li>)}
      </Box>
      <Typography variant="h6" fontWeight="bold">{t.third}</Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        {t.thirdPoints.map((p, i) => <li key={i}><Typography>{p}</Typography></li>)}
      </Box>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.howUseHeading}</Typography>
      <Typography variant="h6">{t.products}</Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        {t.productsPoints.map((p, i) => <li key={i}><Typography>{p}</Typography></li>)}
      </Box>
      <Typography variant="h6">{t.marketing}</Typography>
      <Typography>{t.marketingText}</Typography>
      <Typography variant="h6">{t.security}</Typography>
      <Typography>{t.securityText}</Typography>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.cookiesHeading}</Typography>
      <Typography>{t.cookiesText}</Typography>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.retentionHeading}</Typography>
      <Typography>{t.retentionText}</Typography>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.rightsHeading}</Typography>
      <Typography>{t.rightsText}</Typography>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.contactHeading}</Typography>
      <Typography>{t.contactIntro}</Typography>
      <Box>
        <Typography>Business Name: Nishaan</Typography>
        <Typography>Email: info@nishaans.com</Typography>
        <Typography>Website: www.nishaans.com</Typography>
      </Box>
    </Stack>
  );
}

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 5 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ pr: { md: 4 } }}>
            <PrivacyColumn t={bn} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ borderLeft: { md: "1px solid #e0e0e0" }, pl: { md: 4 } }}>
            <PrivacyColumn t={en} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

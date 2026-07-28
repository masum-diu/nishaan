import React from "react";
import MetaTags from "../components/MetaTags";
import { Box, Container, Typography, Divider, Stack, Paper, Grid } from "@mui/material";

const bn = {
  heading: "আমাদের সম্পর্কে",
  tagline: "নিশান – বিশ্বাসের প্রতীক, মানসম্মত কেনাকাটার নিশ্চয়তা।",
  intro: "নিশান-এ আপনাকে স্বাগতম। আমরা বিশ্বাস করি, কেনাকাটা শুধু একটি পণ্য কেনার বিষয় নয়—এটি একটি সুন্দর ও নির্ভরযোগ্য অভিজ্ঞতা। সেই লক্ষ্য নিয়েই আমাদের যাত্রা শুরু। আমরা প্রতিদিনের প্রয়োজনীয়, মানসম্মত এবং আধুনিক পণ্য সহজে, নিরাপদে ও সাশ্রয়ী মূল্যে আপনার দোরগোড়ায় পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।",
  whyHeading: "কেন নিশান?",
  points: [
    { title: "✔️ উন্নত মানের পণ্য:", desc: "আমাদের প্রতিটি পণ্য সতর্কতার সঙ্গে নির্বাচন করা হয়, যাতে আপনি সর্বোচ্চ মানের পণ্য এবং সেরা ব্যবহারিক অভিজ্ঞতা পান।" },
    { title: "✔️ সততা ও স্বচ্ছতা:", desc: "আমরা বিশ্বাস করি বিশ্বাসই একটি সফল সম্পর্কের ভিত্তি। তাই পণ্যের সঠিক তথ্য, ন্যায্য মূল্য এবং নির্ভরযোগ্য সেবার মাধ্যমে প্রতিটি ধাপে স্বচ্ছতা বজায় রাখি।" },
    { title: "✔️ গ্রাহক সেবায় অঙ্গীকারবদ্ধ:", desc: "আপনার সন্তুষ্টিই আমাদের সর্বোচ্চ অগ্রাধিকার। যেকোনো প্রয়োজনে আমাদের সহায়ক টিম দ্রুত ও আন্তরিকভাবে আপনাকে সহযোগিতা করতে প্রস্তুত।" },
  ],
  visionHeading: "আমাদের লক্ষ্য",
  vision: "আমাদের লক্ষ্য হলো বাংলাদেশের ই-কমার্স খাতে একটি বিশ্বস্ত ও নির্ভরযোগ্য ব্র্যান্ড হিসেবে প্রতিষ্ঠিত হওয়া, যেখানে প্রতিটি গ্রাহক নিশ্চিন্তে, নিরাপদে এবং সাশ্রয়ী মূল্যে কেনাকাটা করতে পারবেন। আপনাদের আস্থা, ভালোবাসা এবং সহযোগিতাই আমাদের এগিয়ে যাওয়ার সবচেয়ে বড় অনুপ্রেরণা।",
};

const en = {
  heading: "About Nishaan",
  tagline: "Nishaan – The Mark of Trust, Your Guarantee of Quality Shopping.",
  intro: "Welcome to Nishaan! We believe that shopping is more than just buying products; it's a beautiful and reliable experience. Our journey began with that very goal. We are committed to delivering everyday essential, quality, and modern products to your doorstep easily, safely, and at affordable prices.",
  whyHeading: "Why Nishaan?",
  points: [
    { title: "✔️ Premium Quality:", desc: "Every product is carefully selected so you receive the highest quality items and the best practical experience." },
    { title: "✔️ Integrity & Transparency:", desc: "We believe trust is the foundation of a successful relationship. We maintain transparency at every step through accurate product information, fair pricing, and reliable service." },
    { title: "✔️ Committed to Customer Service:", desc: "Your satisfaction is our top priority. Our support team is always ready to assist you quickly and sincerely whenever you need." },
  ],
  visionHeading: "Our Vision",
  vision: "Our vision is to establish Nishaan as a trusted and reliable brand in Bangladesh's e-commerce sector, where every customer can shop with peace of mind, safely, and at affordable prices. Your trust, love, and support are our greatest inspiration to move forward.",
};

function LangColumn({ t }) {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight="bold">{t.heading}</Typography>
      <Typography color="text.secondary"><strong>{t.tagline}</strong></Typography>
      <Typography textAlign="justify">{t.intro}</Typography>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.whyHeading}</Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        {t.points.map((p, i) => (
          <li key={i}>
            <Typography><strong>{p.title}</strong> {p.desc}</Typography>
          </li>
        ))}
      </Box>
      <Divider />
      <Typography variant="h5" fontWeight="bold">{t.visionHeading}</Typography>
      <Typography textAlign="justify">{t.vision}</Typography>
    </Stack>
  );
}

function AboutPage() {
  return (
    <>
      <MetaTags
        title="Nishaan - About Us | আমাদের সম্পর্কে"
        description="Learn more about Nishaan, our mission and vision."
        url="https://yoursite.com/about"
      />

      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 5 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }} sx={{ pr: { md: 4 } }}>
                <LangColumn t={bn} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }} sx={{ borderLeft: { md: "1px solid #e0e0e0" }, pl: { md: 4 } }}>
                <LangColumn t={en} />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default AboutPage;

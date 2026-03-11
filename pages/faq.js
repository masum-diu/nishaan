import React from "react";
import MetaTags from "../components/MetaTags";
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FAQPage() {
  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "Please browse through our products on the website, add your desired items to the cart, and complete the checkout process.",
    },
    {
      question: "How can I check my order status?",
      answer:
        'You can check your order status by visiting the "Order Status" section in your account or by following the tracking email sent to you.',
    },
    {
      question: "What are the payment options?",
      answer:
        "We accept credit/debit cards, cash on delivery (COD), and other digital payment methods.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery time depends on the product location and your area. Please refer to our shipping information for specific timelines.",
    },
    {
      question: "What is the product quality?",
      answer:
        "We ensure high-quality products. Detailed descriptions are available on the product page.",
    },
    {
      question: "How do I choose the right size or model?",
      answer:
        "Size charts are provided for clothing and shoes. Detailed specifications are available for electronics and toys. You can also contact our customer support for assistance.",
    },
  ];

  return (
    <>
      <MetaTags
        title="Nishaans - Frequently Asked Questions"
        description="Find answers to common questions about orders, delivery, payments and products."
        url="https://nishaans.com/faq"
      />

      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: 5 }}>
            <Stack spacing={3}>

              <Typography variant="h4" fontWeight="bold">
                Frequently Asked Questions (FAQ)
              </Typography>

              <Typography color="text.secondary">
                Here are some common questions customers ask about our products,
                orders, and delivery.
              </Typography>

              {faqs.map((faq, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">
                      {index + 1}. {faq.question}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}

            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default FAQPage;
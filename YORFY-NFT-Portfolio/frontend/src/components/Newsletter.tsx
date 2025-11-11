"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import { useState } from "react";

interface NewsletterProps {
  sx?: SxProps<Theme>;
}

export default function Newsletter({ sx }: NewsletterProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: { xs: "40px 20px", sm: "60px 32px", md: "80px 0" },
        ...sx,
      }}
    >
      {/* Newsletter Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: "40px 24px", sm: "60px 40px", md: "80px" },
          gap: { xs: "32px", md: "40px" },
          width: "100%",
          maxWidth: "1136px",
          bgcolor: "secondary.light",
          borderRadius: "16px",
        }}
      >
        {/* Heading Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px",
            gap: "16px",
            width: "100%",
            maxWidth: "752px",
          }}
        >
          {/* Newsletter Label */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "14px", sm: "16px" },
              lineHeight: { xs: "24px", sm: "32px" },
              textAlign: "center",
              color: "primary.light",
              alignSelf: "stretch",
            }}
          >
            Newsletter
          </Typography>

          {/* Main Heading */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "28px", sm: "36px", md: "40px" },
              lineHeight: { xs: "36px", sm: "48px", md: "56px" },
              textAlign: "center",
              alignSelf: "stretch",
            }}
          >
            You Do Not Want to Miss Out on this!
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: { xs: "14px", sm: "16px" },
              lineHeight: { xs: "24px", sm: "32px" },
              textAlign: "center",
              color: "text.secondary",
              alignSelf: "stretch",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "flex-start",
            padding: "0px",
            gap: "16px",
            width: "100%",
            maxWidth: "635px",
          }}
        >
          <TextField
            type="email"
            label="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              width: { xs: "100%", sm: "480px" },
              height: "48px",
              "& .MuiInputLabel-root": {
                color: "text.primary",
                transform: "translate(14px, 12px) scale(1)", // center label when not focused
                "&.Mui-focused, &.MuiFormLabel-filled": {
                  color: "text.primary", // keep label white when focused/filled (override browser/UA styles)
                  transform: {
                    xs: "translate(11px, -8px) scale(0.75)",
                    sm: "translate(14px, -8px) scale(0.75)",
                  }, // float on focus
                  // increased horizontal padding for xs
                },
              },
              "& .MuiOutlinedInput-root": {
                height: "48px",
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: "32px",
                borderRadius: "8px",
                "& fieldset": {
                  border: "1px solid",
                  borderColor: "text.primary",
                },
                "&:hover fieldset": {
                  border: "1px solid",
                  borderColor: "text.primary",
                },
                "&.Mui-focused fieldset": {
                  border: "1px solid",
                  borderColor: "text.primary",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "0 14px",
                "&::placeholder": {
                  color: "text.secondary",
                  opacity: 1,
                },
              },
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: { xs: "8px 32px", sm: "8px 40px" },
              gap: "8px",
              width: { xs: "100%", sm: "139px" },
              height: "48px",
              bgcolor: "primary.main",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: { xs: "14px", sm: "16px" },
              lineHeight: "32px",
              textTransform: "none",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

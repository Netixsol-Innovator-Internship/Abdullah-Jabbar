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
        padding: "80px 0",
        ...sx,
      }}
    >
      {/* Newsletter Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "80px",
          gap: "40px",
          width: "1136px",
          background: "#081956", // Primary/Dark Blue
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
            width: "752px",
          }}
        >
          {/* Newsletter Label */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: "32px",
              textAlign: "center",
              color: "#5699FF", // Accent/Cyan
              alignSelf: "stretch",
            }}
          >
            Newsletter
          </Typography>

          {/* Main Heading */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: "56px",
              textAlign: "center",
              color: "#FFFFFF",
              alignSelf: "stretch",
            }}
          >
            You Do Not Want to Miss Out on this!
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "32px",
              textAlign: "center",
              color: "#EBEBEB", // Text/Disable
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
            flexDirection: "row",
            alignItems: "flex-start",
            padding: "0px",
            gap: "16px",
            width: "635px",
            height: "48px",
          }}
        >
          {/* Input Field */}
          <TextField
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              width: "480px",
              height: "48px",
              "& .MuiOutlinedInput-root": {
                height: "48px",
                padding: "8px 16px",
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#FFFFFF",
                border: "1px solid #FFFFFF",
                borderRadius: "8px",
                "& fieldset": {
                  border: "1px solid #FFFFFF",
                },
                "&:hover fieldset": {
                  border: "1px solid #FFFFFF",
                },
                "&.Mui-focused fieldset": {
                  border: "1px solid #FFFFFF",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: 0,
                color: "#FFFFFF",
                "&::placeholder": {
                  color: "#EBEBEB",
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
              padding: "8px 40px",
              gap: "8px",
              width: "139px",
              height: "48px",
              background: "#1E50FF", // Primary/Blue
              borderRadius: "8px",
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "32px",
              color: "#FFFFFF",
              textTransform: "none",
              "&:hover": {
                background: "#1640CC",
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

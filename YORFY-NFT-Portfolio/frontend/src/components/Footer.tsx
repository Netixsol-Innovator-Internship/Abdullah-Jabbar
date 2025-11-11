"use client";

import React from "react";
import { Box, Typography, Divider, ButtonBase } from "@mui/material";
import Image from "next/image";

export default function Footer() {
  const handleSocialClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.currentTarget;

    // Add active state
    target.style.transform = "scale(0.95)";

    // Reset after animation
    setTimeout(() => {
      target.style.transform = "scale(1)";
    }, 300);
  };

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: { xs: "32px 20px", sm: "36px 32px", md: "40px 72px" },
        gap: { xs: "20px", md: "24px" },
        width: "100%",
        maxWidth: "1280px",
        minHeight: { xs: "auto", md: "200px" },
        backgroundColor: "secondary.main",
        margin: "0 auto",
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          justifyContent: { xs: "center", sm: "space-between" },
          padding: "0px",
          gap: { xs: "20px", sm: "16px" },
          width: "100%",
          maxWidth: "1136px",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            padding: "0px",
            gap: "8px",
            flex: { xs: "none", sm: "1 1 auto" },
            height: { xs: "32px", md: "40px" },
          }}
        >
          <Image
            src="/Logo.svg"
            alt="YORFY Logo"
            width={128}
            height={40}
            style={{ width: "auto", height: "100%", maxWidth: "128px" }}
          />
        </Box>

        {/* Social Media */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            padding: "0px",
            gap: { xs: "12px", sm: "16px" },
            height: "40px",
          }}
        >
          {/* Facebook */}
          <ButtonBase
            onClick={handleSocialClick}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              border: "1px solid",
              borderColor: "text.primary",
              borderRadius: "64px",
              padding: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "24px",
                textAlign: "center",
              }}
            >
              Fb
            </Typography>
          </ButtonBase>

          {/* Instagram */}
          <ButtonBase
            onClick={handleSocialClick}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              border: "1px solid",
              borderColor: "text.primary",
              borderRadius: "64px",
              padding: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "24px",
                textAlign: "center",
              }}
            >
              Ig
            </Typography>
          </ButtonBase>

          {/* LinkedIn */}
          <ButtonBase
            onClick={handleSocialClick}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              border: "1px solid",
              borderColor: "text.primary",
              borderRadius: "64px",
              padding: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "24px",
                textAlign: "center",
              }}
            >
              Li
            </Typography>
          </ButtonBase>

          {/* YouTube */}
          <ButtonBase
            onClick={handleSocialClick}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              border: "1px solid",
              borderColor: "text.primary",
              borderRadius: "64px",
              padding: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "24px",
                textAlign: "center",
              }}
            >
              Yt
            </Typography>
          </ButtonBase>
        </Box>
      </Box>

      {/* Divider */}
      <Divider
        sx={{
          width: "100%",
          maxWidth: "1136px",
          borderColor: "primary.main",
          borderWidth: "1px",
        }}
      />

      {/* Copyright Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: { xs: "center", sm: "space-between" },
          alignItems: { xs: "center", sm: "flex-start" },
          padding: "0px",
          gap: { xs: "12px", sm: "0" },
          width: "100%",
          maxWidth: "1136px",
        }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: { xs: "14px", sm: "16px" },
            lineHeight: { xs: "24px", sm: "32px" },
            color: "text.secondary",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          © 2025 Yorfy Template • All Rights Reserved
        </Typography>

        <Typography
          sx={{
            fontWeight: 400,
            fontSize: { xs: "14px", sm: "16px" },
            lineHeight: { xs: "24px", sm: "32px" },
            color: "text.secondary",
            textAlign: { xs: "center", sm: "right" },
          }}
        >
          Made with Love by Abdullah Jabbar
        </Typography>
      </Box>
    </Box>
  );
}

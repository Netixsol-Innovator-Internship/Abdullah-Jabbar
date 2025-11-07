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
        padding: "40px 72px",
        gap: "24px",
        width: "100%",
        maxWidth: "1280px",
        minHeight: "200px",
        backgroundColor: "#051139",
        margin: "0 auto",
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: "0px",
          gap: "16px",
          width: "100%",
          maxWidth: "1136px",
          height: "40px",
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
            flex: "1 1 auto",
            height: "40px",
          }}
        >
          <Image
            src="/Logo.svg"
            alt="YORFY Logo"
            width={128}
            height={40}
            style={{ width: "128px", height: "40px" }}
          />
        </Box>

        {/* Social Media */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            padding: "0px",
            gap: "16px",
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
              border: "1px solid #FFFFFF",
              borderRadius: "64px",
              padding: "8px",
              color: "#FFFFFF",
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
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#FFFFFF",
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
              border: "1px solid #FFFFFF",
              borderRadius: "64px",
              padding: "8px",
              color: "#FFFFFF",
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
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#FFFFFF",
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
              border: "1px solid #FFFFFF",
              borderRadius: "64px",
              padding: "8px",
              color: "#FFFFFF",
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
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#FFFFFF",
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
              border: "1px solid #FFFFFF",
              borderRadius: "64px",
              padding: "8px",
              color: "#FFFFFF",
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
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#FFFFFF",
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
          borderColor: "#1E50FF",
          borderWidth: "1px",
        }}
      />

      {/* Copyright Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "0px",
          width: "100%",
          maxWidth: "1136px",
          height: "32px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "32px",
            color: "#EBEBEB",
          }}
        >
          © 2025 Yorfy Template • All Rights Reserved
        </Typography>

        <Typography
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "32px",
            color: "#EBEBEB",
          }}
        >
          Made With Love by Abdullah Jabbar
        </Typography>
      </Box>
    </Box>
  );
}

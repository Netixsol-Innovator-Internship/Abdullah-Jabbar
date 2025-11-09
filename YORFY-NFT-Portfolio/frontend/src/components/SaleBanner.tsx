"use client";

import { Box, Typography, SxProps, Theme } from "@mui/material";

interface SaleBannerProps {
  sx?: SxProps<Theme>;
}

export default function SaleBanner({ sx }: SaleBannerProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: "16px 20px", sm: "20px 32px", md: "24px 92px" },

        gap: { xs: "8%", sm: "5%", md: "1.5%" },
        width: "100%",
        maxWidth: "1280px",
        minHeight: { xs: "64px", sm: "80px", md: "96px" },
        background: "#AA00FF",
        overflow: "hidden",
        ...sx,
      }}
    >
      {/* Discount Sale - First */}
      <Typography
        sx={{
          width: { xs: "auto", md: "272px" },
          fontFamily: "Poppins",
          fontWeight: 700,
          fontSize: { xs: "18px", sm: "24px", md: "32px" },
          lineHeight: { xs: "28px", sm: "36px", md: "48px" },
          textAlign: "center",
          color: "#FFFFFF",
          flex: { xs: "none", md: "none" },
          order: 0,
          flexGrow: { xs: 0, md: 0, lg: 1 },
          whiteSpace: { xs: "nowrap", md: "normal" },
        }}
      >
        Discount Sale
      </Typography>

      {/* Up to 40% - First */}
      <Typography
        sx={{
          width: { xs: "auto", md: "272px" },
          fontFamily: "Poppins",
          fontWeight: 700,
          fontSize: { xs: "18px", sm: "24px", md: "32px" },
          lineHeight: { xs: "28px", sm: "36px", md: "48px" },
          textAlign: "center",
          color: "transparent",
          WebkitTextStroke: { xs: "0.8px #FFFFFF", md: "1.2px #FFFFFF" },
          textStroke: { xs: "0.8px #FFFFFF", md: "2px #FFFFFF" },
          flex: { xs: "none", md: "none" },
          order: 1,
          flexGrow: { xs: 0, md: 0, lg: 1 },
          whiteSpace: { xs: "nowrap", md: "normal" },
        }}
      >
        Up to 40%
      </Typography>

      {/* Discount Sale - Second */}
      <Typography
        sx={{
          display: { xs: "none", sm: "block" },
          width: { xs: "auto", md: "272px" },
          fontFamily: "Poppins",
          fontWeight: 700,
          fontSize: { xs: "18px", sm: "24px", md: "32px" },
          lineHeight: { xs: "28px", sm: "36px", md: "48px" },
          textAlign: "center",
          color: "#FFFFFF",
          flex: { xs: "none", md: "none" },
          order: 2,
          flexGrow: { xs: 0, md: 0, lg: 1 },
          whiteSpace: { xs: "nowrap", md: "normal" },
        }}
      >
        Discount Sale
      </Typography>

      {/* Up to 40% - Second */}
      <Typography
        sx={{
          display: { xs: "none", md: "block" },
          width: "272px",
          fontFamily: "Poppins",
          fontWeight: 700,
          fontSize: "32px",
          lineHeight: "48px",
          textAlign: "center",
          color: "transparent",
          WebkitTextStroke: "1.2px #FFFFFF",
          textStroke: "2px #FFFFFF",
          flex: "none",
          order: 3,
          flexGrow: { md: 0, lg: 1 },
        }}
      >
        Up to 40%
      </Typography>
    </Box>
  );
}

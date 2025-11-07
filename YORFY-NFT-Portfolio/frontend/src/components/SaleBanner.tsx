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
        padding: "24px 72px",
        gap: "16px",
        width: "100%",
        maxWidth: "1280px",
        height: "96px",
        background: "#AA00FF",
        ...sx,
      }}
    >
      {/* Discount Sale - First */}
      <Typography
        sx={{
          width: "272px",
          height: "48px",
          fontFamily: "Poppins",
          fontWeight: 700,
          fontSize: "32px",
          lineHeight: "48px",
          textAlign: "center",
          color: "#FFFFFF",
          flex: "none",
          order: 0,
          flexGrow: 1,
        }}
      >
        Discount Sale
      </Typography>

      {/* Up to 40% - First */}
      <Typography
        sx={{
          width: "272px",
          height: "48px",
          fontFamily: "Poppins",
          fontWeight: 700,
          fontSize: "32px",
          lineHeight: "48px",
          textAlign: "center",
          color: "transparent",
          WebkitTextStroke: "1.2px #FFFFFF",
          textStroke: "2px #FFFFFF",
          flex: "none",
          order: 1,
          flexGrow: 1,
        }}
      >
        Up to 40%
      </Typography>

      {/* Discount Sale - Second */}
      <Typography
        sx={{
          width: "272px",
          height: "48px",
          fontFamily: "Poppins",
          fontWeight: 700,
          fontSize: "32px",
          lineHeight: "48px",
          textAlign: "center",
          color: "#FFFFFF",
          flex: "none",
          order: 2,
          flexGrow: 1,
        }}
      >
        Discount Sale
      </Typography>

      {/* Up to 40% - Second */}
      <Typography
        sx={{
          width: "272px",
          height: "48px",
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
          flexGrow: 1,
        }}
      >
        Up to 40%
      </Typography>
    </Box>
  );
}

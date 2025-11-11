"use client";

import { Box, Typography, SxProps, Theme } from "@mui/material";

interface SaleBannerProps {
  sx?: SxProps<Theme>;
}

export default function SaleBanner({ sx }: SaleBannerProps) {
  return (
    <Box
      sx={{
        width: "100vw",
        marginLeft: "50%",
        transform: "translateX(-50%)",
        bgcolor: "custom.purple",
        overflow: "hidden",
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "16px 40px", sm: "20px 60px", md: "24px 115px" },
          gap: { xs: "10%", sm: "12%", md: "1%" },
          maxWidth: { xs: "100%", lg: "1280px" },
          minHeight: { xs: "64px", sm: "80px", md: "96px" },
          margin: "0 auto",
        }}
      >
        {/* Discount Sale - First */}
        <Typography
          sx={{
            width: { xs: "auto", md: "272px" },
            fontWeight: 700,
            fontSize: { xs: "18px", sm: "24px", md: "32px" },
            lineHeight: { xs: "28px", sm: "36px", md: "48px" },
            textAlign: "center",
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
            fontWeight: 700,
            fontSize: { xs: "18px", sm: "24px", md: "32px" },
            lineHeight: { xs: "28px", sm: "36px", md: "48px" },
            textAlign: "center",
            color: "transparent",
            WebkitTextStroke: (theme) => ({
              xs: `0.8px ${theme.palette.text.primary}`,
              md: `1.2px ${theme.palette.text.primary}`,
            }),
            textStroke: (theme) => ({
              xs: `0.8px ${theme.palette.text.primary}`,
              md: `2px ${theme.palette.text.primary}`,
            }),
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
            display: { xs: "none", sm: "block", md: "block" },
            width: { xs: "auto", md: "272px" },
            fontWeight: 700,
            fontSize: { xs: "18px", sm: "24px", md: "32px" },
            lineHeight: { xs: "28px", sm: "36px", md: "48px" },
            textAlign: "center",
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
            display: { xs: "none", lg: "block" },
            width: "272px",
            fontWeight: 700,
            fontSize: "32px",
            lineHeight: "48px",
            textAlign: "center",
            color: "transparent",
            WebkitTextStroke: (theme) => `1.2px ${theme.palette.text.primary}`,
            textStroke: (theme) => `2px ${theme.palette.text.primary}`,
            flex: "none",
            order: 3,
            flexGrow: { md: 0, lg: 1 },
          }}
        >
          Up to 40%
        </Typography>
      </Box>
    </Box>
  );
}

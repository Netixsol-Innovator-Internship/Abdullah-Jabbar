"use client";

import { Box, Typography, SxProps, Theme } from "@mui/material";

interface SaleBannerProps {
  sx?: SxProps<Theme>;
}

export default function SaleBanner({ sx }: SaleBannerProps) {
  return (
    <Box    
      className="w-screen ml-[50%] -translate-x-1/2 transform overflow-hidden"
      sx={{ bgcolor: "custom.purple", ...sx }}
    >
      <Box
        className="flex flex-row justify-center items-center max-w-7xl mx-auto 
            gap-8 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24
            px-5 sm:px-8 md:px-14 lg:px-20
            py-4 sm:py-5 md:py-6 
            min-h-16 sm:min-h-20 md:min-h-24"
      >
        {/* Discount Sale - First */}
        <Typography
          className="flex-none whitespace-nowrap md:whitespace-normal"
          sx={{
            color: "text.primary",
            fontFamily: "Poppins, Arial, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "18px", sm: "24px", md: "32px" },
            lineHeight: { xs: "28px", sm: "36px", md: "48px" },
            textAlign: "center",
            order: 0,
          }}
        >
          Discount Sale
        </Typography>

        {/* Up to 40% - First */}
        <Typography
          className="flex-none whitespace-nowrap md:whitespace-normal"
          sx={{
            fontFamily: "Poppins, Arial, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "18px", sm: "24px", md: "32px" },
            lineHeight: { xs: "28px", sm: "36px", md: "48px" },
            textAlign: "center",
            color: "transparent",
            order: 1,
            WebkitTextStroke: (theme) => ({
              xs: `0.8px ${theme.palette.text.primary}`,
              md: `1.2px ${theme.palette.text.primary}`,
            }),
            textStroke: (theme) => ({
              xs: `0.8px ${theme.palette.text.primary}`,
              md: `2px ${theme.palette.text.primary}`,
            }),
          }}
        >
          Up to 40%
        </Typography>

        {/* Discount Sale - Second */}
        <Typography
          className="flex-none whitespace-nowrap md:whitespace-normal"
          sx={{
            display: { xs: "none", sm: "block", md: "block" },
            color: "text.primary",
            fontFamily: "Poppins, Arial, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "18px", sm: "24px", md: "32px" },
            lineHeight: { xs: "28px", sm: "36px", md: "48px" },
            textAlign: "center",
            order: 2,
          }}
        >
          Discount Sale
        </Typography>

        {/* Up to 40% - Second */}
        <Typography
          className="flex-none"
          sx={{
            display: { xs: "none", lg: "block" },
            fontFamily: "Poppins, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "32px",
            lineHeight: "48px",
            textAlign: "center",
            color: "transparent",
            order: 3,
            WebkitTextStroke: (theme) => `1.2px ${theme.palette.text.primary}`,
            textStroke: (theme) => `2px ${theme.palette.text.primary}`,
          }}
        >
          Up to 40%
        </Typography>
      </Box>
    </Box>
  );
}
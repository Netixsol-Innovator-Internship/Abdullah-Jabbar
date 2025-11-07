"use client";

import {
  Box,
  Typography,
  Button,
  Container,
  SxProps,
  Theme,
} from "@mui/material";
import Image from "next/image";

interface HighlightProps {
  sx?: SxProps<Theme>;
}

export default function Highlight({ sx }: HighlightProps) {
  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px",
        gap: "40px",
        maxWidth: "1280px",
        margin: "0 auto",
        px: { xs: 2, sm: 3, md: 4 },
        ...sx,
      }}
    >
      {/* Heading Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          width: "100%",
          maxWidth: "752px",
        }}
      >
        {/* Featured */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "32px",
            textAlign: "center",
            color: "#5699FF",
            width: "100%",
          }}
        >
          Featured
        </Typography>

        {/* Main Heading */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            fontSize: { xs: "32px", sm: "40px", md: "56px" },
            lineHeight: { xs: "40px", sm: "56px", md: "72px" },
            textAlign: "center",
            color: "#FFFFFF",
            width: "100%",
          }}
        >
          Hot Trending On This Week from Yorfy
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "32px",
            textAlign: "center",
            color: "#EBEBEB",
            width: "100%",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
      </Box>

      {/* Highlight NFT Card */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "24px", sm: "32px", md: "40px" },
          gap: "40px",
          width: "100%",
          maxWidth: "1136px",
          background: "#081956",
          borderRadius: "16px",
        }}
      >
        {/* Left Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            width: { xs: "100%", md: "272px" },
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: "80px",
              height: "80px",
              position: "relative",
            }}
          >
            {/* Gradient Background Container */}
            <Box
              sx={{
                position: "absolute",
                width: "80px",
                height: "80px",
                background: "linear-gradient(180deg, #1E50FF 0%, #5699FF 100%)",
                borderRadius: "50%",
                top: 0,
                left: 0,
              }}
            />
            {/* Logo Image */}
            <Box
              sx={{
                position: "relative",
                width: "80px",
                height: "80px",
                zIndex: 1,
              }}
            >
              <Image
                src="/yorfy.svg"
                alt="Yorfy Logo"
                width={80}
                height={80}
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: "Poppins",
              fontWeight: 700,
              fontSize: { xs: "28px", sm: "32px", md: "40px" },
              lineHeight: { xs: "40px", sm: "48px", md: "56px" },
              textAlign: "center",
              color: "#FFFFFF",
              width: "100%",
            }}
          >
            YorEyes #234
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "32px",
              textAlign: "center",
              color: "#EBEBEB",
              width: "100%",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
        </Box>

        {/* Center Image */}
        <Box
          sx={{
            width: { xs: "100%", sm: "350px", md: "400px" },
            height: { xs: "auto", sm: "350px", md: "400px" },
            position: "relative",
            aspectRatio: "1/1",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Image
            src="/featured.png"
            alt="Featured NFT"
            fill
            style={{ objectFit: "cover", borderRadius: "8px" }}
            priority
          />
        </Box>

        {/* Right Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            width: { xs: "100%", md: "272px" },
          }}
        >
          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              fontFamily: "Poppins",
              fontWeight: 700,
              fontSize: { xs: "28px", sm: "32px", md: "40px" },
              lineHeight: { xs: "40px", sm: "48px", md: "56px" },
              textAlign: "center",
              color: "#FFFFFF",
              width: "100%",
            }}
          >
            Interesting with This Item?
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "32px",
              textAlign: "center",
              color: "#EBEBEB",
              width: "100%",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>

          {/* Button */}
          <Button
            variant="contained"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 40px",
              gap: "8px",
              width: "214px",
              height: "48px",
              background: "#1E50FF",
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
            Buy on Opensea
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

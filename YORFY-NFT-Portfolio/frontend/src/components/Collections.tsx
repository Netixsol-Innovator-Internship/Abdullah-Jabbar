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

interface NFTCardProps {
  image: string;
  title: string;
}

function NFTCard({ image, title }: NFTCardProps) {
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: { xs: "20px", sm: "24px" },
        gap: { xs: "20px", sm: "24px" },
        width: { xs: "100%", sm: "100%", md: "368px" },
        maxWidth: { xs: "100%", sm: "400px", md: "368px" },
        minHeight: { xs: "auto", md: "432px" },
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: "8px",
        margin: { xs: "0 auto", md: "0" },
      }}
    >
      {/* NFT Image */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1/1",
          maxWidth: { xs: "100%", sm: "320px" },
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      </Box>

      {/* Item Name */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: { xs: "12px", sm: "16px" },
          width: "100%",
          minHeight: { xs: "auto", md: "40px" },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: { xs: "32px", sm: "40px" },
            height: { xs: "32px", sm: "40px" },
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Gradient Background Container */}
          <Box
            sx={{
              position: "absolute",
              width: { xs: "32px", sm: "40px" },
              height: { xs: "32px", sm: "40px" },
              background: (theme) =>
                `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              borderRadius: "50%",
              top: 0,
              left: 0,
            }}
          />
          {/* Logo Image */}
          <Box
            sx={{
              position: "relative",
              width: { xs: "32px", sm: "40px" },
              height: { xs: "32px", sm: "40px" },
              zIndex: 1,
            }}
          >
            <Image
              src="/yorfy.svg"
              alt="Yorfy Logo"
              width={40}
              height={40}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "18px", sm: "20px", md: "24px" },
            lineHeight: { xs: "28px", sm: "32px", md: "40px" },
            flexGrow: 1,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
}

interface CollectionsProps {
  sx?: SxProps<Theme>;
}

export default function Collections({ sx }: CollectionsProps) {
  const nftItems = [
    { image: "/collection1.png", title: "YorNoose #432" },
    { image: "/collection2.png", title: "YorHayr #332" },
    { image: "/collection3.png", title: "YorMwoth #765" },
  ];

  return (
    <Container
      maxWidth={false}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px",
        gap: "40px",
        maxWidth: "1280px",
        margin: "0 auto",
        px: { xs: 2, sm: 3, md: 4 },
        overflow: "visible",
        ...sx,
      }}
    >
      {/* Decorative Blur Circle 1 - Left Blue */}
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          left: { xs: "-200px", md: "-99px" },
          top: { sm: "50%", md: "128px" },
          bottom: { xs: 0 },
          bgcolor: "primary.main",
          opacity: 0.5,
          filter: "blur(120px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Decorative Blur Circle 2 - Right Purple */}
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          left: { xs: "calc(100% - 200px)", md: "calc(100% + 99px - 400px)" },
          top: { xs: "150px", md: "232px" },
          bgcolor: "custom.purple",
          opacity: 0.5,
          filter: "blur(120px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Heading Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          width: "100%",
          maxWidth: "752px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Collection Label */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "32px",
            textAlign: "center",
            color: "primary.light",
            width: "100%",
          }}
        >
          Collection
        </Typography>

        {/* Main Heading */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "32px", sm: "40px", md: "56px" },
            lineHeight: { xs: "40px", sm: "56px", md: "72px" },
            textAlign: "center",
            width: "100%",
          }}
        >
          Yorfy NFT Collections
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "32px",
            textAlign: "center",
            color: "text.secondary",
            width: "100%",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography>
      </Box>

      {/* NFT Cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          padding: "0px",
          gap: "16px",
          width: "100%",
          maxWidth: "1136px",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {nftItems.map((item, index) => (
          <NFTCard key={index} image={item.image} title={item.title} />
        ))}
      </Box>

      {/* View Collection Button */}
      <Button
        variant="outlined"
        sx={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 35px",
          gap: "8px",
          width: "222px",
          height: "48px",
          border: "1px solid",
          borderColor: "text.primary",
          color: "text.primary",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "32px",
          textTransform: "none",
          position: "relative",
          zIndex: 1,
          "&:hover": {
            borderColor: "primary.light",
            backgroundColor: "rgba(86, 153, 255, 0.1)",
          },
        }}
      >
        View on Opensea
      </Button>
    </Container>
  );
}

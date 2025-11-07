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
        padding: "24px",
        gap: "24px",
        width: { xs: "100%", sm: "368px" },
        maxWidth: "368px",
        height: "432px",
        border: "1px solid #1E50FF",
        borderRadius: "8px",
      }}
    >
      {/* NFT Image */}
      <Box
        sx={{
          width: "320px",
          height: "320px",
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
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
          gap: "16px",
          width: "320px",
          height: "40px",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            width: "40px",
            height: "40px",
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Gradient Background Container */}
          <Box
            sx={{
              position: "absolute",
              width: "40px",
              height: "40px",
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
              width: "40px",
              height: "40px",
              zIndex: 1,
            }}
          >
            <Image
              src="/yorfy.svg"
              alt="Yorfy Logo"
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: "40px",
            color: "#FFFFFF",
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
          top: { xs: "50px", md: "128px" },
          background: "#1E50FF",
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
          background: "#AA00FF",
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
            fontFamily: "Poppins",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "32px",
            textAlign: "center",
            color: "#5699FF",
            width: "100%",
          }}
        >
          Collection
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
          Yorfy NFT Collections
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
          border: "1px solid #FFFFFF",
          borderRadius: "8px",
          fontFamily: "Poppins",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "32px",
          color: "#FFFFFF",
          textTransform: "none",
          position: "relative",
          zIndex: 1,
          "&:hover": {
            border: "1px solid #5699FF",
            backgroundColor: "rgba(86, 153, 255, 0.1)",
          },
        }}
      >
        View on Opensea
      </Button>
    </Container>
  );
}

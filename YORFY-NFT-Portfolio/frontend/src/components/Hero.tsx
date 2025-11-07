"use client";

import { Box, Button, Typography, Divider } from "@mui/material";
import Image from "next/image";

export default function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "624px", // 496px hero + 128px top offset
        // overflow: "hidden", // Changed from visible to hidden to prevent overflow
      }}
    >
      {/* Hero Container - matches Figma absolute positioning */}
      <Box
        sx={{
          position: "absolute",
          width: "1280px",
          height: "496px",
          left: "50%",
          transform: "translateX(-50%)",
          top: "128px",
        }}
      >
        {/* Background */}
        <Box
          sx={{
            position: "absolute",
            width: "1280px",
            height: "464px",
            left: "0px",
            top: "32px", // 160px - 128px (hero top)
          }}
        />

        {/* Blur - Left (Blue with opacity) */}
        <Box
          sx={{
            position: "absolute",
            width: "400px",
            height: "400px",
            left: "-160px",
            top: "96px", // 224px - 128px
            background: "#1E50FF",
            opacity: 0.5,
            filter: "blur(120px)",
            zIndex: 0,
          }}
        />

        {/* Blur - Center (Purple) */}
        <Box
          sx={{
            position: "absolute",
            width: "320px",
            height: "320px",
            left: "640px",
            top: "32px", // 160px - 128px
            background: "#AA00FF",
            filter: "blur(120px)",
            zIndex: 0,
          }}
        />

        {/* Blur - Right (Blue) */}
        <Box
          sx={{
            position: "absolute",
            width: "400px",
            height: "400px",
            left: "880px", // Changed from 960px to prevent overflow
            top: "96px", // 224px - 128px
            background: "#1E50FF",
            filter: "blur(120px)",
            zIndex: 0,
          }}
        />

        {/* Right Column - Text Content */}
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px",
            gap: "40px",
            width: "560px",
            height: "496px",
            left: "72px",
            top: "0px",
            zIndex: 1,
          }}
        >
          {/* Heading */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "0px",
              gap: "16px",
              width: "560px",
              height: "368px",
            }}
          >
            <Typography
              sx={{
                width: "560px",
                height: "32px",
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#5699FF",
              }}
            >
              Welcome to Yorfy
            </Typography>

            <Typography
              sx={{
                width: "560px",
                height: "240px",
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: "64px",
                lineHeight: "80px",
                color: "#FFFFFF",
              }}
            >
              Now Available, Meet Yorfy NFT Collection ⭐️
            </Typography>

            <Typography
              sx={{
                width: "560px",
                height: "64px",
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "32px",
                color: "#EBEBEB",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Box>

          {/* Milestone */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              padding: "0px",
              gap: "40px",
              width: "560px",
              height: "88px",
            }}
          >
            {/* Number - NFT Items */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0px",
                width: "79px",
                height: "88px",
              }}
            >
              <Typography
                sx={{
                  width: "79px",
                  height: "56px",
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "40px",
                  lineHeight: "56px",
                  color: "#FFFFFF",
                }}
              >
                546
              </Typography>
              <Typography
                sx={{
                  width: "77px",
                  height: "32px",
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "32px",
                  color: "#EBEBEB",
                }}
              >
                NFT Items
              </Typography>
            </Box>

            {/* Divider */}
            <Divider
              orientation="vertical"
              sx={{
                width: "0px",
                height: "80px",
                border: "1px solid #EBEBEB",
              }}
            />

            {/* Number - Owners */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0px",
                width: "61px",
                height: "88px",
              }}
            >
              <Typography
                sx={{
                  width: "50px",
                  height: "56px",
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "40px",
                  lineHeight: "56px",
                  color: "#FFFFFF",
                }}
              >
                42
              </Typography>
              <Typography
                sx={{
                  width: "61px",
                  height: "32px",
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "32px",
                  color: "#EBEBEB",
                }}
              >
                Owners
              </Typography>
            </Box>

            {/* Divider */}
            <Divider
              orientation="vertical"
              sx={{
                width: "0px",
                height: "80px",
                border: "1px solid #EBEBEB",
              }}
            />

            {/* Number - Items Sold */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0px",
                width: "84px",
                height: "88px",
              }}
            >
              <Typography
                sx={{
                  width: "72px",
                  height: "56px",
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "40px",
                  lineHeight: "56px",
                  color: "#FFFFFF",
                }}
              >
                378
              </Typography>
              <Typography
                sx={{
                  width: "84px",
                  height: "32px",
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "32px",
                  color: "#EBEBEB",
                }}
              >
                Items Sold
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Left Column - Image Card */}
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: "120px 40px 40px",
            gap: "16px",
            isolation: "isolate",
            width: "480px",
            height: "208px",
            left: "728px",
            top: "288px", // 416px - 128px
            background: "rgba(255, 255, 255, 0.1)",
            border: "2px solid #1E50FF",
            backdropFilter: "blur(40px)",
            borderRadius: "8px",
            zIndex: 1,
          }}
        >
          {/* Image - six faces */}
          <Box
            sx={{
              position: "absolute",
              width: "403px",
              height: "368px",
              left: "38.5px",
              top: "-288px",
              borderRadius: "8px",
              overflow: "hidden",
              zIndex: 2,
            }}
          >
            <Image
              src="/hero.png"
              alt="Yorfy NFT Collection"
              width={403}
              height={368}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              priority
            />
          </Box>

          {/* Button - Explore Now */}
          <Button
            variant="contained"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 35px",
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
              zIndex: 0,
              "&:hover": {
                background: "#1640CC",
              },
            }}
          >
            Buy on Opensea
          </Button>

          {/* Button - See Pricing */}
          <Button
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 35px",
              gap: "8px",
              width: "170px",
              height: "48px",
              border: "1px solid #FFFFFF",
              borderRadius: "8px",
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "32px",
              color: "#FFFFFF",
              textTransform: "none",
              zIndex: 1,
              "&:hover": {
                border: "1px solid #FFFFFF",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Know More
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

"use client";

import { Box, Button, Typography, Divider } from "@mui/material";
import Image from "next/image";

export default function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "auto", md: "624px" },
        height: { xs: "auto", md: "624px" },
        padding: { xs: "80px 20px 40px", sm: "100px 32px 60px", md: "0" },
      }}
    >
      {/* Hero Container - matches Figma absolute positioning */}
      <Box
        sx={{
          position: { xs: "relative", md: "absolute" },
          width: { xs: "100%", md: "100%", lg: "1280px" },
          maxWidth: { xs: "100%", md: "calc(100% - 32px)", lg: "1280px" },
          minHeight: { xs: "auto", md: "496px" },
          left: { xs: "0", md: "16px", lg: "50%" },
          transform: { xs: "none", md: "none", lg: "translateX(-50%)" },
          top: { xs: "0", md: "128px" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: "0", md: "0" },
        }}
      >
        {/* Background */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "100%", sm: "100%", md: "100%", lg: "1280px" },
            height: { xs: "100%", sm: "100%", md: "464px" },
            left: "0px",
            top: { xs: "0px", sm: "0px", md: "32px" },
            display: { xs: "block", md: "block" },
          }}
        />

        {/* Blur - Left (Blue with opacity) */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "200px", sm: "300px", md: "400px" },
            height: { xs: "200px", sm: "300px", md: "400px" },
            left: { xs: "-80px", sm: "-120px", md: "-160px" },
            top: { xs: "20px", sm: "40px", md: "96px" },
            background: "#1E50FF",
            opacity: 1.5,
            filter: "blur(200px)",
            zIndex: 0,
          }}
        />

        {/* Blur - Center (Purple) */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "180px", sm: "250px", md: "320px" },
            height: { xs: "180px", sm: "250px", md: "320px" },
            left: { xs: "15%", md: "640px" },
            transform: {
              xs: "translateX(-50%)",
              sm: "translateX(-50%)",
              md: "none",
            },
            top: { xs: "430px", sm: "490px", md: "32px" },
            background: "#AA00FF",
            borderRadius: "50%",
            filter: "blur(120px)",
            zIndex: 0,
          }}
        />

        {/* Blur - Right (Blue) */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: "200px", sm: "300px", md: "400px" },
            height: { xs: "200px", sm: "300px", md: "400px" },
            left: { xs: "auto", sm: "auto", md: "960px" },
            right: { xs: "-80px", sm: "-120px", md: "auto" },
            top: { xs: "250px", sm: "300px", md: "96px" },
            background: "#1E50FF",
            filter: "blur(120px)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        {/* Left Column - Text Content */}
        <Box
          sx={{
            position: { xs: "relative", md: "absolute" },
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px",
            gap: { xs: "24px", md: "clamp(32px, 3vw, 40px)", lg: "40px" },
            width: {
              xs: "100%",
              md: "clamp(50%, 46vw, 560px)",
              lg: "560px",
            },
            minHeight: { xs: "auto", md: "496px" },
            left: { xs: "0", md: "8px", lg: "72px" },
            top: { xs: "0", md: "0px" },
            zIndex: 1,
            order: { xs: 1, md: 1 },
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
              width: "100%",
              minHeight: { xs: "auto", md: "368px" },
            }}
          >
            <Typography
              sx={{
                width: "100%",
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: { xs: "24px", sm: "32px" },
                color: "#5699FF",
              }}
            >
              Welcome to Yorfy
            </Typography>

            <Typography
              sx={{
                width: { xs: "100%", md: "95%" },
                fontFamily: "Poppins",
                fontWeight: 700,
                fontSize: { xs: "32px", sm: "48px", md: "56px", lg: "64px" },
                lineHeight: { xs: "40px", sm: "60px", md: "62px", lg: "80px" },
                color: "#FFFFFF",
              }}
            >
              Now Available, Meet Yorfy NFT Collection ⭐️
            </Typography>

            <Typography
              sx={{
                width: { xs: "100%", md: "95%" },
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "16px" },
                lineHeight: { xs: "24px", sm: "32px" },
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
              justifyContent: { xs: "center", sm: "center", md: "flex-start" },
              alignItems: { xs: "center", md: "flex-start" },
              padding: "0px",
              gap: { xs: "20px", sm: "32px", md: "40px", lg: "48px" },
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {/* Number - NFT Items */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0px",
                minWidth: { xs: "70px", md: "79px" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: { xs: "28px", sm: "32px", md: "40px" },
                  lineHeight: { xs: "40px", sm: "48px", md: "56px" },
                  color: "#FFFFFF",
                }}
              >
                546
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: { xs: "14px", sm: "16px" },
                  lineHeight: { xs: "24px", sm: "32px" },
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
                display: "block",
                width: "0px",
                height: { xs: "50px", sm: "60px", md: "80px" },
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
                minWidth: { xs: "50px", md: "61px" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: { xs: "28px", sm: "32px", md: "40px" },
                  lineHeight: { xs: "40px", sm: "48px", md: "56px" },
                  color: "#FFFFFF",
                }}
              >
                42
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: { xs: "14px", sm: "16px" },
                  lineHeight: { xs: "24px", sm: "32px" },
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
                display: "block",
                width: "0px",
                height: { xs: "50px", sm: "60px", md: "80px" },
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
                minWidth: { xs: "70px", md: "84px" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: { xs: "28px", sm: "32px", md: "40px" },
                  lineHeight: { xs: "40px", sm: "48px", md: "56px" },
                  color: "#FFFFFF",
                }}
              >
                378
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: { xs: "14px", sm: "16px" },
                  lineHeight: { xs: "24px", sm: "32px" },
                  color: "#EBEBEB",
                }}
              >
                Items Sold
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Column - Image Card */}
        <Box
          sx={{
            position: { xs: "relative", md: "absolute" },
            display: "flex",
            flexDirection: { xs: "row", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            padding: {
              xs: "110px 12px 16px",
              sm: "180px 24px 28px",
              md: "clamp(80px, 9vw, 120px) clamp(20px, 3vw, 40px) clamp(20px, 3vw, 40px)",
              lg: "120px 40px 40px",
            },
            gap: {
              xs: "12px",
              sm: "16px",
              md: "clamp(10px, 1.2vw, 16px)",
              lg: "16px",
            },
            isolation: "isolate",
            width: {
              xs: "95%",
              sm: "90%",
              md: "clamp(42%, 40vw, 480px)",
              lg: "480px",
            },
            maxWidth: {
              xs: "400px",
              sm: "600px",
              md: "100%",
              lg: "480px",
            },
            minHeight: {
              xs: "170px",
              sm: "150px",
              md: "clamp(140px, 14vw, 178px)",
              lg: "178px",
            },
            left: { xs: "0", sm: "0", md: "auto", lg: "728px" },
            right: { xs: "auto", sm: "auto", md: "8px", lg: "auto" },
            top: { xs: "0", sm: "0", md: "288px" },
            margin: { xs: "0 auto", sm: "0 auto", md: "0" },
            marginTop: { xs: "170px", sm: "180px", md: "0" },
            background: "rgba(255, 255, 255, 0.1)",
            border: "2px solid #1E50FF",
            backdropFilter: "blur(40px)",
            borderRadius: "8px",
            zIndex: 1,
            order: { xs: 2, md: 2 },
          }}
        >
          {/* Image - six faces */}
          <Box
            sx={{
              position: "absolute",
              width: {
                xs: "240px",
                sm: "320px",
                md: "calc(280px + (403 - 280) * ((100vw - 900px) / (1280 - 900)))",
                lg: "403px",
              },
              height: {
                xs: "220px",
                sm: "292px",
                md: "calc(256px + (368 - 256) * ((100vw - 900px) / (1280 - 900)))",
                lg: "368px",
              },
              left: { xs: "50%", sm: "50%", md: "50%", lg: "38.5px" },
              transform: {
                xs: "translateX(-50%)",
                sm: "translateX(-50%)",
                md: "translateX(-50%)",
                lg: "none",
              },
              top: {
                xs: "-130px",
                sm: "-140px",
                md: "calc(-200px + (-288 - (-200)) * ((100vw - 900px) / (1280 - 900)))",
                lg: "-288px",
              },
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
              padding: {
                xs: "6px 13px",
                sm: "8px 24px",
                md: "6px 20px",
                lg: "8px 35px",
              },
              gap: "8px",
              width: { xs: "auto", sm: "auto", md: "auto", lg: "214px" },
              minWidth: { xs: "120px", sm: "140px", md: "140px", lg: "214px" },
              height: { xs: "40px", sm: "44px", md: "40px", lg: "48px" },
              background: "#1E50FF",
              borderRadius: "8px",
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: { xs: "12px", sm: "14px", md: "13px", lg: "16px" },
              lineHeight: { xs: "20px", sm: "24px", md: "24px", lg: "32px" },
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
              padding: {
                xs: "6px 13px",
                sm: "8px 24px",
                md: "6px 20px",
                lg: "8px 35px",
              },
              gap: "8px",
              width: { xs: "auto", sm: "auto", md: "auto", lg: "170px" },
              minWidth: { xs: "100px", sm: "120px", md: "120px", lg: "170px" },
              height: { xs: "40px", sm: "44px", md: "40px", lg: "48px" },
              border: "1px solid #FFFFFF",
              borderRadius: "8px",
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: { xs: "12px", sm: "14px", md: "13px", lg: "16px" },
              lineHeight: { xs: "20px", sm: "24px", md: "24px", lg: "32px" },
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

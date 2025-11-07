"use client";

import { Box, Typography, SxProps, Theme } from "@mui/material";
import Image from "next/image";

interface CollaborationsProps {
  sx?: SxProps<Theme>;
}

export default function Collaborations({ sx }: CollaborationsProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        py: 8,
        ...sx,
      }}
    >
      {/* Partners Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0px",
          gap: "40px",
          width: "1136px",
        }}
      >
        {/* Heading Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0px",
            gap: "16px",
            width: "752px",
          }}
        >
          {/* Collaboration Tag */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: "32px",
              textAlign: "center",
              color: "#5699FF",
              alignSelf: "stretch",
            }}
          >
            Collaboration
          </Typography>

          {/* Our Partners Title */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "56px",
              lineHeight: "72px",
              textAlign: "center",
              color: "#FFFFFF",
              alignSelf: "stretch",
            }}
          >
            Our Partners
          </Typography>
        </Box>

        {/* Logo Container */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
            gap: "58px",
            width: "1136px",
            height: "48px",
          }}
        >
          {/* Logo 1 */}
          <Image
            src="/colab1.svg"
            alt="Partner Logo 1"
            width={240}
            height={48}
            priority
          />

          {/* Logo 2 */}
          <Image
            src="/colab2.svg"
            alt="Partner Logo 2"
            width={256}
            height={48}
            priority
          />

          {/* Logo 3 */}
          <Image
            src="/colab3.svg"
            alt="Partner Logo 3"
            width={272}
            height={48}
            priority
          />

          {/* Logo 4 */}
          <Image
            src="/colab4.svg"
            alt="Partner Logo 4"
            width={192}
            height={48}
            priority
          />
        </Box>
      </Box>
    </Box>
  );
}

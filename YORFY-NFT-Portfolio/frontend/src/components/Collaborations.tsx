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
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 0 },
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
          gap: { xs: "24px", sm: "32px", md: "40px" },
          width: "100%",
          maxWidth: "1136px",
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
            width: "100%",
            maxWidth: "752px",
          }}
        >
          {/* Collaboration Tag */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "14px", sm: "16px" },
              lineHeight: { xs: "24px", sm: "32px" },
              textAlign: "center",
              color: "primary.light",
              alignSelf: "stretch",
            }}
          >
            Collaboration
          </Typography>

          {/* Our Partners Title */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "32px", sm: "48px", md: "56px" },
              lineHeight: { xs: "40px", sm: "60px", md: "72px" },
              textAlign: "center",
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
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
            gap: { xs: "32px", sm: "40px", md: "58px" },
            width: "100%",
            maxWidth: "1136px",
            flexWrap: { xs: "nowrap", sm: "wrap" },
          }}
        >
          {/* Logo 1 */}
          <Box
            sx={{
              width: { xs: "180px", sm: "200px", md: "240px" },
              height: "auto",
            }}
          >
            <Image
              src="/colab1.svg"
              alt="Partner Logo 1"
              width={240}
              height={48}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </Box>

          {/* Logo 2 */}
          <Box
            sx={{
              width: { xs: "180px", sm: "200px", md: "256px" },
              height: "auto",
            }}
          >
            <Image
              src="/colab2.svg"
              alt="Partner Logo 2"
              width={256}
              height={48}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </Box>

          {/* Logo 3 */}
          <Box
            sx={{
              width: { xs: "180px", sm: "200px", md: "272px" },
              height: "auto",
            }}
          >
            <Image
              src="/colab3.svg"
              alt="Partner Logo 3"
              width={272}
              height={48}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </Box>

          {/* Logo 4 */}
          <Box
            sx={{
              width: { xs: "180px", sm: "200px", md: "192px" },
              height: "auto",
            }}
          >
            <Image
              src="/colab4.svg"
              alt="Partner Logo 4"
              width={192}
              height={48}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

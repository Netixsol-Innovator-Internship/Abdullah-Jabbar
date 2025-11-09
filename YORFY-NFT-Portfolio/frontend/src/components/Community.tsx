"use client";

import {
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

// User card data interface for type safety
interface UserCardData {
  name: string;
  status: string;
  avatarUrl?: string;
  opacity: number;
  top: number;
  left: number;
  zIndex: number;
}

// User card component (DRY approach - reusable component)
interface UserCardProps {
  data: UserCardData;
}

function UserCard({ data }: UserCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: { xs: "12px", sm: "16px" },
        gap: { xs: "12px", sm: "16px" },
        position: { xs: "relative", sm: "absolute" },
        width: { xs: "100%", sm: "90%", md: "95%", lg: "424px" },
        maxWidth: { xs: "330px", sm: "380px", md: "100%", lg: "424px" },
        minHeight: { xs: "auto", sm: "88px", md: "88px" },
        left: {
          xs: "0",
          sm: `${data.left}px`,
          md: `${Math.floor(data.left * 0.8)}px`,
          lg: `${data.left}px`,
        },
        top: { xs: "0", sm: `${data.top}px` },
        margin: { xs: "0 auto", sm: "0" },
        background: "#081956",
        opacity: { xs: 1, sm: data.opacity },
        boxShadow: "0px 24px 80px rgba(0, 0, 0, 0.8)",
        borderRadius: "8px",
        zIndex: { xs: 1, sm: data.zIndex },
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          opacity: 1,
          transform: { xs: "scale(1.02)", sm: "translateY(-8px) scale(1.02)" },
          zIndex: 10,
          boxShadow: "0px 32px 100px rgba(30, 80, 255, 0.4)",
          background: "linear-gradient(135deg, #081956 0%, #1E50FF 100%)",
        },
        "&:focus-within": {
          opacity: 1,
          transform: { xs: "scale(1.02)", sm: "translateY(-8px) scale(1.02)" },
          zIndex: 10,
          boxShadow: "0px 32px 100px rgba(30, 80, 255, 0.4)",
          outline: "2px solid #5699FF",
          outlineOffset: "2px",
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        src={data.avatarUrl}
        sx={{
          width: { xs: "48px", sm: "56px" },
          height: { xs: "48px", sm: "56px" },
          background: "#D9D9D9",
          flex: "none",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "0px",
          width: "100%",
          maxWidth: { xs: "200px", sm: "280px" },
          flex: "1",
        }}
      >
        {/* Name */}
        <Typography
          sx={{
            width: "100%",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: { xs: "14px", sm: "16px" },
            lineHeight: { xs: "24px", sm: "32px" },
            color: "#FFFFFF",
            alignSelf: "stretch",
          }}
        >
          {data.name}
        </Typography>

        {/* Status */}
        <Typography
          sx={{
            width: "100%",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: { xs: "11px", sm: "12px" },
            lineHeight: { xs: "20px", sm: "24px" },
            color: "#EBEBEB",
            alignSelf: "stretch",
          }}
        >
          {data.status}
        </Typography>
      </Box>

      {/* More Icon */}
      <IconButton
        sx={{
          width: "24px",
          height: "24px",
          flex: "none",
          padding: 0,
          minWidth: 0,
          color: "#FFFFFF",
          transition: "all 0.2s ease",
          "&:hover": {
            color: "#5699FF",

            background: "rgba(86, 153, 255, 0.1)",
          },
        }}
      >
        <MoreHorizIcon />
      </IconButton>
    </Box>
  );
}

interface CommunityProps {
  sx?: SxProps<Theme>;
}

export default function Community({ sx }: CommunityProps) {
  // User cards data (DRY approach - data-driven rendering)
  const userCards: UserCardData[] = [
    {
      name: "ShooPharDhie",
      status: "Last Online 2 Hour Ago",
      opacity: 1,
      top: 0,
      left: 0,
      zIndex: 3,
    },
    {
      name: "ShooPharDhie",
      status: "Last Online 2 Hour Ago",
      opacity: 0.7,
      top: 104,
      left: 40,
      zIndex: 2,
    },
    {
      name: "ShooPharDhie",
      status: "Last Online 2 Hour Ago",
      opacity: 0.5,
      top: 208,
      left: 80,
      zIndex: 1,
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        width: { xs: "100%", md: "calc(100% - 32px)", lg: "1216px" },
        maxWidth: { xs: "100%", md: "100%", lg: "1216px" },
        minHeight: { xs: "auto", md: "344px" },
        left: { xs: "0", md: "16px", lg: "72px" },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: { xs: "center", md: "flex-start", lg: "space-between" },
        gap: { xs: "40px", sm: "20px", md: "22px", lg: "0" },
        padding: { xs: "40px 20px", sm: "60px 32px", md: "0 16px" },
        ...sx,
      }}
    >
      {/* Left Side - Heading Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "0px",
          gap: { xs: "20px", md: "24px" },
          width: { xs: "100%", md: "50%", lg: "656px" },
          maxWidth: { xs: "100%", md: "100%", lg: "656px" },
        }}
      >
        {/* Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px",
            gap: "16px",
            width: "100%",
          }}
        >
          {/* Community Label */}
          <Typography
            sx={{
              width: "100%",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: { xs: "14px", sm: "16px" },
              lineHeight: { xs: "24px", sm: "32px" },
              color: "#5699FF",
            }}
          >
            Community
          </Typography>

          {/* Main Heading */}
          <Typography
            sx={{
              width: "100%",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: { xs: "32px", sm: "48px", md: "56px" },
              lineHeight: { xs: "40px", sm: "60px", md: "72px" },
              color: "#FFFFFF",
            }}
          >
            Join Our Community and Get Many Benefits
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              width: "100%",
              fontFamily: "Poppins",
              fontStyle: "normal",
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

        {/* Button */}
        <Button
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: { xs: "8px 32px", md: "8px 40px" },
            gap: "8px",
            width: { xs: "100%", sm: "auto" },
            maxWidth: { xs: "100%", sm: "214px" },
            height: "48px",
            background: "#1E50FF",
            borderRadius: "8px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: { xs: "14px", sm: "16px" },
            lineHeight: "32px",
            color: "#FFFFFF",
            textTransform: "none",
            "&:hover": {
              background: "#1640CC",
            },
          }}
        >
          Join Our Discord
        </Button>
      </Box>

      {/* Right Side - Stacked User Cards */}
      <Box
        sx={{
          position: { xs: "relative", sm: "relative", md: "relative" },
          width: { xs: "100%", sm: "504px", md: "45%", lg: "504px" },
          minHeight: { xs: "auto", sm: "296px", md: "296px" },
          display: "flex",
          flexDirection: { xs: "column", sm: "block", md: "block" },
          gap: { xs: "16px", sm: "0", md: "0" },
          justifyContent: "center",
          alignItems: "center",
          margin: { xs: "0", sm: "0 auto", md: "0" },
          left: { xs: "0", sm: "50%", md: "0" },
          transform: { xs: "none", sm: "translateX(-50%)", md: "none" },
        }}
      >
        {/* Render user cards using map (DRY approach) */}
        {userCards.map((user, index) => (
          <UserCard key={index} data={user} />
        ))}
      </Box>
    </Box>
  );
}

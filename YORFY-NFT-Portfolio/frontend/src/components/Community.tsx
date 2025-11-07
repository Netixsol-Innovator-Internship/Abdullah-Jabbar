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
        padding: "16px",
        gap: "16px",
        position: "absolute",
        width: "424px",
        height: "88px",
        left: `${data.left}px`,
        top: `${data.top}px`,
        background: "#081956",
        opacity: data.opacity,
        boxShadow: "0px 24px 80px rgba(0, 0, 0, 0.8)",
        borderRadius: "8px",
        zIndex: data.zIndex,
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          opacity: 1,
          transform: "translateY(-8px) scale(1.02)",
          zIndex: 10,
          boxShadow: "0px 32px 100px rgba(30, 80, 255, 0.4)",
          background: "linear-gradient(135deg, #081956 0%, #1E50FF 100%)",
        },
        "&:focus-within": {
          opacity: 1,
          transform: "translateY(-8px) scale(1.02)",
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
          width: "56px",
          height: "56px",
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
          width: "280px",
          height: "56px",
          flex: "1",
        }}
      >
        {/* Name */}
        <Typography
          sx={{
            width: "280px",
            height: "32px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "32px",
            color: "#FFFFFF",
            alignSelf: "stretch",
          }}
        >
          {data.name}
        </Typography>

        {/* Status */}
        <Typography
          sx={{
            width: "280px",
            height: "24px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "24px",
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
        width: "1216px",
        height: "344px",
        left: "72px",
        display: "flex",
        justifyContent: "space-between",
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
          gap: "24px",
          width: "656px",
          height: "344px",
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
            width: "656px",
            height: "272px",
          }}
        >
          {/* Community Label */}
          <Typography
            sx={{
              width: "656px",
              height: "32px",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: "32px",
              color: "#5699FF",
            }}
          >
            Community
          </Typography>

          {/* Main Heading */}
          <Typography
            sx={{
              width: "656px",
              height: "144px",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "56px",
              lineHeight: "72px",
              color: "#FFFFFF",
            }}
          >
            Join Our Community and Get Many Benefits
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              width: "656px",
              height: "64px",
              fontFamily: "Poppins",
              fontStyle: "normal",
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

        {/* Button */}
        <Button
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
            fontStyle: "normal",
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
          Join Our Discord
        </Button>
      </Box>

      {/* Right Side - Stacked User Cards */}
      <Box
        sx={{
          position: "relative",
          width: "504px",
          height: "296px",
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

"use client";

import { useState } from "react";
import { Box, Typography, Link, Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Image from "next/image";

export default function Header() {
  const [homeAnchorEl, setHomeAnchorEl] = useState<null | HTMLElement>(null);
  const [pagesAnchorEl, setPagesAnchorEl] = useState<null | HTMLElement>(null);
  const homeOpen = Boolean(homeAnchorEl);
  const pagesOpen = Boolean(pagesAnchorEl);

  const handleHomeClick = (event: React.MouseEvent<HTMLElement>) => {
    setHomeAnchorEl(event.currentTarget);
  };

  const handlePagesClick = (event: React.MouseEvent<HTMLElement>) => {
    setPagesAnchorEl(event.currentTarget);
  };

  const handleHomeClose = () => {
    setHomeAnchorEl(null);
  };

  const handlePagesClose = () => {
    setPagesAnchorEl(null);
  };

  const handleJoinUsClick = () => {
    console.log("Join Us clicked!");
    // Add your join us logic here
  };

  return (
    <Box
      component="header"
      sx={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: 0,
        width: "100%",
        maxWidth: "1280px",
        height: "88px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "24px 72px",
        gap: "40px",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          width: "128px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          flex: "none",
          order: 0,
          flexGrow: 0,
        }}
      >
        <Image
          src="/Logo.svg"
          alt="YORFY Logo"
          width={128}
          height={40}
          priority
          style={{ width: "128px", height: "40px" }}
        />
      </Box>

      {/* Menu */}
      <Box
        component="nav"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 0,
          gap: "24px",
          width: "813px",
          height: "24px",
          flex: "none",
          order: 1,
          flexGrow: 1,
        }}
      >
        {/* Dropdown Menu - Home */}
        <Box
          onClick={handleHomeClick}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            padding: 0,
            width: "67px",
            height: "24px",
            flex: "none",
            order: 0,
            flexGrow: 0,
            cursor: "pointer",
            "&:hover": {
              "& .MuiTypography-root": {
                color: "#FFFFFF",
              },
              "& .MuiSvgIcon-root": {
                color: "#FFFFFF",
              },
            },
          }}
        >
          <Typography
            sx={{
              width: "43px",
              height: "24px",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: "24px",
              color: homeOpen ? "#FFFFFF" : "#FFFFFF",
              transition: "color 0.3s ease",
            }}
          >
            Home
          </Typography>
          <ArrowDropDownIcon
            sx={{
              width: "24px",
              height: "24px",
              color: homeOpen ? "#FFFFFF" : "#FFFFFF",
              transition: "color 0.3s ease, transform 0.3s ease",
              transform: homeOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Box>
        <Menu
          anchorEl={homeAnchorEl}
          open={homeOpen}
          onClose={handleHomeClose}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "transparent",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(30, 80, 255, 0.3)",
              borderRadius: "8px",
              mt: 1,
            },
          }}
        >
          <MenuItem
            onClick={handleHomeClose}
            sx={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#EBEBEB",
              "&:hover": {
                backgroundColor: "#1E50FF",
                color: "#FFFFFF",
              },
            }}
          >
            Home 1
          </MenuItem>
          <MenuItem
            onClick={handleHomeClose}
            sx={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#EBEBEB",
              "&:hover": {
                backgroundColor: "#1E50FF",
                color: "#FFFFFF",
              },
            }}
          >
            Home 2
          </MenuItem>
          <MenuItem
            onClick={handleHomeClose}
            sx={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#EBEBEB",
              "&:hover": {
                backgroundColor: "#1E50FF",
                color: "#FFFFFF",
              },
            }}
          >
            Home 3
          </MenuItem>
        </Menu>

        {/* NFT */}
        <Link
          href="#"
          sx={{
            width: "25px",
            height: "24px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "24px",
            color: "#EBEBEB",
            textDecoration: "none",
            flex: "none",
            order: 1,
            flexGrow: 0,
            cursor: "pointer",
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#FFFFFF",
            },
          }}
        >
          NFT
        </Link>

        {/* Roadmap */}
        <Link
          href="#"
          sx={{
            width: "70px",
            height: "24px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "24px",
            color: "#EBEBEB",
            textDecoration: "none",
            flex: "none",
            order: 2,
            flexGrow: 0,
            cursor: "pointer",
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#FFFFFF",
            },
          }}
        >
          Roadmap
        </Link>

        {/* About Us */}
        <Link
          href="#"
          sx={{
            width: "63px",
            height: "24px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "24px",
            color: "#EBEBEB",
            textDecoration: "none",
            flex: "none",
            order: 3,
            flexGrow: 0,
            cursor: "pointer",
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#FFFFFF",
            },
          }}
        >
          About Us
        </Link>

        {/* Contact Us */}
        <Link
          href="#"
          sx={{
            width: "78px",
            height: "24px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "24px",
            color: "#EBEBEB",
            textDecoration: "none",
            flex: "none",
            order: 4,
            flexGrow: 0,
            cursor: "pointer",
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#FFFFFF",
            },
          }}
        >
          Contact Us
        </Link>

        {/* Dropdown Menu - Pages */}
        <Box
          onClick={handlePagesClick}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            padding: 0,
            width: "68px",
            height: "24px",
            flex: "none",
            order: 5,
            flexGrow: 0,
            cursor: "pointer",
            "&:hover": {
              "& .MuiTypography-root": {
                color: "#FFFFFF",
              },
              "& .MuiSvgIcon-root": {
                color: "#FFFFFF",
              },
            },
          }}
        >
          <Typography
            sx={{
              width: "44px",
              height: "24px",
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "24px",
              color: pagesOpen ? "#FFFFFF" : "#EBEBEB",
              transition: "color 0.3s ease",
            }}
          >
            Pages
          </Typography>
          <ArrowDropDownIcon
            sx={{
              width: "24px",
              height: "24px",
              color: pagesOpen ? "#FFFFFF" : "#EBEBEB",
              transition: "color 0.3s ease, transform 0.3s ease",
              transform: pagesOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Box>
        <Menu
          anchorEl={pagesAnchorEl}
          open={pagesOpen}
          onClose={handlePagesClose}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "transparent",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(30, 80, 255, 0.3)",
              borderRadius: "8px",
              mt: 1,
            },
          }}
        >
          <MenuItem
            onClick={handlePagesClose}
            sx={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#EBEBEB",
              "&:hover": {
                backgroundColor: "#1E50FF",
                color: "#FFFFFF",
              },
            }}
          >
            Page 1
          </MenuItem>
          <MenuItem
            onClick={handlePagesClose}
            sx={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#EBEBEB",
              "&:hover": {
                backgroundColor: "#1E50FF",
                color: "#FFFFFF",
              },
            }}
          >
            Page 2
          </MenuItem>
          <MenuItem
            onClick={handlePagesClose}
            sx={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "#EBEBEB",
              "&:hover": {
                backgroundColor: "#1E50FF",
                color: "#FFFFFF",
              },
            }}
          >
            Page 3
          </MenuItem>
        </Menu>
      </Box>

      {/* Button */}
      <Button
        onClick={handleJoinUsClick}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 32px",
          gap: "8px",
          width: "115px",
          height: "40px",
          background: "#1E50FF",
          borderRadius: "8px",
          flex: "none",
          order: 2,
          flexGrow: 0,
          textTransform: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "#1640CC",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(30, 80, 255, 0.4)",
          },
          "&:active": {
            transform: "translateY(0px)",
          },
        }}
      >
        <Typography
          sx={{
            width: "51px",
            height: "24px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "24px",
            color: "#FFFFFF",
          }}
        >
          Join Us
        </Typography>
      </Button>
    </Box>
  );
}

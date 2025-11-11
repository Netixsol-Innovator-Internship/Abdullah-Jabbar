"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Link,
  Button,
  Menu,
  MenuItem,
  Drawer,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

// Navigation items data
const navItems = [
  { label: "NFT", href: "#" },
  { label: "Roadmap", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "#" },
];

const dropdownItems = {
  home: [
    { label: "Home 1", href: "#" },
    { label: "Home 2", href: "#" },
    { label: "Home 3", href: "#" },
  ],
  pages: [
    { label: "Page 1", href: "#" },
    { label: "Page 2", href: "#" },
    { label: "Page 3", href: "#" },
  ],
};

// Reusable Desktop Navigation Link Component
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  sx?: object;
}

function NavLink({ href, children, sx }: NavLinkProps) {
  return (
    <Link
      href={href}
      sx={{
        height: "24px",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "24px",
        color: "text.secondary",
        textDecoration: "none",
        flex: "none",
        flexGrow: 0,
        cursor: "pointer",
        transition: "color 0.3s ease",
        "&:hover": {
          color: "text.primary",
        },
        ...sx,
      }}
    >
      {children}
    </Link>
  );
}

// Reusable Dropdown Component
interface DropdownProps {
  label: string;
  items: { label: string; href: string }[];
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  isBold?: boolean;
}

function Dropdown({
  label,
  items,
  isOpen,
  anchorEl,
  onOpen,
  onClose,
  isBold = false,
}: DropdownProps) {
  return (
    <>
      <Box
        onClick={onOpen}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 0,
          height: "24px",
          flex: "none",
          flexGrow: 0,
          cursor: "pointer",
          "&:hover": {
            "& .MuiTypography-root": {
              color: "text.primary",
            },
            "& .MuiSvgIcon-root": {
              color: "text.primary",
            },
          },
        }}
      >
        <Typography
          sx={{
            height: "24px",
            fontWeight: isBold ? 700 : 400,
            fontSize: "14px",
            lineHeight: "24px",
            color: isOpen ? "text.primary" : "text.secondary",
            transition: "color 0.3s ease",
          }}
        >
          {label}
        </Typography>
        <ArrowDropDownIcon
          sx={{
            width: "24px",
            height: "24px",
            color: isOpen ? "text.primary" : "text.secondary",
            transition: "color 0.3s ease, transform 0.3s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={onClose}
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
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={onClose}
            sx={{
              fontSize: "14px",
              color: "text.secondary",
              "&:hover": {
                color: "text.primary",
              },
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// Mobile Dropdown Component
interface MobileDropdownProps {
  label: string;
  items: { label: string; href: string }[];
  isOpen: boolean;
  onToggle: () => void;
  isBold?: boolean;
}

function MobileDropdown({
  label,
  items,
  isOpen,
  onToggle,
  isBold = false,
}: MobileDropdownProps) {
  return (
    <Box>
      <Box
        onClick={onToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "8px 0",
        }}
      >
        <Typography
          sx={{
            fontWeight: isBold ? 700 : 400,
            fontSize: "16px",
            lineHeight: "24px",
            color: isBold ? "text.primary" : "text.secondary",
          }}
        >
          {label}
        </Typography>
        <ArrowDropDownIcon
          sx={{
            color: isBold ? "text.primary" : "text.secondary",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </Box>
      {isOpen && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            paddingLeft: "16px",
            marginTop: "12px",
          }}
        >
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              sx={{
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                color: "text.secondary",
                textDecoration: "none",
                "&:hover": {
                  color: "primary.light",
                },
              }}
            >
              {item.label}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function Header() {
  const [homeAnchorEl, setHomeAnchorEl] = useState<null | HTMLElement>(null);
  const [pagesAnchorEl, setPagesAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileHomeOpen, setMobileHomeOpen] = useState(false);
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileHome = () => {
    setMobileHomeOpen(!mobileHomeOpen);
  };

  const toggleMobilePages = () => {
    setMobilePagesOpen(!mobilePagesOpen);
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
        maxWidth: { xs: "100%", md: "100%", lg: "1280px" },
        height: { xs: "64px", md: "88px" },
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: {
          xs: "16px 20px",
          sm: "20px 32px",
          md: "24px 32px",
          lg: "24px 72px",
        },
        gap: { xs: "16px", md: "24px", lg: "40px" },
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          width: { xs: "100px", md: "128px" },
          height: { xs: "32px", md: "40px" },
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
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>

      {/* Desktop Menu */}
      <Box
        component="nav"
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 0,
          gap: { md: "16px", lg: "24px" },
          width: "auto",
          maxWidth: { md: "calc(100% - 280px)", lg: "813px" },
          height: "24px",
          flex: "1 1 auto",
          order: 1,
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {/* Home Dropdown */}
        <Dropdown
          label="Home"
          items={dropdownItems.home}
          isOpen={homeOpen}
          anchorEl={homeAnchorEl}
          onOpen={handleHomeClick}
          onClose={handleHomeClose}
          isBold
        />

        {/* Navigation Links */}
        {navItems.map((item, index) => (
          <NavLink key={index} href={item.href}>
            {item.label}
          </NavLink>
        ))}

        {/* Pages Dropdown */}
        <Dropdown
          label="Pages"
          items={dropdownItems.pages}
          isOpen={pagesOpen}
          anchorEl={pagesAnchorEl}
          onOpen={handlePagesClick}
          onClose={handlePagesClose}
        />
      </Box>

      {/* Desktop Button */}
      <Button
        onClick={handleJoinUsClick}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: { md: "8px 24px", lg: "8px 32px" },
          gap: "8px",
          width: { md: "auto", lg: "115px" },
          minWidth: "100px",
          height: "40px",
          bgcolor: "primary.main",
          borderRadius: "8px",
          flex: "0 0 auto",
          order: 2,
          flexGrow: 0,
          textTransform: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "primary.dark",
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
            width: "auto",
            height: "24px",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "24px",
            whiteSpace: "nowrap",
          }}
        >
          Join Us
        </Typography>
      </Button>

      {/* Mobile Menu Button */}
      <IconButton
        onClick={toggleMobileMenu}
        sx={{
          display: { xs: "flex", md: "none" },
          marginLeft: "auto",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "280px",
            background: "rgba(8, 25, 86, 0.98)",
            backdropFilter: "blur(20px)",
            padding: "24px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={toggleMobileMenu}
              sx={{
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Mobile Menu Items */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Home Dropdown */}
            <MobileDropdown
              label="Home"
              items={dropdownItems.home}
              isOpen={mobileHomeOpen}
              onToggle={toggleMobileHome}
              isBold
            />

            {/* Navigation Links */}
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                sx={{
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "text.secondary",
                  textDecoration: "none",
                  cursor: "pointer",
                  padding: "8px 0",
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Pages Dropdown */}
            <MobileDropdown
              label="Pages"
              items={dropdownItems.pages}
              isOpen={mobilePagesOpen}
              onToggle={toggleMobilePages}
            />

            {/* Mobile Join Us Button */}
            <Button
              onClick={() => {
                handleJoinUsClick();
                toggleMobileMenu();
              }}
              sx={{
                marginTop: "16px",
                padding: "12px 32px",
                bgcolor: "primary.main",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "16px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              Join Us
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

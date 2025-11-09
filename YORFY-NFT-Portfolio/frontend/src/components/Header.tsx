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
          background: "#1E50FF",
          borderRadius: "8px",
          flex: "0 0 auto",
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
            width: "auto",
            height: "24px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "24px",
            color: "#FFFFFF",
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
          color: "#FFFFFF",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.1)",
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
                color: "#FFFFFF",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.1)",
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
            <Box>
              <Box
                onClick={toggleMobileHome}
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
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#FFFFFF",
                  }}
                >
                  Home
                </Typography>
                <ArrowDropDownIcon
                  sx={{
                    color: "#FFFFFF",
                    transform: mobileHomeOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </Box>
              {mobileHomeOpen && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    paddingLeft: "16px",
                    marginTop: "12px",
                  }}
                >
                  <Link
                    href="#"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#EBEBEB",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#5699FF",
                      },
                    }}
                  >
                    Home 1
                  </Link>
                  <Link
                    href="#"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#EBEBEB",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#5699FF",
                      },
                    }}
                  >
                    Home 2
                  </Link>
                  <Link
                    href="#"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#EBEBEB",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#5699FF",
                      },
                    }}
                  >
                    Home 3
                  </Link>
                </Box>
              )}
            </Box>

            <Link
              href="#"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#EBEBEB",
                textDecoration: "none",
                cursor: "pointer",
                padding: "8px 0",
                "&:hover": {
                  color: "#FFFFFF",
                },
              }}
            >
              NFT
            </Link>

            <Link
              href="#"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#EBEBEB",
                textDecoration: "none",
                cursor: "pointer",
                padding: "8px 0",
                "&:hover": {
                  color: "#FFFFFF",
                },
              }}
            >
              Roadmap
            </Link>

            <Link
              href="#"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#EBEBEB",
                textDecoration: "none",
                cursor: "pointer",
                padding: "8px 0",
                "&:hover": {
                  color: "#FFFFFF",
                },
              }}
            >
              About Us
            </Link>

            <Link
              href="#"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#EBEBEB",
                textDecoration: "none",
                cursor: "pointer",
                padding: "8px 0",
                "&:hover": {
                  color: "#FFFFFF",
                },
              }}
            >
              Contact Us
            </Link>

            {/* Pages Dropdown */}
            <Box>
              <Box
                onClick={toggleMobilePages}
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
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#EBEBEB",
                  }}
                >
                  Pages
                </Typography>
                <ArrowDropDownIcon
                  sx={{
                    color: "#EBEBEB",
                    transform: mobilePagesOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </Box>
              {mobilePagesOpen && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    paddingLeft: "16px",
                    marginTop: "12px",
                  }}
                >
                  <Link
                    href="#"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#EBEBEB",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#5699FF",
                      },
                    }}
                  >
                    Page 1
                  </Link>
                  <Link
                    href="#"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#EBEBEB",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#5699FF",
                      },
                    }}
                  >
                    Page 2
                  </Link>
                  <Link
                    href="#"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#EBEBEB",
                      textDecoration: "none",
                      "&:hover": {
                        color: "#5699FF",
                      },
                    }}
                  >
                    Page 3
                  </Link>
                </Box>
              )}
            </Box>

            {/* Mobile Join Us Button */}
            <Button
              onClick={() => {
                handleJoinUsClick();
                toggleMobileMenu();
              }}
              sx={{
                marginTop: "16px",
                padding: "12px 32px",
                background: "#1E50FF",
                borderRadius: "8px",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "16px",
                color: "#FFFFFF",
                textTransform: "none",
                "&:hover": {
                  background: "#1640CC",
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

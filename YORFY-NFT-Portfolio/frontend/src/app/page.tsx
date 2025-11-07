"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SaleBanner from "@/components/SaleBanner";
import Highlight from "@/components/Highlight";
import Collections from "@/components/Collections";
import Community from "@/components/Community";
import Collaborations from "@/components/Collaborations";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <>
      <Header />

      {/* Main content */}
      <Box component="main" sx={{ display: "flex", flexDirection: "column" }}>
        <Hero />
        <SaleBanner sx={{ marginTop: "100px" }} />
        <Highlight sx={{ marginTop: "100px" }} />
        <Collections sx={{ marginTop: "100px" }} />
        <Community sx={{ marginTop: "100px" }} />
        <SaleBanner sx={{ marginTop: "90px" }} />
        <Collaborations sx={{ marginTop: "40px" }} />
        <Newsletter sx={{ marginTop: "-40px" }} />
      </Box>

      <Footer />
    </>
  );
}

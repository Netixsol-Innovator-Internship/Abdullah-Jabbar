import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Container } from "@mui/material";
import theme from "@/theme/theme";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "YORFY - NFT Portfolio",
  description: "NFT Portfolio Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                position: "relative",
                minHeight: "100vh",
                width: "100%",
                bgcolor: "#051139",
                overflowX: "hidden", // Prevent horizontal scroll
              }}
            >
              <Container
                maxWidth={false}
                disableGutters
                sx={{
                  maxWidth: "1280px",
                  margin: "0 auto",
                  position: "relative",
                  bgcolor: "#051139", // Secondary/Navy from Figma
                  // overflowX: "hidden", // Prevent horizontal scroll in container
                }}
              >
                {children}
              </Container>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

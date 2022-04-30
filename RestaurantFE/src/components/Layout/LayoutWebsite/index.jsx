import React from "react";
import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../../container/HomePage/Footer/Footer";

const WebsiteLayout = () => {
  const MuiTheme = createTheme({
    typography: {
      allVariants: {
        color: "white",
      },
    },
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={MuiTheme}>
      <Navbar />
      <Outlet />
      <Footer />
    </ThemeProvider>
  );
};

export default WebsiteLayout;

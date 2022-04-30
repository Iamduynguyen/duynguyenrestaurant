import React from "react";
import AboutUs from "./AboutUs/AboutUs";
import Chef from "./Chef/Chef";
import FindUs from "./Findus/FindUs";
import Gallery from "./Gallery/Gallery";
import Header from "./Header/Header";
import Intro from "./Intro/Intro";
import Laurels from "./Laurels/Laurels";
import SpecialMenu from "./Menu/SpecialMenu";

export default function HomePage() {
  return (
    <>
      <Header />
      <SpecialMenu />

      {/* <AboutUs /> */}
      <Chef />
      <Intro />
      <Gallery />

      <Laurels />
      <FindUs />
    </>
  );
}

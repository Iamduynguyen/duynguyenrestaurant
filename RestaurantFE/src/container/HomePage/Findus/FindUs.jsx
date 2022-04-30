import React from "react";

import SubHeading from "../../../components/SubHeading/SubHeading";
import { images } from "../../../constants";

const FindUs = () => (
  <div className="app--bg z-[10] app__wrapper section__padding" id="contact">
    <div className="app__wrapper_info">
      <SubHeading
        classText="text-2xl font-medium text-gray-600"
        title="Contact"
      />
      <h1 className="headtext__cormorant" style={{ marginBottom: "3rem" }}>
        Find Us
      </h1>
      <div className="app__wrapper-content">
        <p className="text-gray-600">
          Lane Ends Bungalow, Whatcroft Hall Lane, Rudheath, CW9 75G
        </p>
        <p
          className="p__cormorant"
          style={{ color: "#DCCA87", margin: "2rem 0" }}
        >
          Opening Hours
        </p>
        <p className=" text-gray-600">Mon - Fri: 10:00 am - 02:00 am</p>
        <p className="text-gray-600">Sat - Sun: 10:00 am - 03:00 am</p>
      </div>
      <button
        type="button"
        className="custom__button"
        style={{ marginTop: "2rem" }}
      >
        Visit Us
      </button>
    </div>

    <div className="app__wrapper_img">
      <img src={images.findus} alt="finus_img" />
    </div>
  </div>
);

export default FindUs;

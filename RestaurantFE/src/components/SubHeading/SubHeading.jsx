import React from "react";

import { images } from "../../constants";

const SubHeading = ({ title, classText }) => (
  <div style={{ marginBottom: "1rem" }}>
    <p className={classText}>{title}</p>
    <img src={images.spoon} alt="spoon_image" className="spoon__img" />
  </div>
);

export default SubHeading;

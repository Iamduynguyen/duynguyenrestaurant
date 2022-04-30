import React from "react";

import { SubHeading } from "../../../components";
import { images } from "../../../constants";
import "./Header.css";

const Header = () => (
  <div className="app__header app__wrapper section__padding " id="home">
    <div className="app__wrapper_info">
      <SubHeading
        classText="text-xl font-medium text-gray-700"
        title="Tìm kiếm hương vị mới"
      />
      <h1 className="app__header-h1 ">Chìa Khóa Đang Ở Đây</h1>
      <p className="p__opensans" style={{ margin: "2rem 0", color: "black" }}>
        Sit tellus lobortis sed senectus vivamus molestie. Condimentum volutpat
        morbi facilisis quam scelerisque sapien. Et, penatibus aliquam amet
        tellus{" "}
      </p>
      <button type="button" className="custom__button">
        Khám Phá Ngay
      </button>
    </div>

    <div className="app__wrapper_img pt-[50px]">
      <img src={images.welcome} alt="header_img" />
    </div>
  </div>
);

export default Header;

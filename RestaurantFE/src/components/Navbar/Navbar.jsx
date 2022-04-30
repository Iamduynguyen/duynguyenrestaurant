import LocalGroceryStoreOutlinedIcon from "@mui/icons-material/LocalGroceryStoreOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Badge, Button, Divider, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BookTableAPI from "../../API/BookTableAPI";
import images from "../../constants/images";
import getAuth, {
  getKey,
  logout as logoutFunction,
} from "../../Features/getAuth";
import "./Navbar.css";
const Navbar = () => {
  const navigation = useNavigate();
  const location = useLocation();
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const [Cart, setCart] = React.useState(0);
  const [userLogin, setUserLogin] = React.useState(getAuth());
  useEffect(() => {
    const fetchData = async () => {
      const res = await BookTableAPI.getUserBookTable();
      setCart(res.length);
    };
    fetchData();
  }, [userLogin]);
  const logout = () => {
    logoutFunction();
    setUserLogin(getAuth());
    navigation("/");
  };
  useEffect(() => {
    setUserLogin(getAuth());
  }, [location]);

  return (
    <nav className="app__navbar z-[999] fixed top-0 opacity-[90%]">
      <div className="app__navbar-logo">
        <img src={images.gericht} alt="app__logo" />
      </div>
      <ul className="app__navbar-links">
        <li className="p__opensans">
          <Link to="/" className="p__opensans">
            Trang chủ
          </Link>
        </li>
        <li className="p__opensans">
          <Link to="/menu">Món ăn</Link>
        </li>
        <li className="p__opensans">
          <a href="/#about">Văn hóa</a>
        </li>
        <li className="p__opensans">
          <a href="/contact">Liên hệ</a>
        </li>
      </ul>
      <div style={{ position: "relative", top: 4, right: 10 }}>
        {userLogin && (
          <Link to="/cart">
            <Badge color="secondary" badgeContent={Cart}>
              <LocalGroceryStoreOutlinedIcon
                sx={{
                  color: "white",
                  cursor: "pointer",
                  transform: "translateY(-5px)",
                }}
              />
            </Badge>
          </Link>
        )}
      </div>
      <div className="app__navbar-login">
        {/* <Link to="/login">
          <p className="p__opensans">Log In / Registration</p>
        </Link> */}
        {userLogin ? (
          <p className="userLogin relative item-hover ">
            <p
              className="p__opensans cursor-pointer  "
              style={{ padding: "0 20px" }}
            >
              Xin chào {getKey("name")}!
            </p>
            <ul className="item-list overflow-hidden  absolute top-[100%] right-0 z-[999] bg-white w-full">
              <li className="py-[10px] ">
                <Link className="w-full block" to="/favorite">
                  Món ăn ưa thích
                </Link>
              </li>
              <li className="py-[10px] ">
                <Link to="/user-settings" className="w-full block">
                  Thông tin cá nhân
                </Link>
              </li>
              {getKey("role") === "ROLE_ADMIN" ? (
                <>
                  <li className="py-[10px] ">
                    <Link to="/admin" className="w-full block">
                      Trang quản lý
                    </Link>
                  </li>
                </>
              ) : (
                <></>
              )}
              <li className="cursor-pointer pb-[10px] px-[15px]">
                <bottom onClick={logout} className="flex items-center">
                  <LogoutIcon
                    style={{ fontSize: "16px", marginRight: "5px" }}
                  />
                  Đăng xuất
                </bottom>
              </li>
            </ul>
          </p>
        ) : (
          <Link to="/login" className="">
            <p className="p__opensans">Đăng nhập</p>
          </Link>
        )}
        <div />
        <Link to="/book-table" className="p__opensans">
          Đặt bàn
        </Link>
      </div>
      <div className="app__navbar-smallscreen">
        <GiHamburgerMenu
          color="#fff"
          fontSize={27}
          onClick={() => setToggleMenu(true)}
        />
        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <MdOutlineRestaurantMenu
              fontSize={27}
              className="overlay__close"
              onClick={() => setToggleMenu(false)}
            />
            <ul className="app__navbar-smallscreen_links">
              <li>
                <a href="/" onClick={() => setToggleMenu(false)}>
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/menu" onClick={() => setToggleMenu(false)}>
                  Menu
                </a>
              </li>
              <li>
                <a href="/about" onClick={() => setToggleMenu(false)}>
                  Văn hóa nhà hàng
                </a>
              </li>
              <li>
                <a href="/contact" onClick={() => setToggleMenu(false)}>
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

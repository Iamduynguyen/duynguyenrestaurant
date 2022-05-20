import React, { useEffect, useState, useRef } from "react";
import { Row, Col } from "antd";
import { red } from "@ant-design/colors";
import { Menu } from "antd";
import {
  BarChartOutlined,
  AppstoreOutlined,
  AlignLeftOutlined,
  RadarChartOutlined,
  ReadOutlined,
  PlusSquareOutlined,
  ChromeOutlined,
  UserOutlined,
  BankOutlined,
  CalendarOutlined,
  SettingOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { getKey } from "../../Features/getAuth";

const AdmPage = () => {
  const [selectedKey, setSelectedKey] = useState("sub-dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const menuEleRef = useRef();

  const getItem = (label, key, icon, children, type) => ({
    key,
    label,
    icon,
    children,
    type,
  });

  const handleSelectKey = (item) => {
    setSelectedKey(item.key);
  };

  const menuItems = [
    getItem(
      <Link to="/admin">Trang chủ</Link>,
      "sub-dashboard",
      <RadarChartOutlined />
    ),
    getItem("Thể loại", "sub-categories", <AppstoreOutlined />, [
      getItem(
        <Link to="/admin/categories">Danh sách</Link>,
        "categories-opt-list",
        <AlignLeftOutlined />
      ),
    ]),
    getItem("Đồ ăn", "sub-foods", <ReadOutlined />, [
      getItem(
        <Link to="/admin/foods">Danh sách</Link>,
        "foods-opt-list",
        <AlignLeftOutlined />
      ),
      getItem(
        <Link to="/admin/foods/new-food">Thêm món ăn</Link>,
        "foods-opt-create",
        <PlusSquareOutlined />
      ),
    ]),
    getItem(
      <Link to="/admin/tables">Quản lý bàn</Link>,
      "sub-tables",
      <BankOutlined />
    ),
    getItem(
      <Link to="/admin/orders-management">Quản lý hoá đơn</Link>,
      "sub-order-management",
      <DollarCircleOutlined />
    ),
    getItem(
      <Link to="/admin/orders">Đơn đặt bàn</Link>,
      "sub-order",
      <CalendarOutlined />
    ),
    getItem(
      <Link to="/admin/customer">Khách hàng</Link>,
      "sub-customer",
      <UserOutlined />
    ),
    getItem(
      <Link to="/admin/staff">Nhân viên</Link>,
      "sub-staff",
      <UserOutlined />
    ),
    getItem(
      <Link to="/admin/analist">Biểu đồ thống kê</Link>,
      "sub-analist",
      <BarChartOutlined />
    ),
    getItem(<Link to="/">Website</Link>, "sub-website", <ChromeOutlined />),
    getItem("Cài đặt", "sub-setting", <SettingOutlined />),
  ];

  useEffect(() => {
    if (getKey("role") !== "ROLE_ADMIN") {
      navigate("/");
    } else {
      switch (location.pathname) {
        case "/admin": {
          setSelectedKey("sub-dashboard");
          break;
        }
        case "/admin/categories": {
          setSelectedKey("categories-opt-list");
          break;
        }
        case "/admin/foods": {
          setSelectedKey("foods-opt-list");
          break;
        }
        case "/admin/foods/new-food": {
          setSelectedKey("foods-opt-create");
          break;
        }
        default: {
          break;
        }
      }
    }
  }, []);
  if (getKey("role") !== "ROLE_ADMIN") {
    return <></>;
  }
  return (
    <Row className="adm" gutter={[0, 0]}>
      <Col span={4} className="adm--sidebar">
        <div className="adm--sibar__logo"></div>
        <Menu
          mode="inline"
          items={menuItems}
          className="adm--sidebar__inner"
          defaultSelectedKeys={"sub-dashboard"}
          selectedKeys={selectedKey}
          onClick={(item, key, keypath, domEvent) => {
            handleSelectKey(item);
          }}
          ref={menuEleRef}
        ></Menu>
      </Col>
      <Col span={20} className="adm--content">
        <div className="adm--content__navtop"></div>
        <div className="adm--content__detail">
          <Outlet />
        </div>
      </Col>
    </Row>
  );
};

export default AdmPage;

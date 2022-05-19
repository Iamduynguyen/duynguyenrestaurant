import { createTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./container";
import FixFoods from "./container/Admin/Foods/FixFood";
import NewFood from "./container/Admin/Foods/NewFood";
import Login from "./container/Auth/Login";
import Register from "./container/Auth/Register";
import BookTable from "./container/BookTable";
import Cart from "./container/Cart";
import Contact from "./container/Contact/Contact";
import Menu from "./container/Menu";
import DetailFood from "./container/Menu/DetailFood";
import CategoriesAdmin from "./container/Admin/Categories";
import WebsiteLayout from "./components/layout/LayoutWebsite";
import FoodsAdmin from "./container/Admin/Foods";
import TableAdmin from "./container/Admin/Table";
import ConfirmOrder from "./container/Admin/ConfirmOrder";
import AdminLayout from "./components/layout/LayoutAdmin";
import ChartAdmin from "./container/Admin/Chart/Chart";
import DashboardAdmin from "./container/Admin/Dashboard";
import UserSettings from "./container/User";
import OrderManagement from "./container/Admin/OrderManagement";
import OrderDetail from "./container/Admin/OrderManagement/OrderDetail";
import CreateOrder from "./container/Admin/OrderManagement/CreateOrder";
import NotFound404 from "./components/NotFound404";
import AddFood from "./container/Admin/OrderManagement/AddFood";

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

const App = () => {
  const [foodsAtTable, setFoodsAtTable] = useState([]);
  const [orderStatus, setOrderStatus] = useState();

  return (
    <Routes>
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<DetailFood />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-settings" element={<UserSettings />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardAdmin />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="analist" element={<ChartAdmin />} />
        <Route path="foods" element={<FoodsAdmin />} />
        <Route path="foods/fix-food/:id" element={<FixFoods />} />
        <Route path="/admin/foods/new-food" element={<NewFood />} />
        <Route path="tables" element={<TableAdmin />} />
        <Route path="orders" element={<ConfirmOrder />} />
        <Route
          path="orders-management"
          element={
            <OrderManagement
              foodsAtTable={foodsAtTable}
              setFoodsAtTable={setFoodsAtTable}
              setOrderStatus={setOrderStatus}
            />
          }
        />
        <Route
          path="orders-management/create"
          element={
            <CreateOrder
              foodsAtTable={foodsAtTable}
              setFoodsAtTable={setFoodsAtTable}
            />
          }
        />
        <Route
          path="orders-management/:orderId/:tableId"
          element={
            <OrderDetail
              foodsAtTable={foodsAtTable}
              setFoodsAtTable={setFoodsAtTable}
              orderStatus={orderStatus}
            />
          }
        />
        <Route
          path="orders-management/:orderId/:tableId/add"
          element={
            <AddFood
              foodsAtTable={foodsAtTable}
              setFoodsAtTable={setFoodsAtTable}
            />
          }
        />
      </Route>
      <Route path="/404" element={<NotFound404 />} />
    </Routes>
  );
};

export default App;

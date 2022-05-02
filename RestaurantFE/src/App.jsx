import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const App = () => (
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
      <Route path="chartAdmin" element={<ChartAdmin />} />
      <Route path="foods" element={<FoodsAdmin />} />
      <Route path="foods/fix-food/:id" element={<FixFoods />} />
      <Route path="/admin/foods/new-food" element={<NewFood />} />
      <Route path="tables" element={<TableAdmin />} />
      <Route path="orders" element={<ConfirmOrder />} />
    </Route>
  </Routes>
);

export default App;

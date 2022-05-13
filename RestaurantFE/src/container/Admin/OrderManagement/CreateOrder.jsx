import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Button, Grid } from "@mui/material";
import CategoriesAPI from "../../../API/CategoriesAPI";
import FoodsApi from "../../../API/FoodsAPI";

const CreateOrder = () => {
  const navigation = useNavigate();
  const [resetData, setResetData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activeCategories, setActiveCategories] = useState("all");

  // API Categories
  const getCategories = async () => {
    const res = await CategoriesAPI.getAllCategories();
    if (res) {
      setCategories(res);
    }
  };
  // API Food
  const getAllFood = async () => {
    const res = await FoodsApi.getAllFoods();
    if (res) {
      setFoods(res);
    }
  };
  const getFoodsByCategoryId = async (id) => {
    const res = await FoodsApi.getFoodsByCategoryId(id);
    if (res) {
      setFoods(res);
    }
  };

  useEffect(() => {
    getCategories();
    getAllFood();

    console.log(foods);
  }, []);

  return (
    <>
      <div className="adm-section">
        <h3>Tạo mới hoá đơn</h3>
      </div>
      <div className="table-header__btn">
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={() => navigation("/admin/orders-management")}
          startIcon={<ArrowBackRoundedIcon />}
        >
          Quay lại
        </Button>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <div className="container">xs</div>
        </Grid>
        <Grid item xs={6}>
          <div className="container">
            <div className="container-categories">
              <button
                className={`${
                  activeCategories.includes("all") ? "active" : ""
                }`}
                onClick={() => {
                  setActiveCategories("all");
                  getAllFood();
                }}
              >
                TẤT CẢ
              </button>
              {categories.map((e) => {
                return (
                  <button
                    className={`${
                      activeCategories.includes(e.name) ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveCategories(e.name);
                      getFoodsByCategoryId(e.id);
                    }}
                  >
                    {e.name}
                  </button>
                );
              })}
            </div>
            <div className="container-foods">
              {foods.map((e) => {
                return (
                  <div className="item">
                    <img src={e.avtUrl} alt={e.id} />
                    <p>{e.title}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Grid>
        <Grid item xs>
          <div className="container">
            <div className="container-orders">listOrder</div>
            <div className="container-bill">
              <table>
                <tr>
                  <th className="text-left">Tổng</th>
                  <td className="text-right">
                    {`${"123".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                  </td>
                </tr>
                <tr>
                  <th className="text-left">V.A.T</th>
                  <td className="text-right">
                    {`${"123".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                  </td>
                </tr>
                <tr>
                  <th className="text-left">Thanh toán</th>
                  <td className="text-right">
                    {`${"123".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                  </td>
                </tr>
                <tr>
                  <td>
                    --------------------------------------------------------------
                  </td>
                </tr>
                <tr>
                  <th className="text-left">Khách trả</th>
                  <td className="text-right">
                    {`${"123".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                  </td>
                </tr>
                <tr>
                  <th className="text-left">Trả lại</th>
                  <td className="text-right">
                    {`${"123".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateOrder;

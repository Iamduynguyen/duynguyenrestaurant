import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, IconButton } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CategoriesAPI from "../../../API/CategoriesAPI";
import FoodsApi from "../../../API/FoodsAPI";
import TableAPI from "../../../API/TableAPI";

const CreateOrder = () => {
  const navigation = useNavigate();
  const [resetData, setResetData] = useState(false);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activeCategories, setActiveCategories] = useState("all");

  // API available Tables
  const getTablesAvailable = async () => {
    const res = await TableAPI.getTablesAvailable();
    console.log(res);
    if (res) {
      setTables(res);
    }
  };
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
  console.log(tables);

  // Button Add, Remove, Delete ordered food
  const addQty = async (foodOrders) => {
    const { value: qty } = await Swal.fire({
      title: `Món ${foodOrders.foodName}`,
      input: "text",
      inputLabel: "Nhập số lượng cần thêm",
      inputPlaceholder: "Số lượng thêm vào",
      confirmButtonText: "Thêm",
      confirmButtonColor: "#19a400",
    });
    if (qty) {
      if (!/^\d+$/.test(qty)) {
        ModalMessage.miniTopRightModal(
          "error",
          `Số lượng vừa nhập<br>không hợp lệ!`
        );
      } else if (+qty <= 0) {
        ModalMessage.miniTopRightModal("warning", `Số lượng phải lớn hơn 0!`);
      } else {
        const data = {
          tableId: foodOrders.orderTableId,
          idFoodCounters: [{ foodId: foodOrders.foodDetailsId, quantity: qty }],
        };
        const res = await OrdersAPI.addQty(data);
        console.log(res);
        if (res === "SUCCESS") {
          ModalMessage.miniTopRightModal(
            "success",
            `Đã thêm ${qty} x ${foodOrders.foodName}`
          );
          navigation("/admin/orders-management");
        } else {
          ModalMessage.miniTopRightModal(
            "error",
            `Lỗi<br/>Vui lòng thử lại sau!`
          );
        }
      }
    }
  };
  const removeQty = async (foodOrders) => {
    const { value: qty } = await Swal.fire({
      title: `Món ${foodOrders.foodName}`,
      input: "text",
      inputLabel: "Nhập số lượng cần trừ",
      inputPlaceholder: "Số lượng trừ đi",
      confirmButtonText: "Trừ",
      confirmButtonColor: "#c20000",
    });
    if (qty) {
      if (!/^\d+$/.test(qty)) {
        ModalMessage.miniTopRightModal(
          "error",
          `Số lượng vừa nhập<br>không hợp lệ!`
        );
      } else if (+qty > +foodOrders.quantity) {
        ModalMessage.miniTopRightModal("error", `Vượt quá số lượng hiện tại!`);
      } else {
        const data = {
          orderDetails: [{ orderDetailsId: foodOrders.id, quantity: qty }],
        };
        const res = await OrdersAPI.removeQty(data);
        if (res === "SUCCESS") {
          ModalMessage.middleModal(
            "success",
            `Đã trừ ${qty} x ${foodOrders.foodName}`
          );
          navigation("/admin/orders-management");
        } else {
          ModalMessage.miniTopRightModal(
            "error",
            `Lỗi<br/>Vui lòng thử lại sau!`
          );
        }
      }
    }
  };
  const deleteOrderDetails = async (data) => {
    if (data.length === 0) {
      ModalMessage.miniTopRightModal("warning", "Chưa chọn món cần xoá!");
    } else {
      Swal.fire({
        title: `Xoá món ăn`,
        html: `Bạn có chắc chắn muốn xoá<br>${data.map(
          (e) => e.foodName
        )}<br> khỏi hoá đơn không?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#12a524",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, huỷ ngay!",
        cancelButtonText: "Không, xem xét lại!",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const reqData = { ids: data.map((e) => e.id) };
          const res = await OrdersAPI.deleteOrderDetails(reqData);
          if (res === "SUCCESS") {
            ModalMessage.miniTopRightModal(
              "success",
              `Xoá ${data.length} món ăn thành công!`
            );
            navigation("/admin/orders-management");
          } else {
            ModalMessage.miniTopRightModal(
              "error",
              `Lỗi<br/>Vui lòng thử lại sau!`
            );
          }
        }
      });
    }
  };

  useEffect(() => {
    getTablesAvailable();
    getCategories();
    getAllFood();
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
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <div className="container">
            <h2>Bàn hiện có</h2>
            <div className="container-tables">
              {tables.map((e) => {
                return (
                  <Button key={e.id} variant="contained" size="medium">
                    {e.id}
                  </Button>
                );
              })}
            </div>
          </div>
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
                    <p>{e.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Grid>
        <Grid item xs>
          <div className="container order-bill">
            <h2>Hoá đơn</h2>
            <div className="container-orders">
              <table>
                <thead>
                  <th width={1}></th>
                  <th width={1}>STT</th>
                  <th>Món</th>
                  <th width={1}>Size</th>
                  <th width={92}>Số lượng</th>
                  <th className="text-right" width={105}>
                    Giá
                  </th>
                </thead>
                <tbody>
                  <td>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      color="error"
                      onClick={() => {
                        deleteOrderDetails(selectedRow);
                      }}
                    >
                      <ClearRoundedIcon fontSize="inherit" />
                    </IconButton>
                  </td>
                  <td className="text-center">1</td>
                  <td>abc</td>
                  <td className="text-center">L</td>
                  <td className="text-center">
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => addQty(record)}
                    >
                      <AddRoundedIcon fontSize="small" color="success" />
                    </IconButton>
                    <span style={{ padding: "0 5px" }}>2</span>
                    <IconButton
                      aria-label="delete"
                      size="small"
                      onClick={() => removeQty(record)}
                    >
                      <RemoveRoundedIcon fontSize="small" color="error" />
                    </IconButton>
                  </td>
                  <td className="text-right">{`${"1234567"
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}</td>
                </tbody>
              </table>
            </div>
            <div className="container-bill">
              <table>
                <tr>
                  <th className="text-left fill-dot">Tổng</th>
                  <td className="text-right">
                    {`${"1234567"
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                  </td>
                </tr>
                <tr>
                  <th className="text-left">V.A.T</th>
                  <td className="text-right">
                    {`${"1234567"
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                  </td>
                </tr>
                <tr>
                  <th className="text-left">Thanh toán</th>
                  <td className="text-right">
                    {`${"1234567"
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                  </td>
                </tr>
                <tr className="space"></tr>
                <tr>
                  <th className="text-left">Khách trả</th>
                  <td className="text-right">
                    {`${"1234567"
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                  </td>
                </tr>
                <tr>
                  <th className="text-left">Trả lại</th>
                  <td className="text-right">
                    {`${"1234567"
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
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

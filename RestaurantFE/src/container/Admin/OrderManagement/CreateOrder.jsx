import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, IconButton } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Modal from "react-modal";
import CategoriesAPI from "../../../API/CategoriesAPI";
import FoodsApi from "../../../API/FoodsAPI";
import TableAPI from "../../../API/TableAPI";
import OrdersAPI from "../../../API/OrdersAPI";
import ModalMessage from "../../../components/Modal/ModalMessage";
import Swal from "sweetalert2";

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const CreateOrder = () => {
  const navigation = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activeCategories, setActiveCategories] = useState("all");

  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [tmpTextSize, setTmpTextSize] = useState("");
  const [tmpQty, setTmpQty] = useState(0);
  const [tmpListFood, setTmpListFood] = useState([]);


  // API available Tables
  const getTablesAvailable = async () => {
    let start = (new Date().getTime()+'').substring(0,10);
    let x = new Date().setHours(new Date().getHours()+3)/1000;
    console.log(x);
    var end = (x+"").substring(0,10);
    const res = await TableAPI.getTableByStartandEnd(start,end);
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

  // Button Add, Remove, Delete ordered food
  const addQty = async (item) => {
    const tmp = tmpListFood.map((e) =>
      e.foodId === item.foodId ? { ...e, quantity: e.quantity + 1 } : e
    );
    setTmpListFood(tmp);
  };
  const removeQty = async (item) => {
    if (item.quantity > 1) {
      const tmp = tmpListFood.map((e) =>
        e.foodId === item.foodId ? { ...e, quantity: e.quantity - 1 } : e
      );
      setTmpListFood(tmp);
    } else {
      deleteOrderDetails(item);
    }
  };
  const deleteOrderDetails = (item) => {
    Swal.fire({
      title: `Xoá món ăn`,
      html: `Bạn có chắc chắn muốn xoá<br><b>${item.name} - Size ${item.size}</b><br> khỏi hoá đơn không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#12a524",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, huỷ ngay!",
      cancelButtonText: "Không, xem xét lại!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const exist = tmpListFood.filter((e) => e.foodId === item.foodId);
        if (exist.length !== 0) {
          const tmp = tmpListFood.filter((e) => e.foodId !== item.foodId);
          setTmpListFood(tmp);

          ModalMessage.miniTopRightModal(
            "success",
            `Xoá món<br>${item.name} - Size ${item.size}<br>thành công!`
          );
        }
      }
    });
  };

  const setChoosedTables = (tableId) => {
    if (selectedTables.indexOf(tableId) < 0) {
      setSelectedTables([...selectedTables, tableId]);
    } else {
      setSelectedTables(selectedTables.filter((e) => e !== tableId));
    }
  };

  const setMinusTmpQty = (qty) => {
    if (qty > 1) {
      setTmpQty(qty - 1);
    }
  };

  const onSelectSize = (foodSize) => {
    setSelectedSize(foodSize);
    setTmpQty(1);
    setTmpTextSize(foodSize.foodSize);
  };

  const addTmpListFood = () => {
    const tmp = {
      foodId: selectedSize.id,
      quantity: tmpQty,
      name: selectedFoods.name,
      size: selectedSize.foodSize,
      price:
        (parseInt(selectedSize.amount, 10) *
          (100 - parseInt(selectedSize.discount, 10))) /
        100,
    };

    // Check food exist
    const duplicate = tmpListFood.filter((e) => e.foodId === selectedSize.id);
    if (duplicate.length !== 0) {
      ModalMessage.miniTopRightModal(
        "error",
        `Món<br>${selectedFoods.name} - Size ${selectedSize.foodSize}<br> đã tồn tại trong hoá đơn!`
      );
    } else {
      if (tmp) {
        ModalMessage.miniTopRightModal(
          "success",
          `Thêm món<br>${selectedFoods.name} - Size ${selectedSize.foodSize}<br> thành công! 😆😆`
        );
        setTmpListFood([...tmpListFood, tmp]);
        onModalClose();
      } else {
        ModalMessage.miniTopRightModal(
          "error",
          `Lỗi hệ thống!<br>Thử lại sau 😥😥`
        );
      }
    }
  };

  const onAddNewOrder = async () => {
    if (selectedTables.length === 0) {
      ModalMessage.miniTopRightModal("warning", "Bạn chưa chọn bàn!");
    } else {
      // Current selected food
      let idFoodCounters = [];
      tmpListFood.map((e) => {
        const food = {
          foodId: e.foodId,
          quantity: e.quantity,
        };
        idFoodCounters.push(food);
      });

      // Current selected table
      let tableCounterDtos = [];
      selectedTables.map((e) => {
        const table = {
          tableId: e,
          idFoodCounters: idFoodCounters,
        };
        tableCounterDtos.push(table);
      });

      // Call API confirm
      const data = { tableCounterDtos: tableCounterDtos };
      const res = await OrdersAPI.createOrder(data);
      if (res === "SUCCESS") {
        Swal.fire(`Tạo hoá đơn thành công!✨✨`, "", "success").then(() => {
          onModalClose();
          navigation("/admin/orders-management");
        });
      } else if (res === "FAIL") {
        ModalMessage.middleModal(
          "error",
          `Tạo hoá đơn thất bại!<br>Vui lòng thử lại sau!`
        );
      }
    }
  };

  const onModalClose = () => {
    setModalIsOpen(false);
    setSelectedFoods([]);
    setSelectedSize([]);
    setTmpQty(0);
    setTmpTextSize("");
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
                  <Button
                    key={e.id}
                    variant="contained"
                    size="medium"
                    color={
                      selectedTables.indexOf(e.id) >= 0 ? "success" : "primary"
                    }
                    onClick={() => setChoosedTables(e.id)}
                  >
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
                    key={e.id}
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
                  <div
                    key={e.id}
                    className="item"
                    onClick={() => {
                      setModalIsOpen(true), setSelectedFoods(e);
                    }}
                  >
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
                  <tr>
                    <th width={1}></th>
                    <th width={1}>STT</th>
                    <th>Món</th>
                    <th width={1}>Size</th>
                    <th width={95}>Số lượng</th>
                    <th className="text-right" width={105}>
                      Giá
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tmpListFood.map((e, index) => (
                    <tr key={index}>
                      <td>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          color="error"
                          onClick={() => {
                            deleteOrderDetails(e);
                          }}
                        >
                          <ClearRoundedIcon fontSize="inherit" />
                        </IconButton>
                      </td>
                      <td className="text-center">{index + 1}</td>
                      <td>{e.name}</td>
                      <td className="text-center">{e.size}</td>
                      <td className="text-center flex">
                        <IconButton
                          aria-label="addQty"
                          size="small"
                          onClick={() => addQty(e)}
                        >
                          <AddRoundedIcon fontSize="small" color="success" />
                        </IconButton>
                        <div>{e.quantity}</div>
                        <IconButton
                          aria-label="removeQty"
                          size="small"
                          onClick={() => removeQty(e)}
                        >
                          <RemoveRoundedIcon fontSize="small" color="error" />
                        </IconButton>
                      </td>
                      <td className="text-right">{`${(e.price * e.quantity)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="container-bill">
              <table>
                <tbody>
                  <tr>
                    <th className="text-left fill-dot">Tổng</th>
                    <td className="text-right">
                      {`${tmpListFood
                        .reduce(
                          (prev, current) =>
                            prev + current.price * current.quantity,
                          0
                        )
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-left">V.A.T</th>
                    <td className="text-right">
                      {`${"0".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-left">Thanh toán</th>
                    <td className="text-right">
                      {`${tmpListFood
                        .reduce(
                          (prev, current) =>
                            prev + current.price * current.quantity,
                          0
                        )
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                    </td>
                  </tr>
                  <tr className="space"></tr>
                  <tr>
                    <th className="text-left">Khách trả</th>
                    <td className="text-right">
                      {`${"0".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-left">Trả lại</th>
                    <td className="text-right">
                      {`${"0".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    ₫`}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="btnConfirm">
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  onClick={() => onAddNewOrder()}
                  startIcon={<CheckIcon />}
                  disabled={tmpListFood.length === 0 ? true : false}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>

      {/* Modal Food detail */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onModalClose}
        style={modalStyle}
        ariaHideApp={false}
        contentLabel="Example Modal"
      >
        <div className="header">
          <h1>Chi tiết món ăn</h1>
          <IconButton
            aria-label="delete"
            size="small"
            style={{ width: "30px", height: "30px" }}
            onClick={onModalClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <div className="food-modal">
          <div className="content">
            <div className="img">
              <img src={selectedFoods.avtUrl} alt={selectedFoods.avtUrl} />
            </div>
            <div className="title">
              <h1>{selectedFoods?.name}</h1>
              <div className="category">{selectedFoods?.category?.name}</div>
            </div>
            <p>{selectedFoods?.title}</p>
            <div className="btn-size">
              {selectedFoods?.foodDetails?.map((e) => {
                return (
                  <button
                    key={e.id}
                    className={e.foodSize === tmpTextSize ? "selected" : ""}
                    onClick={() => onSelectSize(e)}
                  >
                    {e.foodSize}
                  </button>
                );
              })}
            </div>
            {tmpQty !== 0 && (
              <div className="qty">
                <IconButton
                  aria-label="plusQty"
                  size="small"
                  onClick={() => setTmpQty(tmpQty + 1)}
                >
                  <AddRoundedIcon fontSize="small" color="success" />
                </IconButton>
                <span style={{ padding: "0 5px" }}>{tmpQty}</span>
                <IconButton
                  aria-label="minusQty"
                  size="small"
                  onClick={() => setMinusTmpQty(tmpQty)}
                >
                  <RemoveRoundedIcon fontSize="small" color="error" />
                </IconButton>
              </div>
            )}
          </div>
          <div className="price">
            {selectedSize.length !== 0 && (
              <table>
                <tbody>
                  <tr>
                    <td>Giá</td>
                    <td>
                      {selectedSize.length !== 0
                        ? selectedSize.amount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""}{" "}
                      ₫
                    </td>
                  </tr>
                  <tr style={{ fontStyle: "italic", fontSize: "13px" }}>
                    <td>Khuyến mãi</td>
                    <td>
                      {selectedSize.length !== 0
                        ? selectedSize.discount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""}{" "}
                      %
                    </td>
                  </tr>
                  <tr style={{ fontStyle: "italic", fontSize: "13px" }}>
                    <td style={{ paddingBottom: "10px" }}>Giảm</td>
                    <td>
                      {selectedSize.length !== 0
                        ? (
                            (parseInt(selectedSize.amount, 10) *
                              parseInt(selectedSize.discount, 10)) /
                            100
                          )
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""}{" "}
                      ₫
                    </td>
                  </tr>
                  <tr style={{ borderTop: "1px dashed black" }}>
                    <td style={{ paddingTop: "5px" }}>Số lượng</td>
                    <td>{tmpQty}</td>
                  </tr>
                  <tr>
                    <td>Tổng giá</td>
                    <td>
                      {selectedSize.length !== 0
                        ? (selectedSize.amount * tmpQty)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""}{" "}
                      ₫
                    </td>
                  </tr>
                  <tr style={{ fontStyle: "italic", fontSize: "13px" }}>
                    <td>Tổng giảm</td>
                    <td>
                      {selectedSize.length !== 0
                        ? (
                            ((parseInt(selectedSize.amount, 10) *
                              parseInt(selectedSize.discount, 10)) /
                              100) *
                            tmpQty
                          )
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""}{" "}
                      ₫
                    </td>
                  </tr>
                  <tr
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#d80500",
                    }}
                  >
                    <td>Thành tiền</td>
                    <td>
                      {selectedSize.length !== 0
                        ? (
                            ((parseInt(selectedSize.amount, 10) *
                              (100 - parseInt(selectedSize.discount, 10))) /
                              100) *
                            tmpQty
                          )
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""}{" "}
                      ₫
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ textAlign: "right" }}>
                      <button onClick={addTmpListFood}>Thêm</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            {selectedSize.length === 0 && <i>Hãy chọn loại món trước</i>}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateOrder;

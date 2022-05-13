import { Button, Container, Divider, Grid, Paper, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import BookTableAPI from "../../API/BookTableAPI";
import OrdersAPI from "../../API/OrdersAPI";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import ModalMessage from "../../components/Modal/ModalMessage";

export default function Cart() {
  const navigate = useNavigate();

  const [dataUser, setDataUser] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [foodOrder, setFoodOrder] = useState([]);
  const [sumPrice, setSumPrice] = useState("");
  const [socketUrl, setSocketUrl] = useState("localhost:8787");
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const confirmOrder1 = async (id) => {
    const res = await OrdersAPI.confirmOrder1(id);
    if (res) {
      ModalMessage.middleModal(
        "success",
        "Gửi đơn hàng thành công!",
        "Nhà hàng đang xác nhận, Xin vui lòng đợi!"
      ).then(() => window.location.reload());
    }
  };

  const discount = (price, discount) => {
    return (parseInt(price, 10) * (100 - parseInt(discount, 10))) / 100;
  };

  const fetchData = async () => {
    let countPrice = [];
    let sum = 0;
    const res = await BookTableAPI.getUserBookTable();
    setDataUser(res);
    if (res.length !== 0) {
      setOrderId(res[0].orderTotalId);
    }
    res.forEach((item) => {
      if (item.orderDetails[0]) {
        item.orderDetails.forEach((order) => {
          countPrice.push(order);
          sum += order.foodDetalls.amount;
        });
      }
    });
    setFoodOrder(countPrice);
    setSumPrice(sum);
    console.log(res);
  };

  useEffect(() => {
    fetchData();
    sendMessage("Hello");
  }, []);
  // var stompClient = require('./websocket-listener')

  // const handleClickChangeSocketUrl = useCallback(
  //   () => setSocketUrl('localhost:8787'),
  //   []
  // );

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: 'Connecting',
  //   [ReadyState.OPEN]: 'Open',
  //   [ReadyState.CLOSING]: 'Closing',
  //   [ReadyState.CLOSED]: 'Closed',
  //   [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  // }[readyState];

  return (
    <>
      {dataUser.length === 0 && (
        <Container>
          <div
            className="headtext__cormorant"
            style={{ margin: "100px 0 20px 0" }}
          >
            Giỏ hàng trống
          </div>
          <Button
            onClick={() => navigate("/book-table")}
            variant="contained"
            size="large"
          >
            Đặt bàn ngay
          </Button>
        </Container>
      )}
      {dataUser.length !== 0 && (
        <Container>
          <p style={{ marginTop: "70px" }} className="headtext__cormorant">
            Giỏ hàng
          </p>
          <Grid container>
            <Grid style={{ paddingRight: "20px" }} item xs={8}>
              <Paper elevation={6}>
                {dataUser.map((item, index) => (
                  <Box key={index}>
                    <Stack p={2} spacing={2}>
                      <p style={{ color: "#d9d9d9" }} className="p__cormorant">
                        Bàn {item.tableId}
                      </p>
                      <Divider />
                      {item.orderDetails?.map((item, index) => (
                        <Box
                          key={index + item.id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box
                            sx={{ flex: "0 0 30%" }}
                            display="flex"
                            alignItems="center"
                          >
                            <img
                              style={{
                                minWidth: "80px",
                                maxWidth: "80px",
                                height: "auto",
                                borderRadius: 5,
                                marginRight: 20,
                              }}
                              alt="flex"
                              src={item.foodDetalls.foodMedias[0]?.foodUrl}
                            />
                            <p
                              style={{ textAlign: "center" }}
                              className="cart-text"
                            >
                              {item.foodDetalls.foodName}
                            </p>
                          </Box>
                          <Divider orientation="vertical" flexItem />
                          <p className="cart-text">Số lượng: {item.quantity}</p>
                          <Divider orientation="vertical" flexItem />
                          <p className="cart-text">
                            {item.foodDetalls.discount == 0
                              ? item.foodDetalls.amount + " VND"
                              : discount(
                                  item.foodDetalls.amount,
                                  item.foodDetalls.discount
                                ) + " VND"}
                          </p>
                          <Divider orientation="vertical" flexItem />
                          <p
                            className="cart-text"
                            style={{ color: "green", fontSize: "medium" }}
                          >
                            {item.status}
                          </p>
                          <Divider orientation="vertical" flexItem />
                          <Button
                            color="error"
                            size="small"
                            variant="contained"
                          >
                            Xóa
                          </Button>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={24}>
                <Stack spacing={2} p={2}>
                  <p style={{ textAlign: "center" }} className="cart-text">
                    Chi tiết hoá đơn:
                  </p>
                  <Divider />
                  <Stack spacing={2}>
                    {foodOrder?.map((item, index) => (
                      <Box key={index}>
                        <p className="cart-text">{`${index}, ${
                          item.foodDetalls.foodName
                        } | ${
                          item.foodDetalls.discount == 0
                            ? item.foodDetalls.amount
                            : discount(
                                item.foodDetalls.amount,
                                item.foodDetalls.discount
                              )
                        } * ${item.quantity} = ${
                          item.foodDetalls.discount == 0
                            ? item.foodDetalls.amount * item.quantity
                            : discount(
                                item.foodDetalls.amount,
                                item.foodDetalls.discount
                              ) * item.quantity
                        } VND`}</p>
                      </Box>
                    ))}
                    <Box width="100%" textAlign="center">
                      <Button
                        onClick={() => confirmOrder1(orderId)}
                        variant="contained"
                        color="info"
                        size="big"
                      >
                        Xác nhận đơn hàng
                      </Button>
                    </Box>
                    <Divider />
                    <p
                      style={{ textAlign: "center", color: "#1059f5" }}
                      className="p__cormorant"
                    >
                      Tổng thanh toán:{" "}
                      <span style={{ color: "#dcca87" }}>{sumPrice} VND</span>
                    </p>
                    <Divider />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Button disabled variant="contained" color="success">
                        Thanh toán
                      </Button>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}

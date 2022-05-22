import { Button, Container, Divider, Grid, Paper, Stack,  DialogContent,
  DialogTitle, Dialog,  DialogActions } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import BookTableAPI from "../../API/BookTableAPI";
import OrdersAPI from "../../API/OrdersAPI";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate,useParams } from "react-router-dom";
import ModalMessage from "../../components/Modal/ModalMessage";
import Swal from 'sweetalert2'

export default function Cart() {
  const navigate = useNavigate();
  const [openOrderFood, setOpenOrderFood] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [foodOrder, setFoodOrder] = useState([]);
  const [xacnhanBtn, setXacnhanBtn] = useState(false);
  const [datcocBtn, setDatcocBtn] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [sumPrice, setSumPrice] = useState("");
  const [Orderstatus, setOrderstatus] = useState("");
  const [payman, setpayman] = useState();
  const [sum, setSum] = useState(0);
  const [countPrice, setCountPrice] = useState([])
  const [statusPay, setstatusPay] = useState("");
  const [socketUrl, setSocketUrl] = useState("localhost:8787");
  const [thanhtoan, setthanhtoan] = useState([]);
  const [ngay, setNgay] = useState("");
  const [gioan, setGioan] = useState("");
  const [gioEnd, setGioEnd] = useState("");
  const [tiencoc, setTiencoc] = useState("");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  let { status } = useParams();
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

  const fetchpayment = async () => {
    const data = await OrdersAPI.payman(orderId);
    console.log(data);
    setpayman(data)
  }



  const chapnhan = () => {
    console.log(payman);
    const data = payman;
    if (data.code === '00') {
      console.log(2)
      if (window.vnpay) {
          vnpay.open({width: 768, height: 600, url: x.data});
          console.log("ok1")
      } else {
          window.location.href = data.data;
          console.log("ok2")
      }
      setOpenOrderFood(false);
  }
  };

  const discount = (price, discount) => {
    return (parseInt(price, 10) * (100 - parseInt(discount, 10))) / 100;
  };
  const datcoc = async () => {
    fetchpayment();
    setOpenOrderFood(true);
  };

  const fetchData = async () => {
    const res = await BookTableAPI.getUserBookTable();
    const resOrder= await BookTableAPI.getInforOrder(res[0].orderTotalId)
    const resThanhtoan = await BookTableAPI.getInforThanhtoan(res[0].orderTotalId)
    console.log(resThanhtoan);
    setthanhtoan(resThanhtoan);
    let status1= resOrder.status;
    setNgay(resOrder.ngay)
    setGioan(resOrder.gioan)
    setGioEnd(resOrder.gionghi)
    setTiencoc(resOrder.tiencoc)
    setSum(resOrder.tongtienhoadon);
    
    console.log(res);
    console.log(resOrder);
    if(status1==0){
      setOrderstatus("Vừa thêm vào")
    } else if(status1==1){
      setOrderstatus("Chờ xác nhận")
    }
    else if(status1==2){
      setOrderstatus("Chờ đặt cọc")
    }
    else if(status1==3){
      setOrderstatus("Chờ xác nhận đặt cọc")
    }
    else if(status1==4){
      setOrderstatus("Chờ bạn đến nhà hàng")
    }
    else if(status1==5){
      setOrderstatus("Đang ăn")
    }
    if (res.length !== 0) {
      setDataUser(res);

      // Set sum & countPrice
      let countXacnhan = 0;
      let countDatcoc = 0;
      let sumI = 0
      let tempOrder = [];
      res[0].orderDetails.map((e)=>{
        sumI+=(discount(
          e.foodDetalls.amount,
          e.foodDetalls.discount
        ))*+e.quantity;

        if (e.status==="Vừa thêm vào") {
          countXacnhan++;
        }
        if (e.status==="Đã xác nhận") {
          countDatcoc++;
        }

        tempOrder.push(e);
      })
      
      setFoodOrder(tempOrder);
      setOrderId(res[0].orderTotalId);
      setSumPrice(sumI);

      if(countXacnhan > 0) {
        setXacnhanBtn(true);
      }
      if(true) {
        setDatcocBtn(true);
      }
    }
  };

  useEffect(() => {
    console.log(status);
    if(status==='SUCCESS'){
      Swal.fire({
        title: 'Thành công!',
        text: 'Thanh toán đơn hàng thành công',
        icon: 'succes',
        confirmButtonText: 'Đóng'
      })
    }else  if(status==='FAIL'){
      Swal.fire({
        title: 'Lỗi!',
        text: 'Thanh toán thất bại',
        icon: 'error',
        confirmButtonText: 'Đóng'
      })
    }
    fetchData();
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
                <p style={{ textAlign: "center" , fontWeight: 'bold', color : 'white',fontSize: 'large'}} className="cart-text">
                    Thời gian đặt: Ngày: {ngay} <br/> từ {gioan} đến {gioEnd}
                  </p>
                <p style={{ textAlign: "center" , fontWeight: 'bold', color : 'green',fontSize: 'large'}} className="cart-text">
                    Trạng thái: {Orderstatus}
                  </p>
                  <p style={{ textAlign: "center" }} className="cart-text">
                    Chi tiết hoá đơn:
                  </p>
                  <Divider />
                  <Stack spacing={2}>
                    {thanhtoan?.map((item, index) => (
                      <Box key={index}>
                        <p className="cart-text">{`${index+1}, ${item.foodName} | size ${item.foodSize} | ${item.amountTotal} x ${item.sl} = ${item.tongtien} VND`}</p>
                      </Box>
                    ))}
                    {xacnhanBtn && (<Box id="confirm" width="100%" textAlign="center">
                      <Button
                        onClick={() => confirmOrder1(orderId)}
                        variant="contained"
                        color="info"
                        size="big"
                      >
                        Xác nhận đơn hàng
                      </Button>
                    </Box>)}
                    <Divider />
                    {datcocBtn && (<Box id="datcoc" width="100%" textAlign="center">
                      <Button
                        onClick={() => datcoc()}
                        variant="contained"
                        color="info"
                        size="big"
                      >
                        Đặt cọc
                      </Button>
                    </Box>)}
                    <Divider />
                    <p
                      style={{ textAlign: "center", color: "#1059f5" }}
                      className="p__cormorant"
                    >
                      Tổng thanh toán:{" "}
                      <span style={{ color: "#dcca87" }}>{sum} VND</span>
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
        {openOrderFood && (
        <Dialog open={openOrderFood} onClose={() => setOpenOrderFood(false)}>
          <DialogTitle sx={{ textAlign: "center",width : '550px',height: '270px', backgroundColor: 'LightYellow' }}>
            <h2 style={{ textAlign: "center",color :'black',fontWeight: 'bold'}}>Xac nhan dat coc</h2>
            <br />
            <h2 style={{ textAlign: "center",color :'black',fontWeight: 'bold'}}>Bạn cần đặt cọc {tiencoc} vnd</h2>
            <h4 style={{ textAlign: "center",color :'black',fontWeight: 'bold'}}>Hoặc Thanh toán online qua VNPAY</h4>
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpenOrderFood(false)}  >Hủy</Button>
            <Button  onClick={() => chapnhan()} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

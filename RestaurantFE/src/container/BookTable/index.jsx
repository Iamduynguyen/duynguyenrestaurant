import {
  Container,
  Grid,
  Typography,
  TextField,
  Stack,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
import { MobileTimePicker } from "@mui/lab";
import styles from "./BookTable.module.css";
import TableBarIcon from "@mui/icons-material/TableBar";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import TableAPI from "../../API/TableAPI";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import BookTableAPI from "../../API/BookTableAPI";
import "./style.css";
import Swal from 'sweetalert2'


export default function BookTable() {
  const navigation = useNavigate();
  const [OrderDate, setOrderDate] = useState(moment());
  const newtime = new Date();
  const [TimstammStart, setTimstammStart] = useState();
  const [TimstammEnd, setTimstammEnd] = useState();
  var now = newtime;
// var fourHoursLater = now.addHours(4);
function addHoursToDate(date, hours) {
  return new Date(new Date(date).setHours(date.getHours() + hours));
}


  const [OrderTime, setOrderTime] = useState(
    moment(newtime)
  );
  var x = addHoursToDate(new Date(OrderTime),3)
  const [Endtime, setEndtime] = useState(
    moment(x)
  );

  
  const [SelectedTable, setSelectedTable] = useState([]);
  const [table, setTable] = useState();
  const [Order, setOrder] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  useEffect(() => {
    const fetchData = async () => {
      var time = new Date().getTime();
      const res = await TableAPI.getTableByTime(time);
      console.log(time);
      setTable(res);
      console.log(res);
    };
    fetchData();
  }, []);

  const gettime = async () => {
    console.log("start"+OrderTime);
    console.log("end"+Endtime);
    const timeOrder = convertdateandtimetotimstamp(OrderDate,OrderTime);
    const timeEnd = convertdateandtimetotimstamp(OrderDate,Endtime);
    console.log(timeOrder+'\t'+timeEnd);
    console.log(new Date(OrderTime).getHours());
    if(new Date(OrderTime).getHours()<9 ||new Date(Endtime).getHours()<9 || new Date(OrderTime).getHours()>23||new Date(Endtime).getHours()>23){
      Swal.fire({
        title: 'Lỗi!',
        text: 'Nhà hàng chỉ mở của từ 9h đến 23h \n Vui long chon lai',
        icon: 'error',
        confirmButtonText: 'Đóng'
      })
    }else{
      const res = await TableAPI.getTableByStartandEnd(timeOrder,timeEnd);
    if(res){
      setTable(res);
      setOrder(true)
    }
    }
    
  }

  const setDate = async (e) => {
    setOrderDate(new Date(e));
  }

  const setTimeStart = async (e) => {
    setOrderTime(new Date(e));
    setEndtime(addHoursToDate(new Date(e),3))
    console.log(OrderTime);
    console.log(Endtime);
  }

  const setTimeEnd = async (e) => {
    setEndtime(new Date(e));
    // setOrderTime(addHoursToDate(new Date(e),-3))
    console.log(OrderTime);
    console.log(Endtime);
  }
  function convertdateandtimetotimstamp(date,time) {
    console.log(date);
    console.log(new Date(date));
    var x = new Date(date).getFullYear()+'/'+(new Date(date).getMonth()+1)+'/'+new Date(date).getDate();
    var y = new Date(time).getHours()+':'+new Date(time).getMinutes()+':'+'00';
    console.log(x+''+y);
    console.log(new Date(x+' '+y));
    return new Date(x+' '+y).getTime();
  }

  const confirmBookTables = async () => {
    const timeOrder = convertdateandtimetotimstamp(OrderDate,OrderTime);
    const timeEnd = convertdateandtimetotimstamp(OrderDate,Endtime);
    console.log(timeOrder+" |time ne| "+timeEnd);
    const dataBookTables = SelectedTable.map((table) => {
      return {
        tableId: table,
        orderTime: timeOrder,
        endTime: timeEnd
      };
    });
    const res = await BookTableAPI.bookTable(dataBookTables);
    console.log(res);
    if(res.data=="Table are using!"){
      Swal.fire({
        title: 'Lỗi!',
        text: 'Bàn này đã được đặt trước, vui lòng chọn lại!',
        icon: 'error',
        confirmButtonText: 'Đóng'
      })
    }
    if(res.data==4){
      Swal.fire({
        title: 'Lỗi!',
        text: 'Đặt bàn thất bại!',
        icon: 'error',
        confirmButtonText: 'Đóng'
      })
    }
    console.log(res);
    // if(res){
    //   Swal.fire({
    //     title: 'Thành công!',
    //     text: 'Đặt bàn thành công \n hãy chọn món!',
    //     icon: 'success',
    //     confirmButtonText: 'Đóng'
    //   })
    //   // window.location.href = '/menu';
    // }
  };

  return (
    <div className="mb-[50px]">
      {/* <Container className="pt-[80px] "> */}
      {/* <Grid container> */}
      <Grid item xs={12}>
        <div className="book-table-top pt-[90px] pb-[50px]">
          <Container>
            <p className="headtext__cormorant text-center " variant="h4">
              Book a Table
            </p>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <Stack mt={3} direction="row" spacing={2}>
                <Box>
                  <MobileDatePicker
                    label="Chọn ngày đặt"
                    inputFormat="DD/MM/YYYY"
                    value={OrderDate}
                    onChange={(newValue) => setDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
                <Box>
                  <MobileTimePicker
                    label="Chọn giờ đặt"
                    value={OrderTime}
                    onChange={(newValue) => setTimeStart(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
                <Box>
                  <MobileTimePicker
                    label="Giờ kết thúc"
                    value={Endtime}
                    onChange={(newValue) => setTimeEnd(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </Stack>
            </LocalizationProvider>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ color: "white", background: "#42a5f5" }}
                onClick={() => gettime()}
              >
                Xác nhận thời gian trên
              </Button>
            </Box>
          </Container>
        </div>

        <Container>
          {Order && (
            <Stack spacing={2}>
              <Typography variant="h5">Chọn bàn còn trống:</Typography>
              <Box
                style={{
                  backgroundColor: "white",
                  boxShadow: "#D4D4D4 -1px 5px 8px 3px",
                  borderRadius: 10,
                }}
              >
                {SelectedTable[0] ? (
                  <Typography
                    variant="h5"
                    mt={2}
                    textAlign="center"
                    color="black"
                  >
                    Đang chọn bàn {SelectedTable.join(", ")}
                  </Typography>
                ) : null}
                <Grid p={3} container>
                  {table?.map((item) => (
                    <Box
                      key={item.id}
                      m={isMobile ? 2 : 4}
                      className={
                        item.status === 0
                          ? `${styles.TableIlu}`
                          : `${styles.TableIlu} ${styles.disabled}`
                      }
                      textAlign="center"
                      onClick={() =>
                        setSelectedTable(
                          item.status === 0 && !SelectedTable.includes(item.id)
                            ? (preState) => [...preState, item.id]
                            : (preState) => [
                                ...preState.filter((i) => i !== item.id),
                              ]
                        )
                      }
                    >
                      {SelectedTable.includes(item.id) ? (
                        <DoneOutlineRoundedIcon
                          className={styles.doneOutlineRounded}
                        />
                      ) : null}
                      <Typography color="Black">Bàn {item.id}</Typography>
                      <TableBarIcon sx={{ fontSize: 50, mt: 1 }} />
                      <Typography color="Black" variant="subtitle2">
                        Số Ghế: {item.numberOfChair}
                      </Typography>
                      <Typography
                        color="Black"
                        mt={3}
                        className={styles.OrderNow}
                      >
                        Order Now!
                      </Typography>
                    </Box>
                  ))}
                </Grid>
              </Box>
              {SelectedTable[0] && (
                <>
                  <Typography variant="h5">Thông tin khách hàng:</Typography>
                  <Stack justifyContent="space-between" direction="row">
                    <TextField
                      sx={{ width: "30%" }}
                      id="HVT"
                      label="Họ và tên"
                      variant="standard"
                      required
                    />
                    <TextField
                      sx={{ width: "30%" }}
                      id="SDT"
                      label="Số điện thoại"
                      variant="standard"
                      required
                    />
                    <TextField
                      sx={{ width: "30%" }}
                      id="Email"
                      label="Email"
                      variant="standard"
                    />
                  </Stack>
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      sx={{ color: "white", width: "150px", height: "40px" }}
                      onClick={confirmBookTables}
                    >
                      Đặt bàn
                    </Button>
                  </Box>
                </>
              )}
            </Stack>
          )}
        </Container>
      </Grid>
      {/* </Grid> */}
      {/* </Container> */}
    </div>
  );
}

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
  const [OrderTime, setOrderTime] = useState(
    moment("2018-01-01T00:00:00.000Z")
  );
  const [endtime, setEndtime] = useState(
    moment("2018-01-01T00:00:00.000Z")
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
  const confirmBookTables = async () => {
    const timeOrder = new Date(
      OrderDate.format("L") + " " + OrderTime.format("LTS")
    ).getTime();
    const timeEnd = new Date(
      OrderDate.format("L") + " " + endtime.format("LTS")
    ).getTime();
    const dataBookTables = SelectedTable.map((table) => {
      return {
        tableId: table,
        orderTime: timeOrder,
        endtime: endtime
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
                    onChange={(newValue) => setOrderDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
                <Box>
                  <MobileTimePicker
                    label="Chọn giờ đặt"
                    value={OrderTime}
                    onChange={(newValue) => setOrderTime(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
                <Box>
                  <MobileTimePicker
                    label="Giờ kết thúc"
                    value={endtime}
                    onChange={(newValue) => setEndtime(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </Stack>
            </LocalizationProvider>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{ color: "white", background: "#42a5f5" }}
                onClick={() => setOrder(true)}
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

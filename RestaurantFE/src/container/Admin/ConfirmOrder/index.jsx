import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useWebSocket from 'react-use-websocket';
import React, { useEffect, useState } from "react";
import BookTableAPI from "../../../API/BookTableAPI";

export default function ConfirmOrder() {
  const [userOrder, setUserOrder] = useState([]);
  const socketUrl = 'wss://echo.websocket.org';
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });
  useEffect(() => {
    let tempUserOrder = [];
    const fetchData = async () => {
      const res = await BookTableAPI.getUserBookTable();
      res.forEach((item) => {
        if (item.orderDetails[0]) {
          tempUserOrder.push(item);
        }
      });
      setUserOrder(tempUserOrder);
      console.log(tempUserOrder);
    };
    fetchData();
  }, []);
  return (
    <Grid container>
      <Grid item xs={12} p={2}>
        <InfoOrder userOrder={userOrder} />
      </Grid>
    </Grid>
  );
}

const InfoOrder = ({ userOrder }) => {
  const [openDLTableDetails, setOpenDLTableDetails] = useState(false);
  const [selectOrderTotal, setSelectOrderTotal] = useState();
  const [orderDetails, setOrderDetails] = useState();
  const handleOpenDLTableDetails = (detail) => {
    setSelectOrderTotal(detail);
    setOpenDLTableDetails(true);
  };
  const ConfirmOrder = async (item) => {
    setOpenDLTableDetails(false);
    setOrderDetails(item);
    const data = {
      foodDetalls: orderDetails.foodDetalls,
      quantity: orderDetails.quantity,
      status: 2,
      tableOrderId: orderDetails.tableOrderId,
    };
    const res = await BookTableAPI.changeStatusOrder(orderDetails.id, data);
    console.log(res);
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Typography variant="h6" py={2} textAlign="center">
          Kh??ch 1002 ?????t
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">B??n</TableCell>
              <TableCell align="center">S??? m??n v???a ???????c th??m</TableCell>
              <TableCell align="center">Chi Ti???t</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userOrder?.map((item, i) => (
              <TableRow
                key={i}
                component="th"
                scope="row"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">
                  <Typography>{item.tableId}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{item.orderDetails.length} M??n</Typography>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleOpenDLTableDetails(item)}
                  >
                    Xem chi ti???t
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDLTableDetails}
        onClose={() => setOpenDLTableDetails(false)}
      >
        <DialogTitle>
          C??c m??n v???a ???????c th??m tr??n b??n {selectOrderTotal?.tableId}
        </DialogTitle>
        <DialogContent>
          <Stack minWidth={550} spacing={2} my={2}>
            {selectOrderTotal?.orderDetails.map((item, index) => (
              <Grid container>
                <Grid textAlign="center" item xs={5}>
                  <Typography>M??n: {item.foodDetalls.foodName}</Typography>
                </Grid>
                <Grid textAlign="center" item xs={2}>
                  <Typography>Size: {item.foodDetalls.foodSize}</Typography>
                </Grid>
                <Grid textAlign="center" item xs={2}>
                  <Typography>SL: {item.quantity}</Typography>
                </Grid>
                <Grid display="flex" justifyContent="flex-end" item xs={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => ConfirmOrder(item)}
                  >
                    X??c nh???n
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDLTableDetails(false)}>B???</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

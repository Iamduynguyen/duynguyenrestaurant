import {
  Alert,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Slide,
  Stack,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import BookTableAPI from '../../API/BookTableAPI';

export default function Cart() {
  const [dataUser, setDataUser] = useState([]);
  const [foodOrder, setFoodOrder] = useState([]);
  const [sumPrice, setSumPrice] = useState('');
  const [alert, setAlert] = useState(false);
  const discount = (price, discount) => {
    return (parseInt(price, 10) * (100 - parseInt(discount, 10))) / 100;
  };
  const openAlert = () => {
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  };
  useEffect(() => {
    const fetchData = async () => {
      let countPrice = [];
      let sum = 0;
      const res = await BookTableAPI.getUserBookTable();
      setDataUser(res);
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
    fetchData();
  }, []);
  return (
    <Container>
      <p style={{ margin: '20px 0' }} className='headtext__cormorant'>
        Giỏ hàng
      </p>
      <Grid container>
        <Grid item xs={8}>
          <Paper elevation={6}>
            {dataUser.map((item, index) => (
              <Box key={index}>
                <Stack p={2} spacing={2}>
                  <p className='p__cormorant'>Table {item.tableId}</p>
                  <Divider />
                  {item.orderDetails?.map((item, index) => (
                    <Box
                      key={index + item.id}
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                    >
                      <Box
                        sx={{ flex: '0 0 30%' }}
                        display='flex'
                        alignItems='center'
                      >
                        <img
                          style={{
                            width: 100,
                            height: 70,
                            borderRadius: 5,
                            marginRight: 20,
                          }}
                          alt='flex'
                          src={item.foodDetalls.foodMedias[0]?.foodUrl}
                        />
                        <p
                          style={{ textAlign: 'center' }}
                          className='p__cormorant'
                        >
                          {item.foodDetalls.foodName}
                        </p>
                      </Box>
                      <Divider orientation='vertical' flexItem />
                      <p className='p__cormorant'>Số lượng: {item.quantity}</p>
                      <Divider orientation='vertical' flexItem />
                      <p className='p__cormorant'>
                        {item.foodDetalls.discount == 0
                          ? item.foodDetalls.amount + ' VND'
                          : discount(
                              item.foodDetalls.amount,
                              item.foodDetalls.discount,
                            ) + ' VND'}
                      </p>
                      <Divider orientation='vertical' flexItem />
                      <p className='p__cormorant' style={{color: "green", fontSize: "medium"}}>
                        {item.status}
                      </p>
                      <Divider orientation='vertical' flexItem />
                      <Button
                        sx={{ transform: 'translateX(-20px)' }}
                        color='error'
                        size='small'
                        variant='contained'
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
              <p style={{ textAlign: 'center' }} className='p__cormorant'>
                Tổng thanh toán:
              </p>
              <Divider />
              <Stack spacing={2}>
                {foodOrder?.map((item, index) => (
                  <Box key={index}>
                    <p className='p__cormorant'>{`${index}, ${
                      item.foodDetalls.foodName
                    } | ${
                      item.foodDetalls.discount == 0
                        ? item.foodDetalls.amount
                        : discount(
                            item.foodDetalls.foodDetalls.amount,
                            item.foodDetalls.discount,
                          )
                    } * ${item.quantity} = ${
                      item.foodDetalls.discount == 0
                        ? item.foodDetalls.amount * item.quantity
                        : discount(
                            item.foodDetalls.amount,
                            item.foodDetalls.discount,
                          ) * item.quantity
                    } VND`}</p>
                  </Box>
                ))}
                <Box width='100%' textAlign='center'>
                  <Button
                    onClick={openAlert}
                    variant='contained'
                    color='info'
                    size='small'
                  >
                    <p style={{ fontSize: 20 }} className='p__cormorant'>
                      Xác nhận đơn hàng
                    </p>
                  </Button>
                </Box>
                <Divider />
                <p style={{ textAlign: 'center' }} className='p__cormorant'>
                  Tổng thanh toán:{' '}
                  <span style={{ color: '#dcca87' }}>{sumPrice} VND</span>
                </p>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Button disabled variant='contained' color='success'>
                    <p className='p__cormorant'>Thanh toán</p>
                  </Button>
                </Box>
              </Stack>
            </Stack>
            <Slide direction='left' in={alert} mountOnEnter unmountOnExit>
              <Alert
                sx={{ position: 'fixed', top: 100, right: 20 }}
                onClose={() => setAlert(false)}
                severity='success'
              >
                <span
                  style={{ fontSize: 18, lineHeight: 1.1 }}
                  className='p__cormorant'
                >
                  <p>Gửi đơn hàng thành công!</p>
                  <p>Nhà hàng đang xác nhận, Xin vui lòng đợi!</p>
                </span>
              </Alert>
            </Slide>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

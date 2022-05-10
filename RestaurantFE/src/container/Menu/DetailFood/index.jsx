import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { margin } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import BookTableAPI from "../../../API/BookTableAPI";
import FoodsApi from "../../../API/FoodsAPI";
import SubHeading from "../../../components/SubHeading/SubHeading";
import styles from "../menu.module.css";
import "./../style.css";

export default function DetailFood() {
  const [FoodsData, setFoodsData] = useState("");
  const [FoodDetailData, setFoodDetailData] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [allFoodsData, setAllFoodsData] = useState([]);
  const [openOrderFood, setOpenOrderFood] = useState(false);
  const [addFoodToTable, setAddFoodToTable] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const discount = (price, discount) => {
    return (parseInt(price, 10) * (100 - parseInt(discount, 10))) / 100;
  };
  const addFood = (e, food) => {
    if (e.target.checked) {
      setAddFoodToTable([...addFoodToTable, food.id]);
    } else {
      setAddFoodToTable(addFoodToTable.filter((item) => item !== food.id));
    }
  };
  const confirmOrderFoods = async () => {
    setOpenOrderFood(false);
    const order = addFoodToTable.map((item) => {
      return {
        quantity: 1,
        tableOrderId: item,
        foodDetalls: {
          id: FoodDetailData.id,
        },
      };
    });
    const res = await BookTableAPI.ordersDetails(order);
    console.log(order);
    setAddFoodToTable([]);
  };
  let { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: 0,
        size: 6,
      };
      const res = await FoodsApi.getFoodById(id);
      const res1 = await FoodsApi.getAllFoods(params);
      setFoodsData(res);
      setFoodDetailData(res.foodDetails[0]);
      setAllFoodsData(res1);
      console.log(res);
      console.log(res1);
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchDataUserOrder = async () => {
      const res = await BookTableAPI.getUserBookTable();
      setUserOrder(res);
      console.log(res);
    };
    fetchDataUserOrder();
  }, []);
  return (
    <Container className="pt-[70px]">
      {FoodsData && (
        <Grid container mt={1} spacing={10}>
          <Grid item xs={6}>
            <Box>
              <Swiper
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                  borderRadius: 10,
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
              >
                {FoodDetailData?.foodMedias?.map((item, index) => (
                  <SwiperSlide key={index}>
                    <img
                      style={{ height: "100%", width: "100%" }}
                      alt={FoodsData.name}
                      src={item.foodUrl}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={5}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                style={{ borderRadius: 10, maxWidth: "80%", margin: "0px" }}
              >
                {FoodDetailData?.foodMedias?.map((item, i) => (
                  <SwiperSlide
                    key={i}
                    style={{ height: "70px", width: "70px" }}
                  >
                    <img
                      style={{
                        height: "70px",
                        width: "70px",
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                      alt={FoodsData.name}
                      src={item.foodUrl}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Grid>
          <div className=" mt-[70px]  ">
            <div className="pl-[80px] ">
              <p className="text-[36px] font-medium text-[#F8B400]">
                {FoodsData?.name}
              </p>
              <div className="">
                {FoodDetailData?.discount == 0 ? (
                  <Box display="flex" alignItems="flex-end">
                    <p
                      className={`p__cormorant ${styles?.price}`}
                      style={{ textAlign: "left" }}
                    >
                      {FoodDetailData?.amount} VND
                    </p>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="flex-end">
                    <p
                      className={`p__cormorant ${styles?.price}`}
                      style={{
                        textAlign: "left",
                        transform: "translateY(-5px)",
                        color: "#ff000099",
                      }}
                    >
                      {discount(
                        FoodDetailData?.amount,
                        FoodDetailData?.discount
                      )}{" "}
                      VND
                    </p>
                    <p
                      className={`p__cormorant ${styles.discountText}`}
                      style={{
                        textAlign: "left",
                        marginRight: "10px",
                        textDecoration: "line-through",
                        color: "gray",
                        marginLeft: "15px",
                      }}
                    >
                      {FoodDetailData?.amount} VND
                    </p>
                  </Box>
                )}
              </div>
              <p className="text-[16px] text-[#999] mt-[20px] italic" style={{maxWidth: '530px'}}>
                {FoodsData?.title}
              </p>
              <div className="mt-[30px]">
                <p className="font-medium mb-2">SIZE:</p>
                {FoodsData?.foodDetails?.map((item, i) => (
                  <Button
                    key={i}
                    sx={{
                      mr: 2,
                      mb: 2,
                      position: "relative",
                      padding: 0,
                    }}
                    size="small"
                    variant={
                      item.id == FoodDetailData?.id ? "contained" : "outlined"
                    }
                    onClick={() => setFoodDetailData(item)}
                  >
                    <p style={{ fontSize: 11 }} className="p__cormorant">
                      {item?.foodSize}
                    </p>
                    {item.discount != 0 ? (
                      <Box
                        className="p__cormorant"
                        style={{
                          fontSize: 9,
                          lineHeight: 1,
                          position: "absolute",
                          top: "0",
                          right: "0",
                        }}
                      >
                        {item?.discount}%
                      </Box>
                    ) : null}
                  </Button>
                ))}
              </div>
              <div className="mt-[30px]">
                <button
                  onClick={() => setOpenOrderFood(true)}
                  className="bg-[#2e7ebb] hover:bg-[#2c6a9a] flex items-center text-white rounded-[3px] px-[15px] py-[7px]"
                  // style
                >
                  <p style={{ fontSize: 15 }} className="mr-1">
                    Thêm vào giỏ hàng
                  </p>
                  <span>
                    <AddShoppingCartIcon style={{ width: 20 }} />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* <Grid item xs={6}>
            <Stack spacing={4}>
              <p className="headtext__cormorant">{FoodsData?.name}</p>
              <Typography sx={{ color: "#999" }} fontSize={20}>
                {FoodsData?.title}
              </Typography>
              {FoodDetailData?.discount == 0 ? (
                <Box display="flex" alignItems="flex-end">
                  <p
                    className={`p__cormorant ${styles?.price}`}
                    style={{ textAlign: "left" }}
                  >
                    {FoodDetailData?.amount} VND
                  </p>
                </Box>
              ) : (
                <Box display="flex" alignItems="flex-end">
                  <p
                    className={`p__cormorant ${styles.discountText}`}
                    style={{
                      textAlign: "left",
                      marginRight: "10px",
                      textDecoration: "line-through",
                    }}
                  >
                    {FoodDetailData?.amount} VND
                  </p>
                  <p
                    className={`p__cormorant ${styles?.price}`}
                    style={{
                      textAlign: "left",
                      transform: "translateY(-5px)",
                    }}
                  >
                    {discount(FoodDetailData?.amount, FoodDetailData?.discount)}{" "}
                    VND
                  </p>
                </Box>
              )}
              <Box>
                <p
                  className="p__cormorant"
                  style={{ fontSize: 15, marginBottom: 10 }}
                >
                  SIZE:
                </p>
                {FoodsData?.foodDetails?.map((item, i) => (
                  <Button
                    key={i}
                    sx={{ mr: 2, mb: 2, position: "relative" }}
                    size="small"
                    variant={
                      item.id == FoodDetailData?.id ? "contained" : "outlined"
                    }
                    color="success"
                    onClick={() => setFoodDetailData(item)}
                  >
                    <p style={{ fontSize: 15 }} className="p__cormorant">
                      {item?.foodSize}
                    </p>
                    {item.discount != 0 ? (
                      <Box
                        className="p__cormorant"
                        style={{
                          fontSize: 11,
                          lineHeight: 1,
                          position: "absolute",
                          top: "0",
                          right: "0",
                        }}
                      >
                        {item?.discount}%
                      </Box>
                    ) : null}
                  </Button>
                ))}
              </Box>
            </Stack>
            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button
                onClick={() => setOpenOrderFood(true)}
                endIcon={<AddShoppingCartIcon sx={{ color: "#fff" }} />}
              >
                <p style={{ fontSize: 15 }} className="p__cormorant">
                  Thêm vào giỏ hàng
                </p>
              </Button>
            </Box>
          </Grid> */}
          <Box mt={10} sx={{ transform: "translateX(6%)" }} width="95%">
            <SubHeading
              classText="text-xl font-medium text-black"
              title="Tham khảo các món khác từ nhà hàng"
            />
            {allFoodsData && (
              <Swiper
                slidesPerView={3}
                spaceBetween={30}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {allFoodsData.map((item, i) => (
                  <SwiperSlide key={i} className="pb-[40px] px-[10px]">
                    <Card
                      className={styles.CardFood}
                      sx={{
                        minHeight: 450,
                        position: "relative",
                        backgroundColor: "white",
                      }}
                    >
                      {item.foodDetails[0]?.discount != 0 ? (
                        <Box className={styles.discountIcon}>
                          {item.foodDetails[0]?.discount}%
                        </Box>
                      ) : null}
                      <div className="block_img">
                        <CardMedia
                          className={styles.CardFoodMedia}
                          component="img"
                          height="220"
                          image={item.foodDetails[0]?.foodMedias[0]?.foodUrl}
                          alt={item.title}
                        />
                      </div>
                      <CardContent>
                        <p
                          className="p__cormorant "
                          style={{ color: "#fac343" }}
                        >
                          {item.name}
                        </p>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "rgb(94, 92, 92)",
                            textAlign: "center",
                            fontSize: "13px",
                          }}
                          color="text.secondary"
                          mt={1}
                          height={40}
                        >
                          {item.title}
                        </Typography>
                        <div className="block_price">
                          <p className={`p__cormorant ${styles.price}`}>
                            {item.foodDetails[0]?.discount != 0
                              ? discount(
                                  item.foodDetails[0]?.amount,
                                  item.foodDetails[0]?.discount
                                ) + " VND"
                              : item.foodDetails[0]?.amount + " VND"}
                          </p>
                          <p
                            className={`p__cormorant ${styles.discountText} ${
                              item.foodDetails[0]?.discount != 0
                                ? styles.discountPrice
                                : ""
                            }`}
                          >
                            {item.foodDetails[0]?.discount != 0
                              ? item.foodDetails[0]?.amount + " VND"
                              : ""}
                          </p>
                        </div>
                      </CardContent>
                      <CardActions>
                        <Link to={`/menu/${item.id}`}>
                          <Button
                            size="small"
                            sx={{
                              position: "absolute",
                              bottom: 10,
                              border: "1px solid #7581f8",
                              transform: "translateY(-20%)",
                              padding: "0px",
                            }}
                          >
                            <p
                              style={{ fontSize: "13px", color: "#7581f8" }}
                              className="p__cormorant btn_item"
                            >
                              Xem thêm
                            </p>
                          </Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Box>
        </Grid>
      )}
      <Dialog open={openOrderFood} onClose={() => setOpenOrderFood(false)}>
        <DialogTitle sx={{ textAlign: "center" }}>
          <p
            className="p__cormorant"
            style={{ lineHeight: 1.5 }}
          >{`Thêm món ${FoodsData.name}, Size ${FoodDetailData?.foodSize} vào bàn đã đặt`}</p>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%" }}>
            {userOrder?.map((item, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox onChange={(e) => addFood(e, item)} />}
                label={`Bàn ${item?.tableId}`}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrderFood(false)}>Disagree</Button>
          <Button onClick={confirmOrderFoods} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

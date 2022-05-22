import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import FoodsApi from "../../API/FoodsAPI";
import MenuHeaderImage from "../../assets/MenuHeader.jpg";
import SubHeading from "../../components/SubHeading/SubHeading";
import styles from "./menu.module.css";
import "./style.css";
import CategoryAPI from "../../API/CategoriesAPI";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [FoodsData, setFoodsData] = useState([]);
  const [NumberPage, setNumberPage] = useState(0);
  const [page, setPage] = useState(0);
  const [query, setquery] = useState('');
  const discount = (price, discount) => {
    return (parseInt(price, 10) * (100 - parseInt(discount, 10))) / 100;
  };
  const params = {
    page: page,
    size: 6,
  };
  const handleChangePage = (e, value) => {
    setPage(value - 1);
    window.scrollTo(0, 500);
  };
  const fetchData = async () => {
    const res = await FoodsApi.getAllFoods(params);
    setFoodsData(res);
    console.log(res);
    const res1 = await FoodsApi.getPageFoods();
    setNumberPage(Math.floor(res1.totalElement / 6 + 1));
  };

  const changeData = async (query) => {
    const res = await FoodsApi.getByquery(query,params);
    setFoodsData(res);
    console.log(res);
    const res1 = await FoodsApi.getPageFoods();
    setNumberPage(Math.floor(res1.totalElement / 6 + 1));
  };

  const search = (e) => {
    var query = e.target.value;
    console.log(query);
    if(query===''){
      fetchData();
    }else{
      changeData(query);
    }
  };

  const choseCategory = (id) => {
    if(id<0){
      fetchData();
    }else{
      changeData(id);
    }
  };

  const fetchcategory = async () => {
    const res = await CategoryAPI.getAllCategories();
    setCategories(res);
  };
  useEffect(() => {
    fetchcategory();
    fetchData();
  }, [page]);
  return (
    <>
      <Box className={styles.HeaderImage}>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 2400,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay]}
        >
          <SwiperSlide>
            <img
              src={MenuHeaderImage}
              style={{ width: "100%", height: "100%" }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={MenuHeaderImage}
              style={{ width: "100%", height: "100%" }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={MenuHeaderImage}
              style={{ width: "100%", height: "100%" }}
            />
          </SwiperSlide>
        </Swiper>
        <Box position="absolute" className={styles.HeaderText}>
          <p style={{ textAlign: "center" }} className="headtext__cormorant">
            Menu
          </p>
          <SubHeading
            classText="text-xl font-medium text-white"
            title="Thưởng thức các món ăn tuyệt vời!"
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <p
          className="p__cormorant"
          style={{
            marginTop: 30,
            textAlign: "center",
            color: "#000000a8",
            fontSize: "26px",
          }}
        >
          Tất cả các món được chọn lọc và thiết kế từ nhà hàng
        </p>
      </Box>
      <Container>
      <div className="container-categories">
           <button onClick={()=>choseCategory(-1)}>
                TẤT CẢ
              </button>
              {categories.map((e) => {
                return (
                  <button
                  onClick={()=>choseCategory(e.id)}
                    key={e.id}>
                    {e.name}
                  </button>
                );
              })}
              <input style={{width:'250px',boxSizing:'border-box', border:'solid white 2px', backgroundColor:'white', paddingLeft:'10px',marginLeft:'120px',borderRadius:'8px'}}
              className='form-control' onChange={(Event)=>search(Event)} type="text" placeholder="nhập ..." />
            </div>
            <div>
              
            </div>
        <Grid container spacing={5} mt={4} >
          {FoodsData?.map((item, index) => (
            <Grid item key={index} md={4} sm={6} xs={12}>
              <Card
                className={styles.CardFood}
                sx={{
                  minHeight: 450,
                  height: '100%',
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
                  onClick={() => navigate(`/menu/${item.id}`)}
                    className={styles.CardFoodMedia}
                    component="img"
                    height="220"
                    image={item.foodDetails[0]?.foodMedias[0]?.foodUrl}
                    alt={item.title}
                  />
                </div>
                <CardContent style={{marginBottom: '80px'}}>
                  <p className="p__cormorant " style={{ color: "#fac343" }}>
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
                    height={'40'}
                  >
                    {item.title}
                  </Typography>
                </CardContent>

                <div>
                  <div className="" style={{ position: "absolute", bottom: 0 }}>
                    <div style={{marginLeft: '20px'}}>
                    <span className={`${styles.price}`}>
                      {item.foodDetails[0]?.discount != 0
                        ? discount(
                          item.foodDetails[0]?.amount,
                          item.foodDetails[0]?.discount
                        ) + " VND"
                        : item.foodDetails[0]?.amount + " VND"}
                    </span> &ensp;
                    <span
                      className={`${styles.discountText} ${item.foodDetails[0]?.discount != 0
                          ? styles.discountPrice
                          : ""
                        }`}
                    >
                      {item.foodDetails[0]?.discount != 0
                        ? item.foodDetails[0]?.amount + " VND"
                        : ""}
                    </span>
                    </div>
                    <div>
                      <Button
                        size="small"
                        sx={{
                          border: "1px solid #7581f8",
                          transform: "translateY(-20%)",
                          padding: "5px 10px 5px 10px",
                          margin: '10px 20px'
                        }}
                        onClick={() => navigate(`/menu/${item.id}`)}
                      >
                        Xem thêm
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Stack my={4} display="flex" alignItems="center">
          <Pagination
            // style={{
            //   background: "#000000b0",
            //   borderRadius: "3px",
            //   padding: "0 20px",
            // }}
            count={NumberPage}
            onChange={handleChangePage}
          />
        </Stack>
      </Container>
    </>
  );
}

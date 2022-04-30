import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import FoodsApi from "../../../../API/FoodsAPI";
import CategoriesAPI from "../../../../API/CategoriesAPI";

export default function NewFood() {
  const [addDetail, setAddDetail] = useState([]);
  const [updateAll, setUpdateAll] = useState(false);
  const [getCategory, setGetCategory] = useState([]);
  const [nameFood, setNameFood] = useState("");
  const [titleFood, setTitleFood] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [newFoodId, setNewFoodId] = useState("");

  const handleChange = (event) => {
    setSelectCategory(event.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await CategoriesAPI.getAllCategories();
      setGetCategory(res);
      setSelectCategory(res[0].id);
    };
    fetchData();
  }, []);
  const confirmAddFoods = async () => {
    const newFood = {
      title: titleFood,
      name: nameFood,
      category: {
        id: selectCategory,
      },
    };
    const res = await FoodsApi.createFood(newFood);
    setNewFoodId(res.id);
    setUpdateAll(true);
  };
  return (
    <Container>
      <Grid container>
        <Grid
          item
          xs={12}
          my={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h5" textAlign="center" mb={2}>
            Thêm món mới
          </Typography>
          <Box>
            <TextField
              sx={{ m: 3, width: 310 }}
              label="Tên món ăn:"
              variant="standard"
              onChange={(e) => setNameFood(e.target.value)}
            />
            <TextField
              sx={{ m: 3, width: 310 }}
              label="Tiêu đề món ăn:"
              variant="standard"
              onChange={(e) => setTitleFood(e.target.value)}
            />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Box width={310}>
                <FormControl fullWidth>
                  <InputLabel id="Category">Món này có thể loại</InputLabel>
                  <Select
                    labelId="Category"
                    value={selectCategory}
                    label="Món này có thể loại"
                    onChange={handleChange}
                  >
                    {getCategory &&
                      getCategory?.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
          <Typography variant="h5" mt={4}>
            Thêm chi tiết món ăn
          </Typography>
          {addDetail.map((item, index) => (
            <AddDetail
              key={index}
              i={index}
              newFoodId={newFoodId}
              updateAll={updateAll}
            />
          ))}
          <Box mt={3}>
            <Button
              variant="contained"
              sx={{ mr: 3 }}
              onClick={() => setAddDetail((preState) => [...preState, 1])}
            >
              Thêm chi tiết
            </Button>
            {addDetail[0] && (
              <Button variant="contained" onClick={confirmAddFoods}>
                Xác nhận
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

const AddDetail = ({ i, newFoodId, updateAll }) => {
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [images, setImages] = useState([]);
  const maxNumber = 5;
  useEffect(() => {
    const fetchData = async () => {
      if (updateAll && newFoodId) {
        const newDetail = {
          foodSize: size,
          price: price,
          discount: discount,
          amount: amount,
          foodId: newFoodId,
          foodMedias: [
            {
              foodUrl:
                "https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1551438228969-H0FPV1FO3W5B0QL328AS/chup-anh-thuc-an-1.jpg",
            },
            {
              foodUrl:
                "https://chupanhmonan.com/wp-content/uploads/2018/10/chup-anh-mon-an-chuyen-nghiep-tu-liam-min-min.jpg",
            },
          ],
        };
        const res = await FoodsApi.createFoodDetail(newDetail);
        console.log(res);
      }
    };
    fetchData();
  }, [updateAll]);
  const onChangeImage = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  return (
    <Box>
      <TextField
        variant="standard"
        label="Size"
        sx={{ m: 3, width: 200 }}
        onChange={(e) => setSize(e.target.value)}
      />
      <TextField
        variant="standard"
        label="Giá"
        sx={{ m: 3, width: 200 }}
        onChange={(e) => setPrice(e.target.value)}
      />
      <TextField
        variant="standard"
        label="Số lượng"
        sx={{ m: 3, width: 200 }}
        onChange={(e) => setAmount(e.target.value)}
      />
      <TextField
        variant="standard"
        label="Giảm giá"
        sx={{ m: 3, width: 200 }}
        onChange={(e) => setDiscount(e.target.value)}
      />
      <ImageUploading
        multiple
        value={images}
        onChange={onChangeImage}
        maxNumber={maxNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <Box display="flex" alignItems="center" flexDirection="column">
            <Stack
              width={350}
              height={100}
              sx={{
                border: "1px dashed #fff",
                cursor: "pointer",
              }}
              onClick={onImageUpload}
              {...dragProps}
            >
              <Typography textAlign="center" mt={2} sx={{ opacity: 0.5 }}>
                {isDragging ? "Thả" : "Bấm để thêm hoặc kéo hình ảnh vào đây"}
              </Typography>
            </Stack>
            {images && (
              <Box
                display="flex"
                width={350}
                sx={{ border: "1px dashed #fff", overflowX: "auto" }}
              >
                {imageList?.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image.dataURL}
                      style={{ margin: 5 }}
                      alt="ImageUpload"
                      width="100"
                      height="100"
                    />
                    <div>
                      <Button size="small" onClick={() => onImageUpdate(index)}>
                        Update
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => onImageRemove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </Box>
            )}
          </Box>
        )}
      </ImageUploading>
    </Box>
  );
};

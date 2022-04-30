import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {
  Backdrop,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import { useParams } from 'react-router-dom';
import FoodsAPI from '../../../../API/FoodsAPI';

export default function FixFoods() {
  const [foodDetail, setFoodDetail] = useState('');
  const [FoodName, setFoodName] = useState('');
  const [FoodTitle, setFoodTitle] = useState('');
  const [resetData, setResetData] = useState(false);
  const [size, setSize] = useState('');
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [images, setImages] = useState([]);
  const [select, setSelect] = useState([]);
  const [open, setOpen] = useState(false);
  let { id } = useParams();
  const [value, setValue] = useState('0');
  const [openDLAddDetail, setOpenDLAddDetail] = useState(false);
  const maxNumber = 5;

  const handleClickOpenAddDetail = (item) => {
    setSelect(item);
    setOpenDLAddDetail(true);
    console.log(select);
  };
  const onChangeImage = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  const confirmAddDetail = async () => {
    setOpenDLAddDetail(false);
    const detail = {
      foodSize: size,
      discount: discount,
      amount: amount,
      foodId: select.id,
      foodMedias: [
        {
          foodUrl:
            'https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1551438228969-H0FPV1FO3W5B0QL328AS/chup-anh-thuc-an-1.jpg',
        },
        {
          foodUrl:
            'https://chupanhmonan.com/wp-content/uploads/2018/10/chup-anh-mon-an-chuyen-nghiep-tu-liam-min-min.jpg',
        },
      ],
    };
    const res = await FoodsAPI.createFoodDetail(detail);
    console.log(res);
    handleResetData();
  };

  const handleResetData = () => {
    setResetData(!resetData);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    const fetchFoodById = async () => {
      const res = await FoodsAPI.getFoodById(id);
      setFoodDetail(res);
      setFoodName(res.name);
      setFoodTitle(res.title);
    };
    fetchFoodById();
  }, [resetData]);
  const confirmUpdateFood = async () => {
    const food = {
      title: FoodTitle,
      name: FoodName,
      notes: '1',
      category: {
        id: foodDetail.category.id,
      },
    };
    const res = await FoodsAPI.updateFood(id, food);
    console.log(res);
    handleResetData();
  };
  return (
    <Container>
      <Grid container>
        <Grid
          item
          xs={12}
          my={5}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Typography variant='h5' textAlign='center' mb={2}>
            Chỉnh sửa thông tin món {foodDetail?.name}
          </Typography>
          {foodDetail && (
            <Grid container>
              <Grid item sm={6} xs={12}>
                <img
                  style={{ width: '100%' }}
                  src={foodDetail?.foodDetails[0]?.foodMedias[0]?.foodUrl}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                display='flex'
                flexDirection='column'
                justifyContent='center'
              >
                <TextField
                  sx={{ m: 3, width: 310 }}
                  label='Tên món ăn:'
                  variant='standard'
                  defaultValue={foodDetail.name}
                  onChange={(e) => setFoodName(e.target.value)}
                />
                <TextField
                  sx={{ m: 3, width: 310 }}
                  label='Tiêu đề món ăn:'
                  variant='standard'
                  defaultValue={foodDetail.title}
                  onChange={(e) => setFoodTitle(e.target.value)}
                />
              </Grid>
              <Box
                sx={{
                  position: 'fixed',
                  height: 330,
                  transform: 'translateZ(0px)',
                  flexGrow: 1,
                  right: 50,
                  bottom: 50,
                  zIndex: 10,
                }}
              >
                <Backdrop open={open} />
                <SpeedDial
                  ariaLabel='SpeedDial'
                  sx={{ position: 'absolute', bottom: 16, right: 16 }}
                  icon={<SpeedDialIcon />}
                  onClose={handleClose}
                  onOpen={handleOpen}
                  open={open}
                >
                  <SpeedDialAction
                    icon={
                      <AddRoundedIcon
                        onClick={() => handleClickOpenAddDetail(foodDetail)}
                      />
                    }
                    tooltipTitle='Thêm_Size_mới'
                    tooltipOpen
                    onClick={handleClose}
                  />
                </SpeedDial>
              </Box>
            </Grid>
          )}
          <Box width='100%' display='flex' justifyContent='center'>
            <Button
              variant='contained'
              sx={{ my: 2 }}
              onClick={confirmUpdateFood}
            >
              Xác nhận
            </Button>
          </Box>
          <Stack spacing={2} width='100%'>
            <TabContext value={value}>
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider', color: 'white' }}
              >
                <Tabs
                  value={`${value}`}
                  onChange={handleChange}
                  variant='scrollable'
                  scrollButtons='auto'
                  aria-label='scrollable auto tabs example'
                >
                  {foodDetail.foodDetails?.map((item, index) => (
                    <Tab
                      key={index}
                      label={`Size ${item.foodSize}`}
                      value={`${index}`}
                    />
                  ))}
                </Tabs>
                {foodDetail.foodDetails?.map((item, index) => (
                  <TabPanelCustom
                    key={index}
                    value={`${index}`}
                    item={item}
                    foodId={id}
                    resetData={handleResetData}
                  />
                ))}
              </Box>
            </TabContext>
          </Stack>
        </Grid>
      </Grid>
      <Dialog open={openDLAddDetail} onClose={() => setOpenDLAddDetail(false)}>
        <DialogTitle>{'Thêm chi tiết cho món ăn: ' + select.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Stack spacing={2}>
              <TextField
                label='Size'
                variant='standard'
                onChange={(e) => setSize(e.target.value)}
              />
              <TextField
                label='Giảm giá'
                variant='standard'
                onChange={(e) => setAmount(e.target.value)}
              />
              <TextField
                label='Số lượng'
                variant='standard'
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
                  <Box
                    display='flex'
                    alignItems='center'
                    flexDirection='column'
                  >
                    <Stack
                      width={350}
                      height={100}
                      sx={{
                        border: '1px dashed #fff',
                        cursor: 'pointer',
                      }}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <Typography
                        textAlign='center'
                        mt={2}
                        sx={{ opacity: 0.5 }}
                      >
                        {isDragging
                          ? 'Thả'
                          : 'Bấm để thêm hoặc kéo hình ảnh vào đây'}
                      </Typography>
                    </Stack>
                    {images && (
                      <Box
                        display='flex'
                        width={350}
                        sx={{ border: '1px dashed #fff', overflowX: 'auto' }}
                      >
                        {imageList?.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image.dataURL}
                              style={{ margin: 5 }}
                              alt='ImageUpload'
                              width='100'
                              height='100'
                            />
                            <div>
                              <Button
                                size='small'
                                onClick={() => onImageUpdate(index)}
                              >
                                Update
                              </Button>
                              <Button
                                size='small'
                                color='error'
                                onClick={() => onImageRemove(index)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </ImageUploading>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDLAddDetail(false)}>Disagree</Button>
          <Button onClick={confirmAddDetail} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

const TabPanelCustom = ({ value, item, foodId, resetData }) => {
  const [images, setImages] = useState([]);
  const [size, setSize] = useState(item.foodSize);
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState(item.amount);
  const [imagePre, setImagePre] = useState(item.foodMedias);
  const [discount, setDiscount] = useState(item.discount);
  const [openDLDelete, setOpenDLDelete] = useState(false);
  const [select, setSelect] = useState([]);
  const [test, setTest] = useState([]);

  const maxNumber = 5;
  const onChangeImage = (imageList, addUpdateIndex) => {
    setImages(imageList);
    console.log(imageList);
  };
  const handleOpenDLDelete = (item) => {
    setSelect(item);
    setOpenDLDelete(true);
  };
  const confirmDeleteFoodDetail = async () => {
    setOpenDLDelete(false);
    const res = await FoodsAPI.deleteFoodDetail(select.id);
    console.log(res);
    resetData();
  };

  const uploadImg = async () => {
    const fromData = new FormData();
    images.forEach((image) => {
      fromData.append('files', image.file);
    });
    const res = await FoodsAPI.uploadImage(fromData);
    console.log(res);
  };
  const confirmUpdateFoodDetail = async () => {
    const foodDetail = {
      foodSize: size,
      amount: amount,
      discount: discount,
      foodId: foodId,
      foodMedias: [
        {
          foodUrl:
            'https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/1551438228969-H0FPV1FO3W5B0QL328AS/chup-anh-thuc-an-1.jpg',
        },
        {
          foodUrl:
            'https://chupanhmonan.com/wp-content/uploads/2018/10/chup-anh-mon-an-chuyen-nghiep-tu-liam-min-min.jpg',
        },
      ],
    };
    const res = await FoodsAPI.updateFoodDetails(item.id, foodDetail);
    console.log(res);
    resetData();
  };
  return (
    <TabPanel value={value}>
      <Typography textAlign='center' variant='h5'>
        Chỉnh sửa size {size}
      </Typography>
      <Grid container>
        <Grid
          item
          md={6}
          xs={12}
          mt={6}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Typography textAlign='center'>Hình ảnh</Typography>
          <Stack
            spacing={1}
            direction='row'
            sx={{ display: 'flex', overflow: 'auto', width: 400 }}
          >
            {imagePre?.map((item, index) => (
              <Box position='relative' key={index}>
                <img style={{ width: 150, height: 150 }} src={item?.foodUrl} />
                <Button
                  sx={{ position: 'absolute', bottom: 0, left: '34%' }}
                  color='error'
                  variant='outlined'
                  size='small'
                >
                  Xóa
                </Button>
              </Box>
            ))}
          </Stack>
          <Box>
            <Typography textAlign='center' my={3}>
              Thêm hình ảnh
            </Typography>
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
                <Box display='flex' alignItems='center' flexDirection='column'>
                  <Stack
                    width={350}
                    height={70}
                    sx={{
                      border: '1px dashed #fff',
                      cursor: 'pointer',
                    }}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <Typography textAlign='center' mt={2} sx={{ opacity: 0.5 }}>
                      {isDragging
                        ? 'Thả'
                        : 'Bấm để thêm hoặc kéo hình ảnh vào đây'}
                    </Typography>
                  </Stack>
                  {images && (
                    <Box
                      display='flex'
                      width={350}
                      sx={{
                        border: '1px dashed #fff',
                        borderTop: 'none',
                        overflowX: 'auto',
                      }}
                    >
                      {imageList?.map((image, index) => (
                        <div key={index}>
                          <img
                            src={image.dataURL}
                            style={{ margin: 5 }}
                            alt='ImageUpload'
                            width='100'
                            height='100'
                          />
                          <div>
                            <Button
                              size='small'
                              onClick={() => onImageUpdate(index)}
                            >
                              Đổi
                            </Button>
                            <Button
                              size='small'
                              color='error'
                              onClick={() => onImageRemove(index)}
                            >
                              Xóa
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
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
          mt={6}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Typography textAlign='center'>Chỉnh sửa thông tin</Typography>
          <Stack spacing={3}>
            <TextField
              sx={{ width: 350 }}
              label='Size'
              variant='standard'
              defaultValue={size}
              onChange={(e) => setSize(e.target.value)}
            />
            <TextField
              sx={{ width: 350 }}
              label='Giá sản phẩm'
              variant='standard'
              defaultValue={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              sx={{ width: 350 }}
              label='Giảm giá'
              variant='standard'
              defaultValue={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Stack>
        </Grid>
      </Grid>
      <Stack
        direction='row'
        mt={5}
        spacing={3}
        sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <Button
          variant='contained'
          color='error'
          onClick={() => handleOpenDLDelete(item)}
        >
          Xóa Size này
        </Button>
        <Button variant='contained' onClick={confirmUpdateFoodDetail}>
          Xác nhận
        </Button>
        <Button onClick={uploadImg}>Test Upload</Button>
      </Stack>
      {/* Dialog confirm deleteFoodDetail */}
      <Dialog open={openDLDelete} onClose={() => setOpenDLDelete(false)}>
        <DialogTitle>
          {'Xóa trường thông tin Size ' + select.foodSize}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn chắc chắn muốn xóa Size {select.foodSize}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDLDelete(false)}>Disagree</Button>
          <Button onClick={confirmDeleteFoodDetail} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </TabPanel>
  );
};

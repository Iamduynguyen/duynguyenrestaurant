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
import { useNavigate, useParams } from 'react-router-dom';
import FoodsAPI from '../../../../API/FoodsAPI';
import CategoryAPI from '../../../../API/CategoriesAPI';
import { message, Row, Col, Form, Input, Button as AntdButton, Modal, Select, InputNumber, Progress, Popconfirm } from 'antd';
import { useForm } from "antd/lib/form/Form";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { width } from '@mui/system';

export default function FixFoods() {

  const [form] = useForm();
  const [newDetailForm] = useForm();
  const [foodEditing, setFoodEditing] = useState({})
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [categories, setCategories] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();


  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    setOpenDLAddDetail(false);
    message.success('Thêm size thành công!');
    handleResetData();
  };


  const handleCreateDetail = async (values) => {
    const detail = {
      ...values,
      foodId: select.id,
      foodMedias: [
      ]
    };
    const res = await FoodsAPI.createFoodDetail(detail);
    console.log(res);
    setOpenDLAddDetail(false);
    message.success('Thêm size thành công!');
    handleResetData();
  }

  const handleResetData = () => {
    setResetData(!resetData);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const confirmUpdateFood = async () => {
    const food = {
      title: FoodTitle,
      name: FoodName,
      notes: '1',
      category: {
        id: 3508,
      },
    };
    const res = await FoodsAPI.updateFood(id, food);
    console.log(res);
    handleResetData();
  };


  const handleUpdateFood = async () => {
    setUpdateLoading(true);
    setUpdateStatus('Đang cập nhật !!!');
    const food = form.getFieldsValue();
    console.log(food);
    const newFood = {
      title: food.title,
      name: food.name,
      note: food.note ? food.note : '',
      category: {
        id: food.categoryId
      }
    }
    console.log(newFood)
    const res = await FoodsAPI.updateFood(id, newFood);
    console.log(res);
    handleResetData();
    setUpdateLoading(false);
    setUpdateStatus('');
    setIsUpdating(false);
    message.success('Cập nhật thành công!');
  }


  const handleDeleteFood = async () => {
    const res = await FoodsAPI.deleteFood(foodEditing.id);
    console.log(res)
    if (res == 'Delete success!') {
      message.success('Xóa món ăn thành công !');
      navigate('/admin/foods');
    } else {
      message.error('Xóa không thành công !');
    }
  }

  useEffect(() => {
    const fetchFoodById = async () => {
      const res = await FoodsAPI.getFoodById(id);
      setFoodEditing({ ...res, categoryId: res.category ? res.category.id : 7102 });
      setFoodDetail(res);
      setFoodName(res.name);
      setFoodTitle(res.title);
      console.log(res)
    };
    fetchFoodById();


    const fetchCategoriesData = async () => {
      const res = await CategoryAPI.getAllCategories();
      setCategories(res);
    };
    fetchCategoriesData();
  }, [resetData]);


  useEffect(() => {
    if (foodEditing) {
      form.resetFields();
      if (foodEditing.foodDetails?.length > 0) {
        setValue('0')
      } else {
        setValue(+0)
      }
    }
  }, [foodEditing])
  return (
    <>
      {false && (
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
      )}

      {/* antd */}
      <Row>
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
        <div className="adm-section">
          <h2>Chỉnh sửa thông tin món ăn</h2>
        </div>
        <Col span={10} className="adm-edit--food">
          <div className="adm-edit--food__inner">
            <h3>Thông tin món ăn</h3>
            <div className="adm-edit-food__img">

            </div>
            <Form
              form={form}
              labelCol={24}
              wrapperCol={24}
              layout='vertical'
              initialValues={foodEditing}
              onFinish={() => { setIsUpdating(true) }}
            >
              <Form.Item
                name="id"
                label="Id món ăn"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng không để trống mã món ăn!"
                  }
                ]}
                hasFeedback
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="name"
                label="Tên món ăn"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng không để trống tên món ăn !"
                  },
                  {
                    whitespace: true,
                    message: "Vui lòng không nhập khoảng trống !"
                  }
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="categoryId"
                label="Thể loại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thể loại!"
                  }
                ]}
                hasFeedback
              >
                <Select>
                  {categories.length > 0 ? (
                    categories.map((item, index) => (
                      <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                    ))
                  ) : ''}
                  <Select.Option>1</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="title"
                label="Tiêu đề"
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="note"
                label="Ghi chú"
                initialValue={''}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
              >
                <AntdButton className='my-btn my-btn--primary' onClick={() => { form.submit() }}>Cập nhật</AntdButton>
                <AntdButton className='my-btn' onClick={() => { setIsDeleting(true) }}> Xóa</AntdButton>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={14} className="adm-edit--food-detail">
          <div className="adm-edit--food-detail__inner">
            <h3>Size món ăn</h3>
            <Row>
              {
                foodEditing.foodDetails && foodEditing.foodDetails.length > 0 ? (
                  <Stack spacing={2} width='100%'>
                    <TabContext value={value}>
                      <Box
                        sx={{ borderBottom: 1, borderColor: 'divider', color: 'black' }}
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
                ) : (
                  <div>Đồ ăn chưa có size nào</div>
                )
              }
            </Row>
          </div>
        </Col>
      </Row>
      <Modal
        visible={isUpdating}
        title="Bạn có muốn cập nhật món ăn không!"
        onCancel={() => { setIsUpdating(false); setUpdateStatus('') }}
        onOk={handleUpdateFood}
        confirmLoading={updateLoading}
      >
        {updateStatus}
      </Modal>
      <Modal
        visible={isDeleting}
        title="Bạn có muốn xóa món ăn không!"
        onCancel={() => { setIsDeleting(false); setDeleteStatus('') }}
        onOk={handleDeleteFood}
        confirmLoading={deleteLoading}
      >
        {deleteStatus}
      </Modal>
      <Dialog open={openDLAddDetail} onClose={() => setOpenDLAddDetail(false)}>
        <DialogTitle>{'Thêm chi tiết cho món ăn: ' + select.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Stack spacing={2}>
              {/* <TextField
                label='Size'
                variant='standard'
                onChange={(e) => setSize(e.target.value)}
              />
              <TextField
                label='Giá sản phẩm'
                variant='standard'
                onChange={(e) => setAmount(e.target.value)}
              />
              <TextField
                label='Giảm giá'
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
              </ImageUploading> */}
              <Form
                form={newDetailForm}
                labelCol={24}
                wrapperCol={24}
                layout='vertical'
                onFinish={handleCreateDetail}
              >
                <Form.Item
                  label="Tên size"
                  name="foodSize"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng không để trống !'
                    },
                    {
                      whitespace: true,
                      message: 'Vui lòng không nhập khoảng trắng !'
                    }
                  ]}
                  hasFeedback
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Giá sản phẩm"
                  name="amount"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng không để trống !'
                    },
                    ({ getFieldsValue }) => ({
                      validator(_, value) {
                        if (Number(value) > 0) {
                          return Promise.resolve()
                        }
                        return Promise.reject('Giá phải lơn 0 !')
                      }
                    })
                  ]}
                  hasFeedback
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  label="Giảm giá"
                  name="discount"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng không để trống!'
                    }
                  ]}
                  hasFeedback
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Form>
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => setOpenDLAddDetail(false)}>Disagree</Button>
          <Button onClick={confirmAddDetail} autoFocus>
            Agree
          </Button> */}

          <AntdButton className='my-btn my-btn--primary' onClick={() => { newDetailForm.submit() }}>Thêm ngay</AntdButton>
          <AntdButton className='my-btn' onClick={() => setOpenDLAddDetail(false)}>Hủy bỏ</AntdButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

const TabPanelCustom = ({ value, item, foodId, resetData }) => {

  const [detailForm] = useForm();


  const [images, setImages] = useState([]);
  const [size, setSize] = useState(item.foodSize);
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState(item.amount);
  const [imagePre, setImagePre] = useState(item.foodMedias);
  const [discount, setDiscount] = useState(item.discount);
  const [openDLDelete, setOpenDLDelete] = useState(false);
  const [select, setSelect] = useState([]);
  const [test, setTest] = useState([]);
  const [discountPrg, setDiscountPrg] = useState(item.discount > 100 ? 100 : item.discount);



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
    let newLink = res;
    const medias = imagePre.map((item, index) => {
      return {
        foodUrl: item.foodUrl
      }
    })
    const foodDetail = {
      foodSize: size,
      amount: amount,
      discount: discount,
      foodId: foodId,
      foodMedias: [
        ...medias,
        {
          foodUrl: newLink
        }
      ]
    };


    const res2 = await FoodsAPI.updateFoodDetails(item.id, foodDetail);
    console.log(res2);
    setImagePre(res2.foodMedias);
    setImages([]);
    resetData();
    message.success('Up load ảnh thành công !');
  };

  const uploadImg2 = async () => {
    const fromData = new FormData();
    images.forEach((image) => {
      fromData.append('files', image.file);
    });
    const res = await FoodsAPI.uploadImage2(fromData);
    console.log(res);
    const newLinks = res.map((item, index) => ({foodUrl: item}))
    const medias = imagePre.map((item, index) => {
      return {
        foodUrl: item.foodUrl
      }
    })
    const foodDetail = {
      foodSize: size,
      amount: amount,
      discount: discount,
      foodId: foodId,
      foodMedias: [
        ...medias,
        ...newLinks
      ]
    };


    const res2 = await FoodsAPI.updateFoodDetails(item.id, foodDetail);
    console.log(res2);
    setImagePre(res2.foodMedias);
    setImages([]);
    resetData();
    message.success('Up load ảnh thành công !');
  };

  const handleDeleteMedia = async (media) => {
    const medias = imagePre.filter((item, index) => {
      if (item.id !== media.id) {
        return {
          foodUrl: item.foodUrl
        }
      }
    });

    const newMedias = medias.map((item, index) => ({ foodUrl: item.foodUrl }))


    const foodDetail = {
      foodSize: size,
      amount: amount,
      discount: discount,
      foodId: foodId,
      foodMedias: newMedias
    };

    const res = await FoodsAPI.updateFoodDetails(item.id, foodDetail);
    setImagePre(res.foodMedias)
    console.log(res)
    setImages([]);
    message.success('Xóa ảnh thành công !');
  }

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

  const onFinish = async (values) => {
    const medias = imagePre.map((item, index) => {
      return {
        foodUrl: item.foodUrl
      }
    })
    const newDetail = {
      ...values,
      discount: discountPrg,
      foodId: foodId,
      foodMedias: [
        medias
      ]
    }

    const res = await FoodsAPI.updateFoodDetails(item.id, newDetail);
    console.log(res);
    resetData();
    message.success('Cập nhật thành công !');
  };


  useEffect(() => {
    detailForm.resetFields()
    setSize(item.foodSize);
    setAmount(item.amount);
    setImagePre(item.foodMedias);
    setDiscount(item.discount);

    setDiscountPrg(item.discount > 100 ? 100 : item.discount);
  }, [item])

  return (
    <TabPanel value={value}>
      <Typography textAlign='center' variant='h5'>
        Chỉnh sửa size thông tin size: {size}
      </Typography>
      {
        false && (
          <Grid container>
            <Grid
              item
              md={12}
              xs={12}
              mt={12}
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
        )
      }

      {/* my antd form */}

      <div className="detail--demidas">
        {
          imagePre.map((item, index) => (
            <div className="detail--demidas__item" key={item.id}>
              <img src={item.foodUrl} alt="" />
              <Popconfirm
                title="Bạn có muốn xóa ảnh này không ?"
                onConfirm={() => handleDeleteMedia(item)}
                okText="Có"
                cancelText="Không"
              >
                <div className="detail--demidas__item--delete">
                  <DeleteOutlined />
                </div>
              </Popconfirm>

            </div>
          ))
        }
      </div>
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
        <AntdButton className='my-btn my-btn--primary' onClick={uploadImg2}>Up load hình ảnh</AntdButton>
      </Box>

      <Form
        form={detailForm}
        labelCol={24}
        wrapperCol={24}
        layout='vertical'
        initialValues={item}
        onFinish={onFinish}
      >
        <Form.Item
          label="Size"
          name="foodSize"
          rules={[
            {
              required: true,
              message: 'Vui lòng không để trống !'
            },
            {
              whitespace: true,
              message: 'Vui lòng không nhập khoảng trắng !'
            }
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giá sản phẩm"
          name="amount"
          rules={[
            {
              required: true,
              message: 'Vui lòng không để trống !'
            },
            ({ getFieldsValue }) => ({
              validator(_, value) {
                if (Number(value) > 0) {
                  return Promise.resolve()
                }
                return Promise.reject('Giá phải lơn 0 !')
              }
            })
          ]}
          hasFeedback
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        {/* <Form.Item
          label="Giảm giá"
          name="discount"
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          label="Giảm giá"
        >
          <div className="progress--action">
            <div className="progress--action__minus" onClick={() => {
              let prg = discountPrg - 5;
              prg < 0 ? setDiscountPrg(0) : setDiscountPrg(prg);
            }}>
              <MinusOutlined />
            </div>
            <div className="progress--action__input">
              {discountPrg} %
            </div>
            <div className="progress--action__plus" onClick={() => {
              let prg = discountPrg + 5;
              prg > 100 ? setDiscountPrg(100) : setDiscountPrg(prg);
            }}>
              <PlusOutlined />
            </div>
          </div>
          <Progress percent={discountPrg ? discountPrg : 0} />
        </Form.Item>
        <Form.Item
        >
          <AntdButton className='my-btn my-btn--primary' onClick={() => { detailForm.submit() }}>Cập nhật</AntdButton>
          <AntdButton type='danger' className='my-btn' onClick={() => handleOpenDLDelete(item)}>
            Xóa
          </AntdButton>
        </Form.Item>
      </Form>

      {/* end my antd form */}

      {/* <Stack
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
      </Stack> */}
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

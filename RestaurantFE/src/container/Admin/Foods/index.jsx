import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FoodsAPI from "./../../../API/FoodsAPI";
import styles from "../Categories/Categories.module.css";
import { Row, Table, Button as AntdButton, Modal, message } from "antd";

export default function FoodsAdmin() {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  const [FoodsData, setFoodsData] = useState([]);
  const [openDLDelete, setOpenDLDelete] = useState(false);
  const [select, setSelect] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [resetData, setResetData] = useState(false);
  const confirmDeleteCategory = async () => {
    setOpenDLDelete(false);
    const res = await FoodsAPI.deleteFood(select.id);
    console.log(res);
    setResetData(!resetData);
  };
  const handleClickOpenDelete = (item) => {
    setSelect(item);
    setOpenDLDelete(true);
    console.log(select);
  };

  const handleDeleteFood = async () => {
    if (deletedId) {
      setDeleteLoading(true);
      setDeleteStatus("Đang xóa...!");
      const res = await FoodsAPI.deleteFood(deletedId);
      console.log(res);
      if (res === "Delete success!") {
        setDeleteLoading(false);
        setDeleteStatus("");
        setIsDeleting(false);
        message.success("Xóa thành công!");
        setResetData(!resetData);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await FoodsAPI.getAllFoods();
      setFoodsData(res);
      setTableData(
        res.map((item, index) => {
          return {
            ...item,
            stt: index + 1,
            key: item.id,
            categoryName: item.category ? item.category.name : "Không có",
          };
        })
      );
      console.log(res);
    };
    fetchData();
  }, [resetData]);
  return (
    <>
      {false && (
        <Grid container mt={1}>
          <p className=" pt-[20px] pl-[30px] font-medium text-[26px] text-gray-700">
            Danh sách
          </p>

          <div className="px-[30px] mt-[20px] py-[15px] w-full  uppercase border-b dark:border-gray-700 bg-gray-50 ">
            <div className="w-full grid grid-cols-[0.5fr,2fr,2fr,2fr,3fr]">
              <p className="text-xs font-bold tracking-wide text-left text-gray-500">
                #
              </p>
              <p className="text-xs font-bold tracking-wide text-left text-gray-500">
                Tên đồ ăn
              </p>
              <p className="text-xs font-bold tracking-wide text-left text-gray-500">
                Hình ảnh
              </p>
              <p className="text-xs font-bold tracking-wide text-left text-gray-500">
                Lượt xem
              </p>
              <p className="text-xs font-bold tracking-wide text-left text-gray-500">
                Lượt mua
              </p>
              <p className="text-xs font-bold tracking-wide text-left text-gray-500"></p>
            </div>
          </div>
          <div className="w-full ">
            {FoodsData?.map((item, index) => (
              <div
                className="w-full px-[30px]  grid grid-cols-[0.5fr,2fr,2fr,2fr,3fr] py-[15px] border-b border-gray-300"
                key={index}
              >
                <div className="">{index + 1}</div>
                <div className="">{item.name}</div>
                <div className="">
                  <img style={{ height: 100 }} src={item.avtUrl} alt="" />
                </div>
                <div className=""></div>
                <div className="flex justify-end">
                  <Stack direction="row" spacing={1} position="absolute">
                    <Link to={`/admin/foods/fix-food/${item.id}`}>
                      <Button size="small" variant="contained">
                        Sửa
                      </Button>
                    </Link>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleClickOpenDelete(item)}
                    >
                      Xóa
                    </Button>
                  </Stack>
                </div>
              </div>
            ))}
          </div>
          {/* {FoodsData?.map((item, index) => (
        <Grid key={item.id} className={styles.BoxCategory} item m={1}>
          <Typography width={isMobile ? 230 : "100%"}>
            {index + 1}, {item.name}
          </Typography>
          <Stack spacing={1} direction="row" position="absolute" right="1%">
            <Link to={`/admin/foods/fix-food/${item.id}`}>
              <Button size="small" variant="contained">
                Sửa
              </Button>
            </Link>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => handleClickOpenDelete(item)}
            >
              Xóa
            </Button>
          </Stack>
        </Grid>
      ))} */}
          {/* Dialog for delete food */}
          <Dialog open={openDLDelete} onClose={() => setOpenDLDelete(false)}>
            <DialogTitle>{"Xóa trường thông tin: " + select.name}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Bạn chắc chắn muốn xóa: {select.name}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDLDelete(false)}>Huỷ bỏ</Button>
              <Button onClick={confirmDeleteCategory} autoFocus>
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      )}

      {/* antd */}
      <Row>
        <div className="adm-section">
          <h2>Danh sách món ăn</h2>
        </div>
        <Table
          size="small"
          bordered={true}
          pagination={true}
          dataSource={tableData}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <div className="food--details">
                  {record.foodDetails.map((item, index) => {
                    return (
                      <div key={index} className="food--details__item">
                        <div className="food--details__item--content">
                          <div className="food--details__item--size">
                            Size: {item.foodSize}
                          </div>
                          <div className="food--details__item--price">
                            Giá: {item.amount}
                          </div>
                          <div className="food--details__item--discount">
                            Giảm giá: {item.discount} %
                          </div>
                        </div>
                        <div className="food--details__item--imgs">
                          {item.foodMedias.length > 0 ? (
                            item.foodMedias.map((item, index) => (
                              <img
                                src={item.foodUrl}
                                alt={item.foodSize}
                                key={index}
                              />
                            ))
                          ) : (
                            <div>No image</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            },
            rowExpandable: (record) => record.foodDetails.length > 0,
          }}
          style={{ width: "100%" }}
        >
          <Table.Column title="STT" dataIndex="stt" key="stt" />
          <Table.Column title="Tên món ăn" dataIndex="name" key="name" />
          <Table.Column title="Tiêu đề" dataIndex="title" key="title" />
          <Table.Column
            title="Thể loại"
            dataIndex="categoryName"
            key="categoryName"
          />
          <Table.Column
            title=""
            key="action"
            render={(record) => (
              <div className="action__column--btn">
                <AntdButton
                  className="action__column--btn__delete"
                  type="danger"
                  onClick={() => {
                    setIsDeleting(true);
                    setDeletedId(record.id);
                    setDeleteStatus(record);
                  }}
                >
                  Xóa
                </AntdButton>
                <AntdButton
                  className="action__column--btn__edit"
                  onClick={() => {
                    navigate(`/admin/foods/fix-food/${record.id}`);
                  }}
                >
                  Sửa
                </AntdButton>
              </div>
            )}
          />
        </Table>
      </Row>
      <Modal
        title="Bạn muốn xóa món ăn ?"
        visible={isDeleting}
        onCancel={() => {
          setIsDeleting(false), setDeletedId(null);
        }}
        cancelText="Huỷ bỏ"
        onOk={handleDeleteFood}
        okText="Đồng ý"
        confirmLoading={deleteLoading}
      >
        <p>{deleteStatus.name}</p>
        <i>{deleteStatus.title}</i>
      </Modal>
      {/* end antd */}
    </>
  );
}

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import FoodsAPI from "./../../../API/FoodsAPI";
import OrdersAPI from "../../../API/OrdersAPI";
import { Row, Table, Button as AntdButton, Modal, message } from "antd";
import TableAPI from "../../../API/TableAPI";
import { BsFillInfoCircleFill } from "react-icons/bs";

export default function FoodsAdmin() {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  const [orders, setOrders] = useState([]);
  const [openDLDelete, setOpenDLDelete] = useState(false);
  const [select, setSelect] = useState([]);
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
      const res = await OrdersAPI.getAllOrders();
      setOrders(res);
      setTableData(
        res.map((item, index) => {
          return {
            ...item,
            stt: index + 1,
            orderId: item.id,
            key: item.id,
            price: item.amountTotal,
            customerName: item.customer ? item.customer.name : "Không có",
            orderTime: moment(new Date(item.orderTime).toString()).format(
              "DD/MM/YYYY hh:mm:ss"
            ),
          };
        })
      );
      console.log(res);
    };
    fetchData();
  }, [resetData]);
  return (
    <>
      {/* antd */}
      <Row>
        <div className="adm-section">
          <h2>Danh sách hoá đơn</h2>
        </div>
        <Table
          size="small"
          bordered={true}
          pagination={true}
          dataSource={tableData}
          // expandable={{
          //   expandedRowRender: async (subData) => {
          //     const tableData = await TableAPI.getInfoTableById(
          //       subData.tableOrders.id
          //     );
          //     return (
          //       <div>
          //         <Button variant="contained" size="medium">
          //           Medium
          //         </Button>
          //       </div>
          //     );
          //   },
          //   rowExpandable: (subData) => subData.tableOrders.length > 0,
          // }}
          style={{ width: "100%" }}
        >
          <Table.Column
            title="STT"
            dataIndex="stt"
            key="stt"
            align="center"
            width={20}
          />
          <Table.Column
            title="Mã hoá đơn"
            dataIndex="orderId"
            key="orderId"
            align="center"
            width={100}
          />
          <Table.Column
            title="Khách hàng"
            dataIndex="customerName"
            key="customerName"
          />
          <Table.Column
            title="Tổng tiền"
            dataIndex="price"
            key="price"
            align="right"
          />
          <Table.Column
            title="Ngày tạo"
            dataIndex="orderTime"
            key="orderTime"
            align="center"
            width={200}
          />
          <Table.Column
            title="Bàn đặt"
            key="table"
            width={200}
            render={(subData) => {
              const tableIds = subData.tableOrders.map((item) => item.id);
              let table = [];
              tableIds.map(async (id) => {
                const res = await TableAPI.getInfoTableById(id);
                table.push(res.tableId);
                // console.log(table);
              });
              console.log(table);
              // table.forEach((i) => console.log(i));

              return (
                <div className="action__column--btn">
                  {tableIds.map((item) => (
                    <Button key={item} variant="contained" size="medium">
                      {item}
                    </Button>
                  ))}
                </div>
              );
            }}
          />
          <Table.Column
            title=""
            key="action"
            width={200}
            render={(subData) => (
              <div className="action__column--btn">
                <AntdButton
                  className="action__column--btn__delete"
                  type="danger"
                  onClick={() => {
                    setIsDeleting(true);
                    setDeletedId(subData.id);
                  }}
                >
                  Xóa
                </AntdButton>
                <AntdButton
                  className="action__column--btn__edit"
                  onClick={() => {
                    navigate(`/admin/foods/fix-food/${subData.id}`);
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
        onOk={handleDeleteFood}
        confirmLoading={deleteLoading}
      >
        {deleteStatus}
      </Modal>
      {/* end antd */}
    </>
  );
}

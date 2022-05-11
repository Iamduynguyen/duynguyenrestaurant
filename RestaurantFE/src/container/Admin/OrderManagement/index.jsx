import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import OrdersAPI from "../../../API/OrdersAPI";
import { Row, Table, Button as message, Tag } from "antd";
import ModalMessage from "../../../components/Modal/ModalMessage";

export default function FoodsAdmin(props) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigate();

  const [resetData, setResetData] = useState(false);

  // API Customer confirm
  const confirmOrder2 = async (id) => {
    const res = await OrdersAPI.confirmOrder2(id);
    if (res) {
      ModalMessage.miniTopRightModal("success", "Xác nhận đơn thành công");
    } else {
      ModalMessage.miniTopRightModal("error", `Lỗi<br/>Vui lòng thử lại sau!`);
    }
    setResetData(!resetData);
  };
  const confirmOrder4 = async (id) => {
    const res = await OrdersAPI.confirmOrder4(id);
    if (res) {
      ModalMessage.miniTopRightModal("success", "Xác nhận đặt cọc thành công");
    } else {
      ModalMessage.miniTopRightModal("error", `Lỗi<br/>Vui lòng thử lại sau!`);
    }
    setResetData(!resetData);
  };
  const confirmOrder6 = async (id) => {
    const res = await OrdersAPI.confirmOrder6(id);
    if (res) {
      ModalMessage.miniTopRightModal("success", "Đơn hàng đã hoàn thành");
    } else {
      ModalMessage.miniTopRightModal("error", `Lỗi<br/>Vui lòng thử lại sau!`);
    }
    setResetData(!resetData);
  };

  // Update food at table
  const updateFood = (data) => {
    props.setFoodsAtTable(data);
    if (data.foodOrders === null) {
      ModalMessage.miniTopRightModal(
        "info",
        `Bàn ${data.tablesId}<br/> Chưa đặt đồ ăn`
      );
    } else {
      navigation(`${data.orderId}/${data.tablesId}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await OrdersAPI.getAllOrders();
      if (res) {
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
        setLoading(false);
      }
    };
    fetchData();
  }, [resetData]);

  return (
    <>
      <Row>
        <div className="adm-section">
          <h2>Danh sách hoá đơn</h2>
        </div>
        <Table
          loading={loading}
          size="small"
          bordered={true}
          pagination={true}
          dataSource={tableData}
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
            sorter={(a, b) => a.orderId - b.orderId}
          />
          <Table.Column
            title="Khách hàng"
            dataIndex="customerName"
            key="customerName"
            sorter={(a, b) => a.customerName.localeCompare(b.customerName)}
          />
          <Table.Column
            title="Tổng tiền"
            dataIndex="price"
            key="price"
            align="right"
            sorter={(a, b) => +a.price - +b.price}
            render={(text) =>
              `${text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`
            }
          />
          <Table.Column
            title="Thời gian dự kiến"
            dataIndex="orderTime"
            key="orderTime"
            align="center"
            width={200}
          />
          <Table.Column
            title="Bàn đặt"
            key="table"
            render={(record) => (
              <div className="action__column--btn">
                {record.orders.map((item) => (
                  <Button
                    key={item.orderTableId}
                    variant="contained"
                    size="medium"
                    onClick={() => updateFood(item)}
                  >
                    {item.tablesId}
                  </Button>
                ))}
              </div>
            )}
          />
          <Table.Column
            title="Trạng thái"
            key="status"
            align="center"
            width={200}
            render={(record) => {
              if (record.status === -1)
                return <Tag color={"default"}>Đã huỷ</Tag>;
              else if (record.status === 0)
                return <Tag color={"gold"}>Chờ khách hàng gửi order</Tag>;
              else if (record.status === 1)
                return (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => confirmOrder2(record.id)}
                  >
                    Chờ nhân viên xác nhận order
                  </Button>
                );
              else if (record.status === 2)
                return <Tag color={"gold"}>Chờ khách hàng đặt cọc</Tag>;
              else if (record.status === 3)
                return (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => confirmOrder4(record.id)}
                  >
                    Chờ nhân viên xác nhận đặt cọc
                  </Button>
                );
              else if (record.status === 4)
                return <Tag color={"gold"}>Chờ khách hàng đến nhà hàng</Tag>;
              else if (record.status === 5)
                return (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => confirmOrder6(record.id)}
                  >
                    Đang phục vụ
                  </Button>
                );
              else if (record.status === 6)
                return <Tag color={"success"}>Hoàn thành</Tag>;
            }}
          />
          <Table.Column
            title="Mã trạng thái"
            dataIndex="status"
            key="statusId"
            align="center"
            width={80}
            filters={[
              { text: "Đã huỷ", value: "-1" },
              { text: "Chờ khách hàng gửi order", value: "0" },
              { text: "Chờ nhân viên xác nhận order", value: "1" },
              { text: "Chờ khách hàng đặt cọc", value: "2" },
              { text: "Chờ nhân viên xác nhận đặt cọc", value: "3" },
              { text: "Chờ khách hàng đến nhà hàng", value: "4" },
              { text: "Đang phục vụ", value: "5" },
              { text: "Hoàn thành", value: "6" },
            ]}
            onFilter={(value, record) => record.status === +value}
          />
        </Table>
      </Row>
    </>
  );
}

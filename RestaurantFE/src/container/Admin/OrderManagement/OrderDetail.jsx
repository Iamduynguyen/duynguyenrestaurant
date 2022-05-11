import { Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const OrderDetail = (props) => {
  const navigation = useNavigate();
  let { orderId } = useParams();
  let { tableId } = useParams();

  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    console.log(props.foodsAtTable);

    // Validate access when not matching tableId & orderId
    if (
      props.foodsAtTable.orderId !== +orderId &&
      props.foodsAtTable.tablesId !== +tableId
    ) {
      navigation("/404");
    }

    if (props.foodsAtTable.foodOrders) {
      setTableData(
        props.foodsAtTable.foodOrders.map((item, index) => {
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
  }, []);

  return (
    <>
      <Row>
        <div className="adm-section">
          <h2>Mã hoá đơn {props.foodsAtTable.orderId}</h2>
          <h2>Bàn số {props.foodsAtTable.tablesId}</h2>
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
            title="Tên món"
            dataIndex="foodName"
            key="foodName"
            align="center"
          />
          <Table.Column
            title="Số lượng"
            dataIndex="quantity"
            key="quantity"
            width={100}
          />
          <Table.Column
            title="Giá"
            dataIndex="amount"
            key="amount"
            align="right"
            width={200}
          />
          <Table.Column title="Ghi chú" dataIndex="note" key="note" />
        </Table>
      </Row>
    </>
  );
};

export default OrderDetail;

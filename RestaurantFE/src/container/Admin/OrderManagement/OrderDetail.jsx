import { Row, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Button, IconButton } from "@mui/material";
import Swal from "sweetalert2";
import ModalMessage from "../../../components/Modal/ModalMessage";
import OrdersAPI from "../../../API/OrdersAPI";

const OrderDetail = (props) => {
  const navigation = useNavigate();
  let { orderId } = useParams();
  let { tableId } = useParams();

  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const xacnhanOderdetail = async (id) => {
    const rs = await OrdersAPI.xacnhanOderdetail(id);
    if (rs === "success") {
      ModalMessage.miniTopRightModal("success", `Thành công!`);
    } else {
      ModalMessage.miniTopRightModal("error", `Lỗi<br/>Vui lòng thử lại sau!`);
    }
  };

  // API OrderDetail
  const addQty = async (foodOrders) => {
    const { value: qty } = await Swal.fire({
      title: `Món ${foodOrders.foodName}`,
      input: "text",
      inputLabel: "Nhập số lượng cần thêm",
      inputPlaceholder: "Số lượng thêm vào",
      confirmButtonText: "Thêm",
      confirmButtonColor: "#19a400",
    });
    if (qty) {
      if (!/^\d+$/.test(qty)) {
        ModalMessage.miniTopRightModal(
          "error",
          `Số lượng vừa nhập<br>không hợp lệ!`
        );
      } else if (+qty <= 0) {
        ModalMessage.miniTopRightModal("warning", `Số lượng phải lớn hơn 0!`);
      } else {
        const data = {
          tableId: foodOrders.orderTableId,
          idFoodCounters: [{ foodId: foodOrders.foodDetailsId, quantity: qty }],
        };
        const res = await OrdersAPI.addQty(data);
        console.log(res);
        if (res === "SUCCESS") {
          ModalMessage.middleModal(
            "success",
            `Hoá đơn ${props.foodsAtTable.orderId}<br>Bàn số ${props.foodsAtTable.tablesId}<br>Đã thêm ${qty} x ${foodOrders.foodName}`,
            "oke"
          );
          navigation("/admin/orders-management");
        } else {
          ModalMessage.miniTopRightModal(
            "error",
            `Lỗi<br/>Vui lòng thử lại sau!`
          );
        }
      }
    }
  };
  const removeQty = async (foodOrders) => {
    if (+foodOrders.quantity <= 1) {
      ModalMessage.miniTopRightModal(
        "error",
        `Số lượng đạt giới hạn<br>Không thể trừ thêm!`
      );
    } else {
      const { value: qty } = await Swal.fire({
        title: `Món ${foodOrders.foodName}`,
        input: "text",
        inputLabel: "Nhập số lượng cần trừ",
        inputPlaceholder: "Số lượng trừ đi",
        confirmButtonText: "Trừ",
        confirmButtonColor: "#c20000",
      });
      if (qty) {
        if (!/^\d+$/.test(qty)) {
          ModalMessage.miniTopRightModal(
            "error",
            `Số lượng vừa nhập<br>không hợp lệ!`
          );
        } else if (+qty > +foodOrders.quantity) {
          ModalMessage.miniTopRightModal(
            "error",
            `Vượt quá số lượng hiện tại!`
          );
        } else {
          const data = {
            orderDetails: [{ orderDetailsId: foodOrders.id, quantity: qty }],
          };
          const res = await OrdersAPI.removeQty(data);
          if (res === "SUCCESS") {
            ModalMessage.middleModal(
              "success",
              `Hoá đơn ${props.foodsAtTable.orderId}<br>Bàn số ${props.foodsAtTable.tablesId}<br>Đã trừ ${qty} x ${foodOrders.foodName}`
            );
            navigation("/admin/orders-management");
          } else {
            ModalMessage.miniTopRightModal(
              "error",
              `Lỗi<br/>Vui lòng thử lại sau!`
            );
          }
        }
      }
    }
  };
  const cancelTable = async () => {
    Swal.fire({
      title: `Huỷ bàn ${props.foodsAtTable.tablesId}`,
      html: `Bạn có chắc chắn muốn huỷ bàn này khỏi<br>hoá đơn ${props.foodsAtTable.orderId} không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#12a524",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, huỷ ngay!",
      cancelButtonText: "Không, xem xét lại!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await OrdersAPI.cancelTable(
          props.foodsAtTable.orderTableId
        );
        if (res === "SUCCESS") {
          ModalMessage.miniTopRightModal(
            "success",
            `Huỷ bàn ${props.foodsAtTable.tablesId} thành công!`
          );
          navigation("/admin/orders-management");
        } else {
          ModalMessage.miniTopRightModal(
            "error",
            `Lỗi<br/>Vui lòng thử lại sau!`
          );
        }
      }
    });
  };
  const deleteOrderDetails = async (data) => {
    if (data.length === 0) {
      ModalMessage.miniTopRightModal("warning", "Chưa chọn món cần xoá!");
    } else {
      Swal.fire({
        title: `Xoá món ăn`,
        html: `Bạn có chắc chắn muốn xoá<br>${data.map(
          (e) => e.foodName
        )}<br> khỏi hoá đơn không?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#12a524",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, huỷ ngay!",
        cancelButtonText: "Không, xem xét lại!",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const reqData = { ids: data.map((e) => e.id) };
          const res = await OrdersAPI.deleteOrderDetails(reqData);
          if (res === "SUCCESS") {
            ModalMessage.miniTopRightModal(
              "success",
              `Xoá ${data.length} món ăn thành công!`
            );
            navigation("/admin/orders-management");
          } else {
            ModalMessage.miniTopRightModal(
              "error",
              `Lỗi<br/>Vui lòng thử lại sau!`
            );
          }
        }
      });
    }
  };

  // Config checkbox for Table
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
    onSelect: (record, selected, selectedRows) => {
      setSelectedRow(selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      setSelectedRow(selectedRows);
    },
  };

  useEffect(() => {
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
            orderTime: moment(
              new Date(item.orderTime * 1000).toString()
            ).format("DD/MM/YYYY hh:mm"),
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
          <h3>Mã hoá đơn {props.foodsAtTable.orderId}</h3>
          <h4>Bàn số {props.foodsAtTable.tablesId}</h4>
        </div>
        <div className="table-header__btn">
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => navigation("/admin/orders-management")}
            startIcon={<ArrowBackRoundedIcon />}
          >
            Quay lại
          </Button>
          {props.orderStatus !== 6 && props.orderStatus !== -1 && (
            <>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DoDisturbIcon />}
                onClick={() => {
                  cancelTable();
                }}
              >
                Huỷ bàn
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={() => {
                  deleteOrderDetails(selectedRow);
                }}
              >
                Xoá
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                startIcon={<AddRoundedIcon />}
                onClick={() =>
                  navigation(
                    `/admin/orders-management/${props.foodsAtTable.orderId}/${props.foodsAtTable.tablesId}/add`
                  )
                }
              >
                Thêm món
              </Button>
            </>
          )}
        </div>
        <Table
          loading={loading}
          size="small"
          bordered={true}
          pagination={true}
          dataSource={tableData}
          rowSelection={{ ...rowSelection }}
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
            key="foodName"
            align="left"
            width={400}
            render={(record) => {
              return (
                <span>
                  {record.foodName} <br />
                  Size {record.size}
                </span>
              );
            }}
          />
          <Table.Column
            title="Số lượng"
            key="quantity"
            align="center"
            width={120}
            render={(record) => {
              return (
                <>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => addQty(record)}
                  >
                    <AddRoundedIcon fontSize="small" color="success" />
                  </IconButton>
                  <span style={{ padding: "0 5px" }}>{record.quantity}</span>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => removeQty(record)}
                  >
                    <RemoveRoundedIcon fontSize="small" color="error" />
                  </IconButton>
                </>
              );
            }}
          />
          <Table.Column
            title="Giá"
            dataIndex="amount"
            key="amount"
            align="right"
            width={150}
            render={(text) => {
              if (text !== null) {
                return `${text
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
              } else {
                return `0 VNĐ`;
              }
            }}
          />
          <Table.Column
            title="Tổng tiền"
            key="amount"
            align="right"
            width={150}
            render={(record) => {
              if (record !== null && record.amount !== null) {
                return `${(
                  record.amount*record.quantity
                )
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
              } else {
                return `0 VNĐ`;
              }
            }}
          />
          <Table.Column
            title="Trạng thái"
            width={150}
            dataIndex="status"
            key="note"
          />
          <Table.Column
            title="Action"
            dataIndex="note"
            render={(record) => {
              return (
                <button
                  onClick={() => xacnhanOderdetail(record.id)}
                  style={{
                    padding: "5px",
                    backgroundColor: "blue",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  Xác nhận
                </button>
              );
            }}
            key="note"
          />
        </Table>
      </Row>
    </>
  );
};

export default OrderDetail;

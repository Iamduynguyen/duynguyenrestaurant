import { Button, IconButton,DialogContent,DialogTitle, Dialog,  DialogActions } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import OrdersAPI from "../../../API/OrdersAPI";
import { Row, Table, Button as message } from "antd";
import ModalMessage from "../../../components/Modal/ModalMessage";
import Modal from "react-modal";
import Swal from "sweetalert2";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    width: "600px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// const modalStyle = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     width: "600px",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//   },
// };

export default function FoodsAdmin(props) {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [noteModal, setNoteModal] = useState("");
  const [modalChangeTime, setmodalChangeTime] = useState(false);
  const [start, setStart] = useState(moment);
  const [datestart, setDateStart] = useState(moment);
  const [Idd, setIDd] = useState("");
  let tempVoucherId = "";

  const [resetData, setResetData] = useState(false);

  // API Staff confirm
  const staffConfirmOrderOnline = async (id) => {
    const res = await OrdersAPI.staffConfirmOrderOnline(id);
    if (res === "SUCCESS") {
      ModalMessage.miniTopRightModal("success", "Xác nhận đơn thành công");
    } else {
      ModalMessage.miniTopRightModal("error", `Lỗi<br/>Vui lòng thử lại sau!`);
    }
    setResetData(!resetData);
  };

  const changeTime = async (id,startTime) => {
    setStart(startTime);
    setIDd(id);
      setmodalChangeTime(true);
  };

  const confirmTime = async () => {
    const startLong = new Date(datestart+" "+start+":00").getTime()/1000;
    const endLong = new Date(datestart+" "+start+":00").setHours(new Date(datestart+" "+start+":00").getHours()+3)/1000;
    
  };



  const xacsnhandennhahang = async (id) => {
    const res = await OrdersAPI.staffConfirmKhden(id);
    if (res === "SUCCESS") {
      ModalMessage.miniTopRightModal("success", "Xác nhận đơn thành công");
    } else {
      ModalMessage.miniTopRightModal("error", `Lỗi<br/>Vui lòng thử lại sau!`);
    }
  };

  const staffConfirmDepositOnline = async (id) => {
    const { value: deposit } = await Swal.fire({
      title: `Xác nhận hoá đơn ${id}`,
      input: "text",
      inputLabel: "Nhập số tiền đặt cọc",
      inputPlaceholder: "Tiền đặt cọc",
      confirmButtonText: "Xác nhận",
    });
    if (deposit !== undefined) {
      if (deposit === "") {
        const data = { id: id, deposit: +deposit };
        const res = await OrdersAPI.staffConfirmDepositOnline(data);
        if (res === "SUCCESS") {
          ModalMessage.miniTopRightModal(
            "success",
            "Xác nhận đơn đặt thành công"
          );
        } else {
          ModalMessage.miniTopRightModal(
            "error",
            `Lỗi<br/>Vui lòng thử lại sau!`
          );
        }
        setResetData(!resetData);
      } else if (!/^\d+$/.test(deposit)) {
        ModalMessage.miniTopRightModal(
          "error",
          `Số tiền vừa nhập<br>không hợp lệ!`
        );
      } else {
        const data = { id: id, deposit: +deposit };
        const res = await OrdersAPI.staffConfirmDepositOnline(data);
        if (res === "SUCCESS") {
          ModalMessage.miniTopRightModal(
            "success",
            "Xác nhận đặt cọc thành công"
          );
        } else {
          ModalMessage.miniTopRightModal(
            "error",
            `Lỗi<br/>Vui lòng thử lại sau!`
          );
        }
        setResetData(!resetData);
      }
    }
  };
  const staffConfirmPayment = async (input) => {
    console.log(input);

    const { value: formValues } = await Swal.fire({
      title: `Xác nhận thanh toán<br>Hoá đơn ${input.id}<br>${input.price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`,
      icon: "info",
      html:
        '<input id="custMoney" class="swal2-input" placeholder="Nhập số tiền khách trả">' +
        '<input id="voucher" class="swal2-input" placeholder="Mã voucher (Nếu có)">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#12a524",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ bỏ",
      reverseButtons: true,
      preConfirm: () => {
        return {
          custMoney: document.getElementById("custMoney").value,
          voucher: document.getElementById("voucher").value,
        };
      },
    });

    if (!formValues.custMoney) {
      ModalMessage.middleModal("error", `Vui lòng nhập số tiền khách trả!`);
    } else {
      // Validate input money
      if (!/^\d+$/.test(formValues.custMoney)) {
        ModalMessage.middleModal(
          "error",
          `Số tiền vừa nhập không hợp lệ!<br>Vui lòng chỉ nhập số!`
        );
      } else if (+formValues.custMoney < input.price) {
        ModalMessage.middleModal(
          "error",
          `Số tiền vừa nhập không đủ!<br>Vui lòng nhập lại!`
        );
      } else {
        // Validate input voucher
        if (formValues.voucher !== "" && !/^\d+$/.test(formValues.voucher)) {
          ModalMessage.middleModal(
            "error",
            `Mã voucher "${formValues.voucher}"<br>không hợp lệ!<br>Vui lòng chỉ nhập số!`
          );
        } else {
          // Collect data confirm payment
          const data = {
            orderId: input.id,
            voucherId: formValues.voucher,
            nameCust: input.customer?.name,
            phoneNumberCust: input.customer?.phoneNumber,
            returnCustMoney: +formValues.custMoney - input.price,
            custMoney: formValues.custMoney,
          };
          const res = await OrdersAPI.staffConfirmPayment(data);
          if (res === "NO ITEM ORDERED") {
            ModalMessage.middleModal("info", `Chưa có món ăn được đặt!`);
          } else if (res === "VOUCHER NOT") {
            ModalMessage.middleModal(
              "error",
              `Mã voucher ${data.voucherId} không tồn tại!`
            );
          } else if (res === "VOUCHER EXITS") {
            ModalMessage.middleModal(
              "error",
              `Mã voucher ${data.voucherId} đã được áp dụng trước đó!`
            );
          } else if (res === "SUCCESS") {
            let returnCustMoney = "";
            if (data.returnCustMoney !== 0) {
              returnCustMoney = `<br>Số tiền hoàn trả ${data.returnCustMoney
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`;
            }
            ModalMessage.middleModal(
              "success",
              `Thanh toán<br>Hoá đơn ${data.orderId} hoàn tất!${returnCustMoney}`
            );
          } else {
            ModalMessage.middleModal("error", `Lỗi! Vui lòng thử lại sau!`);
          }
          setResetData(!resetData);
        }
      }
    }
  };

  const deleteOrder = async (id) => {
    Swal.fire({
      title: `Huỷ<br>Hoá đơn ${id}`,
      text: "Bạn có chắc chắn không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#12a524",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, huỷ ngay!",
      cancelButtonText: "Không, xem xét lại!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await OrdersAPI.deleteOrder(id);
        if (res === "SUCCESS") {
          ModalMessage.miniTopRightModal(
            "success",
            `Huỷ hoá đơn ${id} thành công!`
          );
        } else {
          ModalMessage.miniTopRightModal(
            "error",
            `Lỗi<br/>Vui lòng thử lại sau!`
          );
        }
        setResetData(!resetData);
      }
    });
  };

  // Update food at table
  const updateFood = (data, orderStatus) => {
    props.setFoodsAtTable(data);
    props.setOrderStatus(orderStatus);
    navigation(`${data.orderId}/${data.tablesId}`);
  };

  const onModalClose = () => {
    setModalIsOpen(false);
    setmodalChangeTime(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await OrdersAPI.getAllOrders();
      console.log(res);
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
              orderTime: moment(
                new Date(item.orderTime * 1000).toString()
              ).format("DD/MM/YYYY hh:mm:ss"),
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
          <h3>Danh sách hoá đơn</h3>
        </div>
        <div className="table-header__btn">
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => navigation("create")}
            startIcon={<AddRoundedIcon />}
          >
            Tạo mới
          </Button>
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
            // dataIndex="orderId"
            key="orderId"
            align="center"
            width={100}
            sorter={(a, b) => a.orderId - b.orderId}
            render={(record) => {
              return (
                <Button
                  style={{ textDecoration: "underline" }}
                  color="primary"
                  onClick={() => {
                    setModalIsOpen(true), setNoteModal(record.note);
                  }}
                >
                  {record.orderId}
                </Button>
              );
            }}
          />
          <Table.Column
            title="Khách hàng"
            // dataIndex="customerName"
            key="orderId"
            width={200}
            render={(record) => {
              return (
                <Button
                style={{fontSize:'small'}}
                  color="primary"
                  onClick={() => {
                    setModalIsOpen(true), setNoteModal('STD:' + record.customer.phoneNumber);
                  }}
                >
                  {record.customerName}
                </Button>
              );
            }}
            sorter={(a, b) => a.customerName.localeCompare(b.customerName)}
          />
          <Table.Column
            title="Tổng tiền"
            dataIndex="amountTotal"
            key="amountTotal"
            align="right"
            sorter={(a, b) => +a.price - +b.price}
            render={(text) =>
              `${text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ`
            }
          />
          <Table.Column
            title="Thời gian dự kiến"
            // dataIndex="orderTime"
            key="orderTime"
            render={(record) => {
              return (
                <Button
                style={{fontSize:'small'}}
                  color="primary"
                  onClick={() => {
                    changeTime(record.orderId,record.orderTime,record.endTime);
                  }}
                >
                  {record.orderTime}
                </Button>
              );
            }}
            align="center"
            width={200}
          />
          <Table.Column
            title="Bàn đặt"
            key="table"
            width={385}
            render={(record) => (
              <div className="action__column--btn_table">
                {record.orders.map((item) => (
                  <Button
                    key={item.orderTableId}
                    variant="contained"
                    size="medium"
                    onClick={() => updateFood(item, record.status)}
                    color={item.foodOrders.length === 0 ? "primary" : "success"}
                    title={
                      item.foodOrders.length === 0
                        ? "Chưa gọi món"
                        : "Đã gọi món"
                    }
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
                return (
                  <Button variant="contained" disabled>
                    Đã huỷ
                  </Button>
                );
              else if (record.status === 0)
                return (
                  <Button variant="contained" color="warning">
                    Chờ khách hàng gửi order
                  </Button>
                );
              else if (record.status === 1)
                return (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => staffConfirmDepositOnline(record.id)}
                  >
                    Chờ nhân viên
                    <br />
                    xác nhận đơn
                  </Button>
                );
              else if (record.status === 2)
                return (
                  <Button variant="contained" color="warning">
                    Chờ khách hàng
                    <br />
                    đặt cọc
                  </Button>
                );
              else if (record.status === 3)
                return (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => staffConfirmOrderOnline(record.id)}
                  >
                    Chờ nhân viên
                    <br />
                    xác nhận đặt cọc
                  </Button>
                );
              else if (record.status === 4)
                return (
                  <Button onClick={()=>xacsnhandennhahang(record.id)} variant="contained" color="warning">
                    Chờ khách hàng
                    <br />
                    đến nhà hàng
                  </Button>
                );
              else if (record.status === 5)
                return (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => staffConfirmPayment(record)}
                  >
                    Đang phục vụ
                  </Button>
                );
              else if (record.status === 6)
                return (
                  <Button variant="contained" color="success">
                    Hoàn thành
                  </Button>
                );
            }}
          />
          <Table.Column
            title=""
            key="status"
            align="center"
            width={100}
            render={(record) => {
              if (record.status !== -1 && record.status !== 6) {
                return (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteOrder(record.id)}
                  >
                    Huỷ
                  </Button>
                );
              }
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={onModalClose}
        style={modalStyle}
        ariaHideApp={false}
        contentLabel="Note"
      >
        <div  className="header">
          <h1>Chi tiết </h1>
          <IconButton
            aria-label="delete"
            size="small"
            style={{ width: "30px", height: "30px" }}
            onClick={onModalClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <div style={{color:'blue',fontWeight:'bold'}}>{noteModal}</div>
      </Modal>
      {changeTime && (
        <Dialog open={modalChangeTime} onClose={() => setmodalChangeTime(false)}>
          <DialogTitle sx={{ textAlign: "center",width : '550px',height: '270px', backgroundColor: 'LightYellow' }}>
            <h2>Đổi thời gian hóa đơn</h2>
          <div style={{ marginBottom: "5px", display: "flex", gap: 10 }}>
            <input
              type="date"
              id="appt"
              name="appt"
              min="09:00"
              max="22:30"
              required
              style={{
                background: "#9c27b029",
                border: "1px solid #9c27b029",
                borderRadius: "5px",
                padding: "5px",
              }}
              onChange={(event)=>setDateStart(event.target.value)}
            />
            <input
              type="time"
              id="appt"
              name="appt"
              min="09:00"
              max="22:30"
              required
              onChange={(event)=>setStart(event.target.value)}
              style={{
                background: "#9c27b029",
                border: "1px solid #9c27b029",
                borderRadius: "5px",
                padding: "5px",
              }}
            />
            <Button
              onClick={()=>confirmTime()}
              variant="contained"
              color="secondary"
              startIcon={<EventAvailableIcon />}
            >
              OK
            </Button>
          </div>
          </DialogTitle>
        </Dialog>
      )}
    </>
  );
}

import { Button } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LockOutlined from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import CustomerApi from "../../../API/CustomerApi";
import { Row, Table, Button as message } from "antd";
import ModalMessage from "../../../components/Modal/ModalMessage";
import Swal from "sweetalert2";

export default function Customer(props) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigate();
  let tempVoucherId = "";

  const [resetData, setResetData] = useState(false);

  const fetchData = async () => {
    const res = await CustomerApi.getListCustomer();
    if (res) {
      setTableData(
        res.map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phoneNumber,
          };
        })
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resetData]);

  const lockCustomer = (id) => {
    Swal.fire({
      title: `Xoá khách hàng`,
      html: `Bạn có chắc chắn muốn xoá khách hàng này?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#12a524",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy bỏ",
      reverseButtons: true,
    }).then(async (result) => {
      console.log(result);
      if(result.isConfirmed){
        await CustomerApi.deleteCustomer(id);
        Swal.fire({
          title: `Thành công`,
          html: `Khóa tài khoản thành công!`,
          icon: "success",
          confirmButtonColor: "#12a524",
          confirmButtonText: "Xóa",
          reverseButtons: true,
        });
      }
      // await CustomerApi.getListCustomer();
      fetchData();
    });
  }

  return (
    <>
      <Row>
        <div className="adm-section">
          <h3>Danh sách khách hàng</h3>
        </div>
        <div className="table-header__btn">
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => navigation("create")}
            startIcon={<AddRoundedIcon />}
          >
            Thêm mới
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
            title="Mã khách hàng"
            dataIndex="id"
            key="id"
            align="left"
            width={80}
          />
          <Table.Column
            title="Họ tên"
            dataIndex="name"
            key="name"
            align="left"
            width={200}
          />
          <Table.Column
            title="Email"
            dataIndex="email"
            key="email"
            align="left"
            width={200}
          />
          <Table.Column
            title="Số điện thoại"
            dataIndex="phone"
            key="phone"
            width={200}
            align="left"
      
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
                    startIcon={<LockOutlined />}
                    onClick={() => lockCustomer(record.id)}
                  >
                    Khóa
                  </Button>
                );
              }
            }}
          />
        </Table>
      </Row>
    </>
  );
}

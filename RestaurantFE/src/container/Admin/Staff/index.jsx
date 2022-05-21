import { Button } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LockOutlined from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";
import CustomerApi from "../../../API/CustomerApi";
import StaffApi from "../../../API/StaffApi";
import { Row, Table, Button as message } from "antd";
import ModalMessage from "../../../components/Modal/ModalMessage";
import Swal from "sweetalert2";
import StaffAPi from "../../../API/StaffApi";

export default function Staff(props) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const navigation = useNavigate();
  let tempVoucherId = "";

  const [resetData, setResetData] = useState(false);

  const fetchData = async () => {
    const res = await StaffApi.getAllStaff();
    if (res) {
      setTableData(
        res.map((item, index) => {
          return {
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phoneNumber,
            gender: item.gender
          };
        })
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resetData]);

  const deleteStaff = (id) => {
    Swal.fire({
      title: `Xoá nhân viên`,
      html: `Bạn có chắc chắn muốn xóa nhân viên này?`,
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
        await StaffAPi.deleteStaff(id);
        Swal.fire({
          title: `Thành công`,
          html: `Xóa nhân viên thành công!`,
          icon: "success",
          confirmButtonColor: "#12a524",
          confirmButtonText: "Đóng",
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
          <h3>Danh sách nhân viên</h3>
        </div>
        <div className="table-header__btn">
        <Link to="/admin/staff/new-staff">
        <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => navigation("create")}
            startIcon={<AddRoundedIcon />}
          >
            Thêm mới
        </Button>
        </Link>
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
            title="Giới tính"
            dataIndex="gender"
            key="gender"
            width={200}
            align="left"
      
          />
            <Table.Column
            title=""
            key="status"
            align="center"
            width={200}
            render={(record) => {
              if (record.status !== -1 && record.status !== 6) {
                return (
                  <>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<LockOutlined />}
                    onClick={() => deleteStaff(record.id)}
                  >Xóa
                  
                  </Button> &ensp;
                          <Link to={`/admin/staff/update-staff/${record.id}`}>
                          <Button
                    variant="contained"
                    color="info"
                    startIcon={<LockOutlined />}
                  >
                    Sửa
                  </Button>
        </Link>
                  
                  </>
                );
              }
            }}
          />
        </Table>
      </Row>
    </>
  );
}

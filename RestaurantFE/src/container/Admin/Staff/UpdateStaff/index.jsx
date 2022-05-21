import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import StaffApi from "../../../../API/StaffApi";
import CategoriesAPI from "../../../../API/CategoriesAPI";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Form, message, Row, Input, Select as AntdSelect, Button as AntdButton } from "antd";
import { useForm } from "antd/lib/form/Form";
import Swal from "sweetalert2";

export default function UpdateStaff() {
  const [staff, setStaff] = useState([]);
  const [form] = useForm();
  let { id } = useParams();

  const fetchData = async () => {
    const res = await StaffApi.getStaff(id);
    setStaff(res);
    console.log(staff);
    document.getElementById('id').value = res.id
    document.getElementById('name').value = res.name
    document.getElementById('email').value = res.email
    document.getElementById('phone').value = res.phoneNumber
    if (res.gender == 'Nam') {
      document.getElementById('maleR').checked = true;
    } else {
      document.getElementById('femaleR').checked = true;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitUpdateStaff = async () => {
    let newStaff = {
      id: document.getElementById('id').value,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phoneNumber: document.getElementById('phone').value,
      gender: document.getElementById('maleR').checked ? 'Nam' : 'Nữ'
    }
    await StaffApi.updateStaff(newStaff.id, newStaff);

    Swal.fire({
      title: `Thành công`,
      html: `Thêm nhân viên thành công!`,
      icon: "success",
      confirmButtonColor: "#12a524",
      confirmButtonText: "Đóng",
      reverseButtons: true,
    }).then(async (result) => {
      document.getElementById('linkToStaff').click();
    })
  }


  return (
    <>
      <Row>
        <Link to="/admin/staff" id="linkToStaff" style={{ display: 'none' }}>

        </Link>
        <div className="adm-section">
          <h2>Cập nhật nhân viên</h2>
          <TextField
              sx={{ display: 'none' }}
              variant="standard"
              id="id"
            />
          <Box>
            <p>Tên nhân viên:</p>
            <TextField
              sx={{ width: '100%' }}
              variant="standard"
              id="name"
            />
          </Box>
          <br></br>
          <Box>
            <p>Số điện thoại:</p>

            <TextField
              sx={{ width: '100%' }}
              variant="standard"
              id="phone"
            />
          </Box>
          <br></br>
          <Box>
            <p>Email:</p>

            <TextField
              sx={{ width: '100%' }}
              variant="standard"
              id="email"
            />
          </Box>


            <br />
            <div>
              <input type="radio" id="maleR" name="gender" /> Nam  &ensp;
              <input type="radio" id="femaleR" name="gender" /> Nữ
              <br /><br />
            </div>

            <Form.Item>
              <AntdButton onClick={submitUpdateStaff} className="my-btn my-btn--primary">Cập nhật</AntdButton>
            </Form.Item>
        </div>
      </Row>
    </>
  );
}


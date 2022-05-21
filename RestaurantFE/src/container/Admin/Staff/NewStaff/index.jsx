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
  import { useNavigate, Link } from "react-router-dom";
  import { Form, message, Row, Input, Select as AntdSelect, Button as AntdButton } from "antd";
  import { useForm } from "antd/lib/form/Form";
  import Swal from "sweetalert2";

  export default function NewStaff() {
    const [form] = useForm();


    const onFinish = async (values) => {
      let newStaff = {
        name: values.name,
        phoneNumber: values.phone,
        email: values.email,
        gender: document.getElementById('maleR').checked ? 'Nam' : 'Nữ'
      }
      
      StaffApi.saveStaff(newStaff)
      Swal.fire({
        title: `Thành công`,
        html: `Thêm nhân viên thành công!`,
        icon: "success",
        confirmButtonColor: "#12a524",
        confirmButtonText: "Xóa",
        reverseButtons: true,
      }).then(async (result) => {
        document.getElementById('linkToStaff').click();
      })
    }
  


    return (
      <>
        <Row>
        <Link to="/admin/staff" id="linkToStaff" style={{display: 'none'}}>
        
        </Link>
          <div className="adm-section">
            <h2>Thêm nhân viên</h2>
            <Form
              labelCol={24}
              wrapperCol={24}
              layout='vertical'
              form={form}
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                label="Tên nhân viên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhân viên!"
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!"
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!"
                  },
                ]}
                hasFeedback
              >
                <Input />
              </Form.Item>
            <div>
                <input type="radio" id="maleR" name="gender" checked/> Nam  &ensp;
                <input type="radio" id="femaleR" name="gender"/> Nữ   
                <br /><br />
            </div>

              <Form.Item>
                <AntdButton htmlType="submit" className="my-btn my-btn--primary">Thêm nhân viên</AntdButton>
              </Form.Item>
            </Form>
          </div>
        </Row>
      </>
    );
  }

  
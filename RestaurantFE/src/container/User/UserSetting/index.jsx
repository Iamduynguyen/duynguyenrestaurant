import {
    Avatar,
    Box, Paper,
    Stack,
    Button,
    TextField,
    Typography
  } from '@mui/material';
  import React, { useEffect, useState } from 'react';
  import CustomerApi from "../../../API/CustomerApi";
  import Swal from "sweetalert2";
  
  const mobileMode = window.innerWidth <= 768;
  
  export default function UserSetting() {
    const [userData, setUserData] = useState([]);


    useEffect(() => {
      const fetchData = async () => {
        const data = await CustomerApi.getInfoCustomer();

    
        setUserData(data)
        document.getElementById('infoPhone').value = data.phoneNumber
        document.getElementById('infoFullName').value = data.name
      }

      fetchData();
    },[]);

    const changeInfo = async () => {
        let dataNew = {
            name: document.getElementById('infoFullName').value,
            phoneNumber: document.getElementById('infoPhone').value
        }
        let errors = '';
        if(dataNew.name.trim().length == 0){
            errors = errors += 'Vui lòng nhập họ tên!'
        } else if(dataNew.phoneNumber.trim().length == 0){
            errors = errors += 'Vui lòng nhập số điện thoại!\n'
        } else if(!/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(dataNew.phoneNumber.trim())){
            errors = errors += 'Số điện thoại không đúng định dạng!'
        }

        if(errors.length == 0){
            CustomerApi.updateInfoCustomer(dataNew);
            Swal.fire({title: 'Thành công!',
            text: 'Cập nhật thông tin thành công!',
            icon: 'success',
            })
        } else {
            Swal.fire({title: 'Lỗi!',
            text: errors,
            icon: 'error',
            })
        }
        
    }

    
    return (
      <Paper elevation={6}>
        <Stack spacing={2} px={20} py={2}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ width: 60, height: 60 }} />
            <Typography variant='h6' mt={1}>
              {userData.email}
            </Typography>
          </Box>

          <Box>
            <Typography>Họ tên:</Typography>
            <TextField fullWidth size='small' id="infoFullName"
            />
          </Box>
          <Box>
            <Typography>Số điện thoại:</Typography>
            <TextField fullWidth size='small' id="infoPhone"/>
          </Box>
          <Button variant='contained' onClick={changeInfo}>
            Xác nhận
          </Button>
        </Stack>
      </Paper>
    );
  }
  
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AuthAPI from "../../../API/AuthAPI";
import Swal from "sweetalert2";

export default function ChangePass() {
  const [passWord, setPassWord] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfPassword, setNewConfPassword] = useState('');
  const [hidePass, setHidePass] = useState(false);
  const [hideConfirmPass, setHideConfirmPass] = useState(false);
  const [hideNewPass, setHideNewPass] = useState(false);
  const [validPass, setValidPass] = useState('');
  const [alert, setAlert] = useState(false);

  const handlePassWord = async () => {
    let changePassword = {
      passwordOld: passWord,
      passwordNew: newPassword,
      passwordConfirm: newConfPassword
    }

    let data = await AuthAPI.changePassword(changePassword)

    if(data == 'SUCCESS'){
      Swal.fire({title: 'Thành công!',
      text: 'Thay đổi mật khẩu thành công!',
      icon: 'success',
      })
  } else if(data == 'PASS_FAIL') {
      Swal.fire({title: 'Lỗi!',
      text: 'Mật khẩu cũ không chính xác!',
      icon: 'error',
      })
  } else {
    Swal.fire({title: 'Lỗi!',
    text: 'Mật khẩu cũ và xác nhận mật khẩu phải giống nhau!',
    icon: 'error',
    })
  }

    // if (newPassword == newConfPassword) {
    //   setValidPass('');
    //   console.log('Pass: ' + passWord, 'newPassword: ' + newPassword);
    //   openAlert();
    // } else {
    //   openAlert('Mật khẩu không khớp');
    // }
  };

  const openAlert = () => {
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  };


  return (
    <Paper elevation={6}>
      <Typography variant='h5' py={2} textAlign='center'>
        Đổi mật khẩu
      </Typography>
      <Stack px={20} spacing={2} alignItems='center'>
        <FormControl
          sx={{ m: 1, width: '100%' }}
          size='small'
          variant='outlined'
        >
          <Typography>Mật khẩu cũ:</Typography>
          <OutlinedInput
            type={hidePass ? 'text' : 'password'}
            onChange={(e) => setPassWord(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={() => setHidePass(!hidePass)} edge='end'>
                  {hidePass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          sx={{ m: 1, width: '100%' }}
          size='small'
          variant='outlined'
        >
          <Typography>Mật khẩu mới:</Typography>
          <OutlinedInput
            type={hideNewPass ? 'text' : 'password'}
            onChange={(e) => setNewPassword(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => setHideNewPass(!hideNewPass)}
                  edge='end'
                >
                  {hideNewPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          sx={{ m: 1, width: '100%' }}
          size='small'
          variant='outlined'
        >
          <Typography>Xác nhận lại mật khẩu:</Typography>
          <OutlinedInput
            type={hideConfirmPass ? 'text' : 'password'}
            onChange={(e) => setNewConfPassword(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => setHideConfirmPass(!hideConfirmPass)}
                  edge='end'
                >
                  {hideConfirmPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        {validPass && (
          <Typography variant='body2' color='error'>
            {validPass}
          </Typography>
        )}
        <Box>
          <Button style={{marginBottom: '30px'}} variant='contained' onClick={handlePassWord}>
            Xác nhận
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

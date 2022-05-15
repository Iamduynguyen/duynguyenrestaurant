import { Container, Grid, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import ChangePass from './ChangePass';
import styles from './User.module.css';
import UserSetting from './UserSetting';

export default function UserSettings() {
  const [render, setRender] = useState(1);
  return (
    <Container>
      <Typography textAlign={'center'} mt={3} variant='h4'>
        Chỉnh sửa thông tin cá nhân
      </Typography>
      <Grid container spacing={2} mt={3}>
        <Grid item xs={3}>
          <Paper elevation={6}>
            <Stack spacing={3} padding={2}>
              <Typography
                onClick={() => setRender(1)}
                className={styles.SelectElement}
                variant='h6'
              >
                Thông tin của tôi
              </Typography>
              <Typography
                onClick={() => setRender(2)}
                className={styles.SelectElement}
                variant='h6'
              >
                Đổi mật khẩu
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          {render == 1 && <UserSetting />}
          {render == 2 && <ChangePass />}
        </Grid>
      </Grid>
    </Container>
  );
}
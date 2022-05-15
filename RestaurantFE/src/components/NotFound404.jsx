import Button from "@mui/material/Button";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
// import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// const Container = styled.div`
//   margin: 100px 0;
// `;

const NotFound404 = () => {
  const navigation = useNavigate();

  return (
    <Container>
      <h1 style={{ textAlign: "center", fontSize: "100px" }}>404</h1>
      <p style={{ textAlign: "center", fontSize: "30px" }}>
        Đường dẫn không khả dụng
      </p>
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => navigation("/")}
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
        >
          Quay về trang chủ
        </Button>
      </div>
    </Container>
  );
};

export default NotFound404;

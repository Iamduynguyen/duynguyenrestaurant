import {
    Button,
    Dialog,
    Divider,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    Container,
} from "@mui/material";
import { Box } from "@mui/system";

import React, { useEffect, useState } from "react";
import OrdersAPI from "../../API/OrdersAPI";
import { Row, Table, Button as message } from "antd";
import InfoIcon from '@mui/icons-material/Info';

export default function History() {
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [openTableDetail, setOpenTableDetail] = useState(false);
    const [orderHistoryDetail, setOrderHistoryDetail] = useState([]);
    const [tables, setTables] = useState([]);

    const fetchData = async () => {
        const res = await OrdersAPI.getHistoryOrder();
        if (res) {
            setTableData(
                res.map((item, index) => {
                    console.log(item);
                    return {
                        id: item.id,
                        date: item.date,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        tables: item.tables,
                        amountTotal: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amountTotal),
                        paymentType: item.paymentType
                    };
                })
            );
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenTableDetail = async (id, tables) => {
        console.log('====================================');
        const res = await OrdersAPI.getHistoryOrderDetail(id);
        console.log(res);
        setTables(tables)
        setOrderHistoryDetail(res)
        console.log('====================================');
        setOpenTableDetail(true);

    };

    return (
        <>
            <Container>
                <p style={{ marginTop: "70px" }} className="headtext__cormorant">
                    Lịch sử đặt bàn
                </p>
                <Table
                    loading={loading}
                    size="small"
                    bordered={true}
                    pagination={true}
                    dataSource={tableData}
                    style={{ width: "100%" }}
                >
                    <Table.Column
                        title="Ngày đặt"
                        dataIndex="date"
                        key="date"
                        align="left"
                        width={200}
                    />
                    <Table.Column
                        title="Bắt đầu"
                        dataIndex="startTime"
                        key="startTime"
                        align="left"
                        width={200}
                    />
                    <Table.Column
                        title="Kết thúc"
                        dataIndex="endTime"
                        key="endTime"
                        align="left"
                        width={200}
                    />
                    <Table.Column
                        title="Thành tiền"
                        dataIndex="amountTotal"
                        key="amountTotal"
                        width={200}
                        align="left"

                    />
                    <Table.Column
                        title="Loại thanh toán"
                        dataIndex="paymentType"
                        key="paymentType"
                        width={200}
                        align="left"

                    />
                    <Table.Column
                        title=""
                        key=""
                        align="center"
                        width={200}
                        render={(record) => {
                            return (
                                <>
                                    {/* <Link to={`/admin/staff/update-staff/${record.id}`}> */}
                                    <Button
                                        variant="contained"
                                        color="info"
                                        startIcon={<InfoIcon />}
                                        onClick={() => handleOpenTableDetail(record.id, record.tables)}
                                    >
                                        Chi tiết
                                    </Button>
                                    {/* </Link> */}

                                </>
                            );

                        }}
                    />
                </Table>

                <Dialog style={{maxWidth: 'auto'}} open={openTableDetail} onClose={() => setOpenTableDetail(false)}>
                    <DialogTitle>Bàn {tables}</DialogTitle>
                    <DialogContent>
                    {orderHistoryDetail?.map((item, index) => (
                        <Box
                          key={index + item.id}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          marginBottom={'20px'}
                        >
                          <Box
                            sx={{ flex: "0 0 30%" }}
                            display="flex"
                            alignItems="center"
                          >
                            <img style={{ minWidth: "80px", maxWidth: "80px", height: "auto", borderRadius: 5, marginRight: 20, }} alt="flex" src={item.foodImage} />
                            <p
                              style={{ textAlign: "left", width: '200px' }}
                              className="cart-text"
                            >
                              {item.foodName}
                            </p>
                          </Box>
                          <Divider orientation="vertical" flexItem />
                          <p className="cart-text" style={{width: '200px'}}>&ensp;Số lượng: {item.quantity}</p>
                          <Divider orientation="vertical" flexItem />
                          <p className="cart-text" style={{width: '200px'}}>
                          &ensp;Bàn {item.tableId}
                          </p>
                          <Divider orientation="vertical" flexItem />
                          <p className="cart-text" style={{width: '200px'}}>
                          &ensp;Giá {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
                          </p>
                        </Box>

                      ))}
                    </DialogContent>
                </Dialog>
            </Container>
        </>
    );
}

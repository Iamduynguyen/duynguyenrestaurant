import {
  Button,
  Dialog,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TableAPI from "./../../../API/TableAPI";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function TableAdmin() {
  const [openDLDelete, setOpenDLDelete] = useState(false);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [openTableDetail, setOpenTableDetail] = useState(false);
  const [table, setTable] = useState([]);
  const [tableStatus, setTableStatus] = useState(0);
  const [ChairNumber, setChairNumber] = useState("");
  const [select, setSelect] = useState([]);
  const [tableDetail, setTableDetail] = useState([]);
  const [resetData, setResetData] = useState(true);

  const handleChange = (event) => {
    setTableStatus(event.target.value);
  };
  const handleOpenTableDetail = async (item) => {
    setOpenTableDetail(true);
    console.log(item);
    const res = await TableAPI.getTableDetail(item.id);
    setTableDetail(res);
    console.log(res);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await TableAPI.getAllTables();
      console.log(res);
      setTable(res);
    };
    fetchData();
  }, [resetData]);
  const handleClickOpenDelete = (item) => {
    setSelect(item);
    setOpenDLDelete(true);
  };
  const handleClickOpenChangeStatus = (item) => {
    setSelect(item);
    setChairNumber(item.numberOfChair);
    setTableStatus(item.status);
    setOpenChangeStatus(true);
  };
  const confirmDeleteTable = async () => {
    setOpenDLDelete(false);
    const res = await TableAPI.deleteTable(select.id);
    console.log(res);
    setResetData(!resetData);
  };
  const confirmChangeStatus = async () => {
    setOpenChangeStatus(false);
    const table = {
      status: tableStatus,
      numberOfChair: ChairNumber,
    };
    const res = await TableAPI.updateTable(select.id, table);
    console.log(res);
    setResetData(!resetData);
  };
  const getTime = async (e) => {
    console.log(e.target);
  };
  return (
    <Grid container mt={1}>
      <div
        className="adm-section"
        style={{ display: "flex", gap: "50px", alignItems: "flex-end" }}
      >
        <h2 style={{ margin: "10px 0px 0px 0px", fontSize: 30 }}>Danh sách</h2>
        <form>
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
            />
            <input
              type="time"
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
            />
            <Button
              type="submit"
              onSubmit={(EventTarget = getTime)}
              variant="contained"
              color="secondary"
              startIcon={<EventAvailableIcon />}
            >
              OK
            </Button>
          </div>
        </form>
      </div>
      <div className="px-[30px] pt-[15px] w-full uppercase border-b dark:border-gray-700 bg-gray-50 ">
        <div className="w-full grid grid-cols-[0.5fr,3fr,4fr,3fr]">
          <p className="text-base font-bold tracking-wide text-left text-gray-500">
            #
          </p>
          <p className="text-base font-bold tracking-wide text-left text-gray-500">
            Danh sách bàn
          </p>
          <p className="text-base font-bold tracking-wide text-left text-gray-500">
            Trạng thái
          </p>
          <p className=""></p>
        </div>
      </div>
      <div className="w-full ">
        {table?.map((item, index) => (
          <div
            className="w-full px-[30px]  grid grid-cols-[0.5fr,3fr,4fr,3fr] py-[15px] border-b border-gray-300"
            key={index}
          >
            <div className="">{index + 1}</div>
            <div className="">Table {item.id}</div>
            <div className="text-gray-400 text-red">
              {item.status == 0 ? "Khả dụng" : "Không khả dụng"}
            </div>

            <div className="flex justify-end">
              <Stack direction="row" spacing={1} position="absolute">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenTableDetail(item)}
                >
                  C.tiết bàn
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => handleClickOpenChangeStatus(item)}
                >
                  Sửa T.thái
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleClickOpenDelete(item)}
                >
                  Xóa
                </Button>
              </Stack>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={openDLDelete} onClose={() => setOpenDLDelete(false)}>
        <DialogTitle>{"Xóa thông tin bàn " + select.id}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn chắc chắn muốn xóa bàn {select.id}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDLDelete(false)}>Disagree</Button>
          <Button onClick={confirmDeleteTable} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for edit status */}
      <Dialog
        open={openChangeStatus}
        onClose={() => setOpenChangeStatus(false)}
      >
        <DialogTitle>{"Sửa trạng thái bàn: " + select.id}</DialogTitle>
        <DialogContent>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="StatusTable">Trạng thái bàn</InputLabel>
            <Select
              fullWidth
              labelId="StatusTable"
              value={tableStatus}
              onChange={handleChange}
              label="Trạng thái bàn"
              sx={{ mb: 3 }}
            >
              <MenuItem value={0}>Bàn đang khả dụng</MenuItem>
              <MenuItem value={1}>Bàn không khả dụng</MenuItem>
            </Select>
            <TextField
              variant="standard"
              label="Số ghế"
              defaultValue={ChairNumber}
              fullWidth
              onChange={(e) => setChairNumber(e.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDLDelete(false)}>Disagree</Button>
          <Button onClick={confirmChangeStatus} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openTableDetail} onClose={() => setOpenTableDetail(false)}>
        <DialogTitle>{`Chi tiết bàn ${tableDetail?.id}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>{`Bàn ${tableDetail.id} - Số ghế ${tableDetail.numberOfChair}`}</Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

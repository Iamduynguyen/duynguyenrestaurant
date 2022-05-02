import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery

} from '@mui/material';
import { Row, Table, Button as AntdButton, Modal, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import CategoryAPI from '../../../API/CategoriesAPI';
import styles from './Categories.module.css';
import { EditOutlined, DeleteOutlined, FileSearchOutlined } from '@ant-design/icons';


export default function CategoriesAdmin() {
  const [tableData, setTableData] = useState([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("Bạn có thực sự muốn xóa không ?!?");


  const [isCreate, setIsCreate] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const isMobile = useMediaQuery('(max-width:600px)');
  const [Categories, setCategories] = useState([]);
  const [openDLFix, setOpenDLFix] = useState(false);
  const [openDLDelete, setOpenDLDelete] = useState(false);
  const [fixCategory, setFixCategory] = useState('');
  const [select, setSelect] = useState(null);
  const handleClickOpenFix = (item) => {
    setSelect(item);
    setOpenDLFix(true);
  };

  const handleClickOpenDelete = (item) => {
    setSelect(item);
    setOpenDLDelete(true);
  };

  const handleClose = () => {
    setOpenDLFix(false);
    setOpenDLDelete(false);
  };

  const confirmSetFixCategory = async () => {
    setOpenDLFix(false);
    setFixCategory('');
    setSelect([]);
    const category = {
      name: fixCategory,
    };
    const res = await CategoryAPI.updateCategory(select.id, category);
    console.log(res);
  };

  const confirmDeleteCategory = async () => {
    setOpenDLDelete(false);
    setSelect([]);
    const res = await CategoryAPI.deleteCategory(select.id);
    console.log(res);
  };

  const handleDeleteCategory = async () => {
    setConfirmLoading(true);
    setConfirmText("Đang xóa...");
    console.log(select);
    const res = await CategoryAPI.deleteCategory(select.id);
    setIsConfirm(false);
    const newData = tableData.filter((item, index) => item.id !== select.id);
    setTableData(newData);
    setSelect([]);
    setConfirmLoading(false);
    setConfirmText("Bạn có thực sự muốn xóa không ?!?");
    console.log(res);
    message.success('Xóa thể loại thành công!');
  };


  const hanldeCreateCategory = async () => {
    if (select) {
      if (newCategory) {
        if (newCategory.trim().length > 0) {
          setCreateLoading(true);
          const category = {
            name: newCategory.trim(),
          };
          const res = await CategoryAPI.updateCategory(select.id, category);
          console.log(res);
          setCreateLoading(false);
          setNewCategory('');
          setIsCreate(false);
          setSelect(null)
          const newData = tableData.map((item, index) => {
            if (item.id === res.id) {
              return {
                ...res,
                key: item.id,
                stt: select.stt
              }
            } else {
              return item
            }
          })
          setTableData(newData);
          message.success('Cập nhật thể loại thành công!');
        } else {
          message.warning('Thể loại không được để trống!')
        }
      } else {
        message.warning('Thể loại không được để trống!')
      }
    } else {
      if (newCategory) {
        if (newCategory.trim().length > 0) {
          setCreateLoading(true);
          const category = {
            name: newCategory.trim(),
            deleteflag: null,
          };
          const res = await CategoryAPI.createCategory(category);
          console.log(res);
          setCreateLoading(false);
          setNewCategory('');
          setIsCreate(false);
          setTableData([
            ...tableData,
            {
              ...res,
              stt: tableData.length + 1
            }
          ])
          message.success('Thêm thể loại thành công!');
        } else {
          message.warning('Thể loại không được để trống!')
        }
      } else {
        message.warning('Thể loại không được để trống!')
      }
    }

  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await CategoryAPI.getAllCategories();
      setCategories(res);
      console.log(res);
      setTableData(res.map((item, index) => (
        {
          ...item,
          key: item.id,
          stt: index + 1
        }
      )))
    };
    fetchData();
  }, []);
  return (
    <>
      {
        false && (
          <Grid container mt={1}>
            {Categories?.map((item, index) => (
              <Grid key={item.id} className={styles.BoxCategory} item m={1}>
                <Typography width={isMobile ? 200 : '100%'}>
                  {index + 1}, {item.name}
                </Typography>
                <Stack direction='row' spacing={1} position='absolute' right='1%'>
                  <Button
                    size='small'
                    onClick={() => handleClickOpenFix(item)}
                    variant='contained'
                  >
                    Sửa
                  </Button>
                  <Button
                    size='small'
                    variant='contained'
                    color='error'
                    onClick={() => handleClickOpenDelete(item)}
                  >
                    Xóa
                  </Button>
                </Stack>
              </Grid>
            ))}
            {/* Dialog for fixCategory */}
            <Dialog open={openDLFix} onClose={handleClose}>
              <DialogTitle>{'Sửa thông tin thể loại: ' + select.name}</DialogTitle>
              <DialogContent>
                <TextField
                  label='Tên thể loại'
                  fullWidth
                  variant='standard'
                  onChange={(e) => setFixCategory(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={confirmSetFixCategory} autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
            {/* Dialog for deleteCategory */}
            <Dialog open={openDLDelete} onClose={handleClose}>
              <DialogTitle>{'Xóa trường thông tin: ' + select.name}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bạn chắc chắn muốn xóa: {select.name}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Disagree</Button>
                <Button onClick={confirmDeleteCategory} autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        )
      }



      {/* antd  */}
      <Row className={styles.content}>
        <div className="adm-section">
          <h2>Quản lý thể loại</h2>
        </div>
        <AntdButton className='my-btn my-btn--primary' onClick={() => { setIsCreate(true) }}>Thêm thể loại</AntdButton>
        <Table
          dataSource={tableData}
          bordered={true}
          className={styles.table}
          size={'small'}
          pagination={true}
        >
          <Table.Column title='STT' dataIndex="stt" key="stt" className='index__column' />
          <Table.Column
            title='ID'
            dataIndex="id"
            key="id"
            sorter={(record1, record2) => {
              return record1.id > record2.id
            }}
          />
          <Table.Column
            title='Name'
            dataIndex="name"
            key="name"
            filterIcon={<FileSearchOutlined />}
            filterDropdown={({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
              return (
                <div className="name__filter">
                  <Input
                    placeholder='Nhập tên thể loại cần tìm...'
                    autoFocus
                    value={selectedKeys[0]}
                    onChange={(e) => { setSelectedKeys(e.target.value ? [e.target.value] : []) }}
                    onPressEnter={() => { confirm() }}
                    onBlur={() => { confirm() }}
                  ></Input>
                  <div className="name__filter--action">
                    <Button onClick={() => {confirm()}}>Tìm kiếm</Button>
                    <Button onClick={() => {clearFilters(); confirm()}}>Xóa bộ lọc</Button>
                  </div>
                </div>

              )
            }}
            onFilter={(value, record) => {
              return record.name.toLowerCase().includes(value.toLowerCase())
            }}
          />
          <Table.Column title='Action' className='action__column' key="action" render={(text, record) => (
            <>
              <div className="action__column--btn">
                <AntdButton
                  className='action__column--btn__edit'
                  onClick={() => { setIsCreate(true); setSelect(record); setNewCategory(record.name) }}
                ><EditOutlined />Sửa</AntdButton>
                <AntdButton className='action__column--btn__delete' type='danger' onClick={() => { setIsConfirm(true); setSelect(record); }}><DeleteOutlined />Xóa</AntdButton>
              </div>
            </>
          )} />
        </Table>
        <Modal
          title="Xác nhận xóa ?"
          visible={isConfirm}
          onOk={() => { handleDeleteCategory() }}
          confirmLoading={confirmLoading}
          onCancel={() => { setIsConfirm(false) }}

        >
          {confirmText}
        </Modal>
        <Modal
          title={select !== null ? `Chỉnh sửa thể loại Id: ${select.id}` : 'Thêm thể loại'}
          visible={isCreate}
          onOk={() => { hanldeCreateCategory() }}
          confirmLoading={createLoading}
          onCancel={() => { setIsCreate(false), setSelect(null), setNewCategory('') }}

        >
          {createLoading && (<div>Đang tạo ...</div>)}
          <Input
            value={newCategory}
            onChange={(e) => { setNewCategory(e.target.value) }}
            disabled={createLoading}
            placeholder="Nhập thể loại..."
          />
        </Modal>
      </Row>
    </>
  );
}

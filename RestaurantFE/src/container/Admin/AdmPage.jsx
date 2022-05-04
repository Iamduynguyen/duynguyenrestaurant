import React, { useEffect, useState, useRef } from 'react'
import { Row, Col } from 'antd'
import { red } from '@ant-design/colors'
import { Menu } from 'antd';
import {BarChartOutlined,
        AppstoreOutlined,
        AlignLeftOutlined,
        RadarChartOutlined,
        ReadOutlined,
        PlusSquareOutlined,
        ChromeOutlined,
        BankOutlined,
        CalendarOutlined,
        SettingOutlined
    } from '@ant-design/icons';
import { Outlet, Link, useLocation } from 'react-router-dom';



const AdmPage = () => {
    const [selectedKey, setSelectedKey] = useState('sub-dashboard');
    
    const location = useLocation();
    const menuEleRef = useRef();

    const getItem = (label, key, icon, children, type) => (
        {
            key,
            label,
            icon,
            children,
            type
        }
    )

    const handleSelectKey = (item) => {
        setSelectedKey(item.key);
    }

    const menuItems = [
        getItem((
            <Link to="/admin">Trang chủ</Link>
        ), 'sub-dashboard', <RadarChartOutlined />),
        getItem('Thể loại', 'sub-categories', <AppstoreOutlined />, [
            getItem((
                <Link to="/admin/categories">Danh sách</Link>
            ), 'categories-opt-list', <AlignLeftOutlined />)
        ]),
        getItem((
            'Đồ ăn'
        ), 'sub-foods', <ReadOutlined />, [
            getItem((<Link to="/admin/foods">Danh sách</Link>), 'foods-opt-list', <AlignLeftOutlined />),
            getItem((<Link to="/admin/foods/new-food">Thêm món ăn</Link>), 'foods-opt-create', <PlusSquareOutlined />)
        ]),
        getItem('Quản lí bàn', 'sub-tables', <BankOutlined />, [
            getItem('Danh sách', 'tables-opt-list', <AlignLeftOutlined />),
            getItem('Thêm món ăn', 'tables-opt-create', <PlusSquareOutlined />)
        ]),
        getItem('Đơn đặt bàn', 'sub-order', <CalendarOutlined />, [
            getItem('Danh sách', 'order-opt-list', <AlignLeftOutlined />),
        ]),
        getItem('Biểu đồ thống kê', 'sub-analist', <BarChartOutlined />),
        getItem((
            <Link to="/">Website</Link>
        ), 'sub-website', <ChromeOutlined />),
        getItem('Cài đặt', 'sub-setting', <SettingOutlined />)
    ]

    useEffect(()=>{
        switch(location.pathname){
            case("/admin"):{
                setSelectedKey('sub-dashboard')
                break;
            }
            case("/admin/categories"):{
                setSelectedKey('categories-opt-list')
                break;
            }
            case("/admin/foods"):{
                setSelectedKey('foods-opt-list')
                break;
            }
            case("/admin/foods/new-food"):{
                setSelectedKey('foods-opt-create')
                break;
            }
            default:{
                break;
            }
        }
    },[])

    return (
        <Row className='adm' gutter={[0,0]}>
            <Col span={4} className='adm--sidebar'>
                <div className="adm--sibar__logo">

                </div>
                <Menu mode='inline'
                    items={menuItems} 
                    className='adm--sidebar__inner'
                    defaultSelectedKeys={'sub-dashboard'}
                    selectedKeys={selectedKey}
                    onClick={(item, key, keypath, domEvent) => {
                        handleSelectKey(item)
                    }}      
                    ref={menuEleRef}
                >
                </Menu>
            </Col>
            <Col span={20} className='adm--content' >
                <div className="adm--content__navtop">
                    
                </div>
                <div className="adm--content__detail">
                    <Outlet />
                </div>
            </Col>
        </Row>
    )
}

export default AdmPage
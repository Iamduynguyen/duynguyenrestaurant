import React from 'react';
import styles from './dashboard.css';
import { AiOutlineUser, AiOutlineDollarCircle } from 'react-icons/ai';
import { BsCalendarX } from 'react-icons/bs';
import { MdOutlineChairAlt } from 'react-icons/md';
import chartImg from '../../../assets/char-img.png';

const widgetItem = [
    {
        icon: <AiOutlineUser />,
        title: 'Total user',
        detail: '250'
    },
    {
        icon: <BsCalendarX />,
        title: 'Unchecked order',
        detail: '5'
    },
    {
        icon: <AiOutlineDollarCircle />,
        title: 'Total sales',
        detail: '122.000 $'
    }, ,
    {
        icon: <MdOutlineChairAlt />,
        title: 'Free Table',
        detail: '27'
    }
]

const topOrderData = [
    {
        id: 1,
        name: "Jhon",
        phone: '0123456789',
        total: '256$'
    },
    {
        id: 2,
        name: "Viet Ha",
        phone: '0123456789',
        total: '25$'
    },
    {
        id: 3,
        name: "Van Song",
        phone: '0123456789',
        total: '44$'
    },
    {
        id: 1,
        name: "Duc Duy",
        phone: '0123456789',
        total: '256$'
    },
]

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="dashboard__title">
                <h2>Admin Dashboard</h2>
            </div>
            <div className="dashboar__inner">
                <div className="dashboard__overview">
                    <div className="dashboard__widget">
                        {
                            widgetItem.map((item, index) => (
                                <div className="dashboard__widget--item" key={index}>
                                    <div className="dashboard__widget--item__icon">
                                        {item.icon}
                                    </div>
                                    <div className="dashboard__widget--item__content">
                                        <div className="dashboard__widget--item__content--title">
                                            {item.title}
                                        </div>
                                        <div className="dashboard__widget--item__content--detail">
                                            {item.detail}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="dashboard__chart">
                        <img src={chartImg} alt="" />
                    </div>
                </div>
                <div className="dashboard__table">
                    <div className="dashboard__table--item">
                        <h3>last order</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Stt</th>
                                    <th>Id</th>
                                    <th>name</th>
                                    <th>phone</th>
                                    <th>total order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    topOrderData.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index}
                                            </td>
                                            <td>
                                                {item.id}
                                            </td>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.phone}
                                            </td>
                                            <td>
                                                {item.total}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="dashboard__table--item">
                        <h3>last order</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Stt</th>
                                    <th>Id</th>
                                    <th>name</th>
                                    <th>phone</th>
                                    <th>total order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    topOrderData.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index}
                                            </td>
                                            <td>
                                                {item.id}
                                            </td>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.phone}
                                            </td>
                                            <td>
                                                {item.total}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
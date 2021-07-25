import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../utils/base';
import moment from 'moment';
import './WidgetLg.css'
import { DEFAULT_AVATAR } from './../../config'

export default function WidgetLg() {
    const [trans, setTrans] = useState([]);

    useEffect(function () {
        async function loadTrans() {
            const res = await axiosInstance.get('/orders?limit=4&sort_by=enroll_at&sort_type=desc')
            setTrans(res.data.courseOrders);
        }

        loadTrans();
    }, [])


    const Button = ({ type }) => {
        return <button className={"widgetLgButton " + type}>{type}</button>;
    };
    return (
        <div className="widgetLg">
            <h3 className="widgetLgTitle">Latest transactions</h3>
            <table className="widgetLgTable">
                <tr className="widgetLgTr">
                    <th className="widgetLgTh">Student</th>
                    <th className="widgetLgTh">Course</th>
                    <th className="widgetLgTh">Date</th>
                    <th className="widgetLgTh">Status</th>
                </tr>
                {trans.map((el) => {
                    return (
                        <tr className="widgetLgTr">
                            <td className="widgetLgUser">
                                <img
                                    src={el.user.avatar || DEFAULT_AVATAR}
                                    alt={el.user.fullname}
                                    className="widgetLgImg"
                                />
                                <span className="widgetLgName">{el.user.fullname}</span>
                            </td>
                            <td className="widgetLgAmount">{el.course.name}</td>
                            <td className="widgetLgDate">{moment(el.course_order.enroll_at).format('MMM DD YYYY ')}</td>
                            <td className="widgetLgStatus">
                                {
                                    el.course_order.status ? <Button type="Pending" /> : <Button type="Approved" />
                                }
                            </td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
}


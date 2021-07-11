import React, { useEffect, useState } from 'react'
import {
    PersonOutline,
    LibraryBooks,
    FlashOn
} from '@material-ui/icons'
import { axiosInstance } from './../../utils/axios'

import './FeatureInfo.css'

export default function FeatureInfo() {
    const [numStudents, setNumStudents] = useState(0);
    const [numCourses, setNumCourses] = useState(0);
    const [numTrans, setNumTrans] = useState(0);

    useEffect(function () {
        async function loadNumberStudents() {
            const res = await axiosInstance.get(`/users?role_id=2&is_delete=false&limit=999`);
            setNumStudents(res.data.length);
        }

        async function loadNumberCourses() {
            const res = await axiosInstance.get(`/courses?limit=999`);
            setNumCourses(res.data.length);
        }

        async function loadNumberTransaction() {
            const res = await axiosInstance.get('/course_order?limit=999');
            setNumTrans(res.data.length);
        }

        loadNumberStudents();
        loadNumberCourses();
        loadNumberTransaction();
    }, []);

    return (
        <div className="featured">
            <div className="featuredItem">
                <span className="featuredTitle">Students</span>
                <div className="featuredCardContainer">
                    <span className="featuredNumber">{numStudents}</span>
                    <PersonOutline fontSize='large' />
                </div>

            </div>
            <div className="featuredItem">
                <span className="featuredTitle">Courses</span>
                <div className="featuredCardContainer">
                    <span className="featuredNumber">{numCourses}</span>
                    <LibraryBooks fontSize='large' />
                </div>

            </div>
            <div className="featuredItem">
                <span className="featuredTitle">Transactions</span>
                <div className="featuredCardContainer">
                    <span className="featuredNumber">{numTrans}</span>
                    <FlashOn fontSize='large' />
                </div>
            </div>
        </div>
    );
}

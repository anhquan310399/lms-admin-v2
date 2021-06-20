import React, { useState, useEffect } from 'react';
import NVD3Chart from 'react-nvd3';
import axios from 'axios';
import { getCookie } from '../../../services/localStorage';

const StudentOfFacultyChart = () => {

    const [statistic, setStatistic] = useState([]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/admin/statistic/faculty/students`,
            {
                headers: {
                    'Authorization': getCookie("token")
                }
            }
        ).then(res => {
            setStatistic(res.data.statistic);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    return (
        <NVD3Chart height={300} type="pieChart" datum={statistic} x="faculty" y="students" donut labelType='percent' />
    )
}

export default StudentOfFacultyChart;
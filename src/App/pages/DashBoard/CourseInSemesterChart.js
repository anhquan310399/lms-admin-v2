import React, { useState, useEffect } from 'react';
import NVD3Chart from 'react-nvd3';
import axios from 'axios';
import { getCookie } from '../../../services/localStorage';

const CourseInSemesterChart = () => {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/admin/statistic/semester/courses`,
            {
                headers: {
                    'Authorization': getCookie("token")
                }
            }
        ).then(res => {
            setChartData([{
                key: 'CourseInSemesterChart',
                values: res.data.statistic
            }])
        }).catch(err => {
            console.log(err);
        })

    }, []);


    return (
        <>
            {chartData &&
                React.createElement(NVD3Chart, {
                    xAxis: {
                        tickFormat: function (d) { return d; },
                        axisLabel: 'Semester'
                    },
                    yAxis: {
                        axisLabel: 'Number of course',
                        tickFormat: function (d) { return d; }
                    },
                    type: 'discreteBarChart',
                    datum: chartData,
                    x: 'semester',
                    y: 'courses',
                    height: 300,
                    groupSpacing: 0.2,
                })
            }
        </>
    )
}

export default CourseInSemesterChart;
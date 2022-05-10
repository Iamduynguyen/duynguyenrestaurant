import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import fakeData from './fakeChartData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
);

const options = {
  responsive: true,
};

const labels = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

function BarChart({dataByWeek}){
  const data = {
  labels,
  datasets: [
    {
      data: dataByWeek.map((data)=>{
        return data.total
      }),
      backgroundColor: "rgba(255, 99, 132, 0.5)"
    }
  ]
};
  return(
    <Bar options={options} data ={data}/>
  )
}

export default BarChart;
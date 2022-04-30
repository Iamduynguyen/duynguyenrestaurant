import React from 'react'
import LineChart from './LineChart';
import BarChart from './BarChart';
import { Typography } from '@mui/material';
import BookTableAPI from '../../../API/BookTableAPI';
import { useEffect } from 'react';
import { useState } from 'react';


function ChartAdmin(){
  const [dataByWeek, setDataByWeek] = useState([]);
  const [dataByYear, setDataByYear] = useState([]);

  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  const fetchData = async () =>{
    try{
      const dataByWeek = await BookTableAPI.getTotalByWeek(currentMonth, currentYear)
      const dataByYear = await BookTableAPI.getTotalByYear(currentYear);
      setDataByWeek(dataByWeek);
      setDataByYear(dataByYear);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    fetchData();
  },[])
  return(
    <div>
      <div>
        
      </div>
      <Typography textAlign={'center'} mt={3} variant='h4'>Doanh thu theo ngày</Typography>
      <BarChart dataByWeek = {dataByWeek}/>
      <div style={{height: '50px'}}></div>
      <Typography textAlign={'center'} mt={3} variant='h4'>Doanh thu theo Tháng</Typography>
      <LineChart dataByYear = {dataByYear}/>
    </div>
  )
}

export default ChartAdmin;
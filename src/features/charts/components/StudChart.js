/* eslint-disable no-unused-vars */
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import TitleCard from '../../../components/Cards/TitleCard';
  import firebase from "firebase/compat/app";
  import 'firebase/firestore';
  import '../../../app/firebase_config'
  import { getFirestore, collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"; 
  import { useState, useEffect } from 'react';
  import { firestoreDB } from '../../../app/firebase_config';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );
  
  function StudChart({ startDate, endDate }) {
    const db = getFirestore();
    const [chartData, setChartData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const q = query(collection(db, "Breeding"), 
                    where('studDate', '>=', startDate), 
                    where('studDate', '<=', endDate));

          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched Data:', data);
  
          // Calculate counts for each date
          const counts = data.reduce((acc, item) => {
            const formattedDate = formatDate(item.studDate);
            acc[formattedDate] = (acc[formattedDate] || 0) + 1;
            return acc;
          }, {});
  
          // Convert counts object to an array of objects
          const countsArray = Object.entries(counts).map(([date, count]) => ({
            studDate: date,
            count,
          }));
  
          console.log('Counts:', countsArray);
          setChartData(countsArray);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [db, startDate, endDate]);
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  
    const formatDate = (dateString) => {
      const date = new Date(dateString + 'T00:00:00');
      return date.toISOString().split('T')[0]; // Extract the date part
    };
  
    console.log('Formatted Labels:', chartData.map(item => (item.studDate ? formatDate(item.studDate) : '')));
    console.log('Chart Data:', chartData);
    console.log('Chart Data Value: ', chartData.map(item => item.count));
  
    const data = {
      labels: chartData.map(item => (item.studDate ? formatDate(item.studDate) : '')),
      datasets: [
        {
          fill: false,
          label: 'Stud period as of (' + startDate + ' : ' + endDate + ')',
          data: chartData.map(item => item.count),
          //data:[10, 20, 15, 25],
          borderColor: 'rgba(95, 150, 251, 1)',
          backgroundColor: 'rgba(95, 150, 251, 1)',
        },
      ],
    };
  
    return (
      <TitleCard title={"Stud Chart"}>
        <Line data={data} options={options} />
      </TitleCard>
    );
  }
  
  export default StudChart;
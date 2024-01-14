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
  
  function BirthChart({ startDate, endDate }) {
    const db = getFirestore();
    const [chartData, setChartData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const q = query(collection(db, "Breeding"), 
                    where('birthDate', '>=', startDate), 
                    where('birthDate', '<=', endDate));

          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched Data:', data);
  
          // Calculate counts for each date
          const counts = data.reduce((acc, item) => {
            const formattedDate = formatDate(item.birthDate);
            acc[formattedDate] = (acc[formattedDate] || 0) + 1;
            return acc;
          }, {});
  
          // Convert counts object to an array of objects
          const countsArray = Object.entries(counts).map(([date, count]) => ({
            birthDate: date,
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
  
    console.log('Formatted Labels:', chartData.map(item => (item.birthDate ? formatDate(item.birthDate) : '')));
    console.log('Chart Data:', chartData);
    console.log('Chart Data Value: ', chartData.map(item => item.count));
  
    const data = {
      labels: chartData.map(item => (item.birthDate ? formatDate(item.birthDate) : '')),
      datasets: [
        {
          fill: false,
          label: 'Birth period as of (' + startDate + ' : ' + endDate + ')',
          data: chartData.map(item => item.count),
          //data:[10, 20, 15, 25],
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 0.8)',
        },
      ],
    };
  
    return (
      <TitleCard title={"Birth Chart"}>
        <Line data={data} options={options} />
      </TitleCard>
    );
  }
  
  export default BirthChart;
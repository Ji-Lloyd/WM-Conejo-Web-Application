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
  

function NutritionQuantityChart({ startDate, endDate }) {
    const db = getFirestore();
    const [chartData, setChartData] = useState([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const q = query(
            collection(db, "FeedingAndNutrition"),
            where('feedDate', '>=', startDate),
            where('feedDate', '<=', endDate)
          );
  
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched Data:', data);
  
          // Calculate feedQuantity for each date, each feedType
          const feedQuantities = data.reduce((acc, item) => {
            const formattedDate = formatDate(item.feedDate);
            const feedType = item.feedType;
            const feedQuantity = parseInt(item.feedQuantity, 10); // Convert string to integer
  
            if (!acc[formattedDate]) {
              acc[formattedDate] = {};
            }
  
            if (!acc[formattedDate][feedType]) {
              acc[formattedDate][feedType] = 0;
            }
  
            acc[formattedDate][feedType] += feedQuantity;
            return acc;
          }, {});
  
          // Convert feedQuantities object to an array of objects
          const feedQuantitiesArray = Object.entries(feedQuantities).map(([date, feedTypes]) => ({
            feedDate: date,
            Mommi: feedTypes['Mommi (Lactating Pellets)'] || 0,
            Premium: feedTypes['Premium (Optimax Growth)'] || 0,
            Fibrellet: feedTypes['Fibrellet (Maintenance)'] || 0,
          }));
  
          console.log('Feed Quantities:', feedQuantitiesArray);
          setChartData(feedQuantitiesArray);
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
  
    console.log('Formatted Labels:', chartData.map((item) => formatDate(item.feedDate)));
    console.log('Chart Data:', chartData);
    console.log('Mommi Data:', chartData.map((item) => item.Mommi));
    console.log('Premium Data:', chartData.map((item) => item.Premium));
    console.log('Fibrellet Data:', chartData.map((item) => item.Fibrellet));
  
    const data = {
      labels: chartData.map((item) => formatDate(item.feedDate)),
      datasets: [
        {
          fill: false,
          label: 'Mommi feed quantity',
          data: chartData.map((item) => item.Mommi),
          borderColor: 'rgba(0, 91, 179, 0.77)',
          backgroundColor: 'rgba(0, 91, 179, 0.77)',
        },
        {
          fill: false,
          label: 'Premium feed quantity',
          data: chartData.map((item) => item.Premium),
          borderColor: 'rgba(46, 255, 148, 0.77)',
          backgroundColor: 'rgba(46, 255, 148, 0.77)',
        },
        {
          fill: false,
          label: 'Fibrellet feed quantity',
          data: chartData.map((item) => item.Fibrellet),
          borderColor: 'rgba(200, 108, 191, 0.77)',
          backgroundColor: 'rgba(200, 108, 191, 0.77)',
        },
      ],
    };
  
    return (
      <TitleCard title={"Pellets Intake Chart (grams)"}>
        <Line data={data} options={options} />
      </TitleCard>
    );
  }
  
export default NutritionQuantityChart;
  
  
  
  
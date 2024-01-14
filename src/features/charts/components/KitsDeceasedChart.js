/* eslint-disable no-unused-vars */
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  import TitleCard from '../../../components/Cards/TitleCard';
  import { useState, useEffect } from 'react';
  import firebase from 'firebase/compat/app';
  import 'firebase/firestore';
  import '../../../app/firebase_config';
  import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  function KitsDeceasedChart({ startDate, endDate }) {
    const [chartData, setChartData] = useState([]);
    const db = getFirestore();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const querySnapshot = await getDocs(
            query(
              collection(db, 'Breeding'),
              where('birthDate', '>=', startDate),
              where('birthDate', '<=', endDate)
            )
          );
  
          const data = querySnapshot.docs.map((doc) => {
            const birthDate = doc.get('birthDate');
            const litterSize = doc.get('litterSize');
            const litterSizeSurvived = doc.get('litterSurvived');
            const survivedKits = litterSizeSurvived;
            const deceasedKits = litterSize - litterSizeSurvived;
  
            return {
              birthDate,
              survivedKits,
              deceasedKits,
            };
          });
  
          setChartData(data);
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
  
    const labels = chartData.map((item) => formatDate(item.birthDate));
  
    const datasets = [
      {
        label: 'Survived Kits',
        data: chartData.map((item) => item.survivedKits),
        backgroundColor: 'rgba(58, 198, 68, 0.77)',
        borderColor: 'rgba(58, 198, 68, 0.77)',
        borderWidth: 1,
      },
      {
        label: 'Deceased Kits',
        data: chartData.map((item) => item.deceasedKits),
        backgroundColor: 'rgba(255, 46, 61, 0.77)',
        borderColor: 'rgba(255, 46, 61, 0.77)',
        borderWidth: 1,
      },
    ];
  
    const data = {
      labels,
      datasets,
    };
  
    return (
      <TitleCard title={'Litters Chart'} topMargin="mt-2">
        <Bar options={options} data={data} />
      </TitleCard>
    );
  }
  
  export default KitsDeceasedChart;
  
/* eslint-disable no-unused-vars */
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    indexAxis,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  import TitleCard from '../../../components/Cards/TitleCard';
  import { useState, useEffect } from 'react';
  import firebase from 'firebase/compat/app';
  import 'firebase/firestore';
  import '../../../app/firebase_config';
  import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
  } from 'firebase/firestore';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  function NutritionAnalysisChart({ rabbitName }) {
    const [countMommi, setCountMommi] = useState(0);
    const [countPremium, setCountPremium] = useState(0);
    const [countFibrellet, setCountFibrellet] = useState(0);
  
    const db = getFirestore();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const q = query(
            collection(db, 'FeedingAndNutrition'),
            where('name', '==', rabbitName)
          );
  
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('Fetched Data:', data);
  
          // Initialize counts for each feedType
          let mommiCount = 0;
          let premiumCount = 0;
          let fibrelletCount = 0;
  
          // Calculate counts for each feedType
          data.forEach((item) => {
            switch (item.feedType) {
              case 'Mommi (Lactating Pellets)':
                mommiCount++;
                break;
              case 'Premium (Optimax Growth)':
                premiumCount++;
                break;
              case 'Fibrellet (Maintenance)':
                fibrelletCount++;
                break;
              // Add more cases for other feedTypes if needed
              default:
                break;
            }
          });
  
          // Update state with the counts
          setCountMommi(mommiCount);
          setCountPremium(premiumCount);
          setCountFibrellet(fibrelletCount);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [db, rabbitName]);
  
    const options = {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  
    const labels = ['Mommi', 'Premium', 'Fibrellet'];
  
    const data = {
      labels,
      datasets: [
        {
          axis: 'y',
          label:
            'Quanity of intake pellets Rabbit: ' + rabbitName,
          data: [countMommi, countPremium, countFibrellet],
          fill: false,
          backgroundColor: [
            'rgba(0, 91, 179, 0.77)',
            'rgba(46, 255, 148, 0.77)',
            'rgba(200, 108, 191, 0.77)',
          ],
          borderColor: [
            'rgba(0, 91, 179, 0.77)',
            'rgba(46, 255, 148, 0.77)',
            'rgba(200, 108, 191, 0.77)',
          ],
        },
      ],
    };
  
    return (
      <TitleCard title={'Nutrition Chart'} topMargin="mt-2">
        <Bar options={options} data={data} />
      </TitleCard>
    );
  }
  
  export default NutritionAnalysisChart;
  
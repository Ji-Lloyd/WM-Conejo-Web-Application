/* eslint-disable no-unused-vars */
import {
    Chart as ChartJS,
    Filler,
    ArcElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import Subtitle from '../../../components/Typography/Subtitle';
import { useState, useEffect } from 'react'
import firebase from "firebase/compat/app";
import 'firebase/firestore';
import '../../../app/firebase_config'
import { getFirestore, collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"; 

  ChartJS.register(ArcElement, Tooltip, Legend,
      Tooltip,
      Filler,
      Legend);
  
  function PieChart({ startDate, endDate }){

    const db = getFirestore();

    const [countHealthy, setCountHealthy] = useState(0);
    const [countIll, setCountIll] = useState(0);
    const [countDeceased, setCountDeceased] = useState(0);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const q = query(
            collection(db, "Rabbit"),
            where('entryDate', '>=', startDate),
            where('entryDate', '<=', endDate)
          );
  
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched Data:', data);
  
          // Initialize counts for each feedType
          let healthyCount = 0;
          let illCount = 0;
          let deceasedCount = 0;
  
          // Calculate counts for each feedType
          data.forEach((item) => {
            switch (item.status) {
              case 'Healthy':
                healthyCount++;
                break;
              case 'Ill':
                illCount++;
                break;
              case 'Deceased':
                deceasedCount++;
                break;
              // Add more cases for other feedTypes if needed
              default:
                break;
            }
          });
  
          // Update state with the counts
          setCountHealthy(healthyCount);
          setCountIll(illCount);
          setCountDeceased(deceasedCount);
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
        
        const labels = ['Healthy', 'Ill', 'Deceased'];
        
        const data = {
          labels,
          datasets: [
              {
                  label: '# of rabbits',
                  data: [countHealthy, countIll, countDeceased],
                  backgroundColor: [
                    'rgba(48, 255, 63, 0.77)',
                    'rgba(99, 99, 19, 0.77)',
                    'rgba(255, 46, 61, 0.77)',
                  ],
                  borderColor: [
                    'rgba(48, 255, 63, 0.77)',
                    'rgba(99, 99, 19, 0.77)',
                    'rgba(255, 46, 61, 0.77)',
                  ],
                  borderWidth: 1,
                }
          ],
        };
  
      return(
          <TitleCard title={"Status Chart"}>
                  <Doughnut options={options} data={data} />
          </TitleCard>
      )
  }
  
  
  export default PieChart
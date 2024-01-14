/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-vars */
import {
    Chart as ChartJS,
    Filler,
    ArcElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Doughnut } from 'react-chartjs-2';
  import { Pie } from 'react-chartjs-2';
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
  
  function DiseasesChart({ startDate, endDate }){
  
    const db = getFirestore();
  
    const [countMange, setCountMange] = useState(0);
    const [countBloating, setCountBloating] = useState(0);
    const [countDiarrhea, setCountDiarrhea] = useState(0);
    const [countMastitis, setCountMastitis] = useState(0);
    const [countSoreHack, setCountSoreHack] = useState(0);
    const [countCold, setCountCold] = useState(0);
    const [countHalak, setCountHalak] = useState(0);
  
    useEffect(() => {
        const fetchData = async () => {
          try {
            const q = query(
              collection(db, "HealthAdministration"),
              where('date', '>=', startDate),
              where('date', '<=', endDate)
            );
    
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            console.log('Fetched Data:', data);
    
            // Initialize counts for each feedType
            let mangeCount = 0;
            let bloatingCount = 0;
            let diarrheaCount = 0;
            let mastitisCount = 0;
            let sorehackCount = 0;
            let coldCount = 0;
            let halakCount = 0;
    
            // Calculate counts for each feedType
            data.forEach((item) => {
              switch (item.disease) {
                case 'Mange':
                    mangeCount++;
                    break;
                case 'Bloating':
                    bloatingCount++;
                    break;
                case 'Diarrhea':
                    diarrheaCount++;
                    break;
                case 'Mastitis':
                    mastitisCount++;
                    break;
                case 'Sore Hack':
                    sorehackCount++;
                    break;
                case 'Cold':
                    coldCount++;
                    break;
                case 'Halak':
                    halakCount++;
                    break;
                // Add more cases for other feedTypes if needed
                default:
                  break;
              }
            });
    
            // Update state with the counts
            setCountMange(mangeCount);
            setCountBloating(bloatingCount);
            setCountDiarrhea(diarrheaCount);
            setCountMastitis(mastitisCount);
            setCountSoreHack(sorehackCount);
            setCountCold(coldCount);
            setCountHalak(halakCount);
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
        
        const labels = ['Mange','Bloating','Diarrhea','Mastitis','Sore Hack','Cold','Halak'];
        
        const data = {
          labels,
          datasets: [
              {
                  label: '# of rabbits that caught illness',
                  data: [countMange,countBloating,countDiarrhea,countMastitis,countSoreHack,countCold,countHalak],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(200, 159, 120, 0.8)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(200, 159, 120, 0.8)',
                  ],
                  borderWidth: 1,
                }
          ],
        };
  
      return(
          <TitleCard title={"Diseases / Illness Chart"}>
                  <Pie options={options} data={data} />
          </TitleCard>
      )
  }
  
  
  export default DiseasesChart
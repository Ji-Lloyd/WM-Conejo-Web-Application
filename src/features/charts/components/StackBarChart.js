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
import { useState, useEffect } from 'react'
import firebase from "firebase/compat/app";
import 'firebase/firestore';
import '../../../app/firebase_config'
import { getFirestore, collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"; 

  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  function StackBarChart(){

    const [countTotalSurvivedKits, setCountTotalSurvivedKits] = useState(0);
    const [countTotalDeceasedKits, setCountTotalDeceasedKits] = useState(0);

    const db = getFirestore();


    useEffect(() => {
      const fetchDocumentCountKits = async () => {
        try {
            let bornKits = 0;
            let survivedKits = 0;
            let deceasedKits = 0;
            const querySnapshot = (await getDocs(query(collection(db, "Breeding"))));
            
            querySnapshot.forEach((doc) => {
                let litterSize = doc.get("litterSize");
                let litterSizeSurvived = doc.get("litterSurvived");

                bornKits = bornKits + litterSize;
                survivedKits = survivedKits + litterSizeSurvived;
            });

            deceasedKits = bornKits - survivedKits;

            setCountTotalSurvivedKits(survivedKits);
            setCountTotalDeceasedKits(deceasedKits);
        } catch (error) {
            console.error('Error fetching document count:', error);
        }
      };

      fetchDocumentCountKits();
    }, [db]);
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      },
    };
        
        const labels = ['Survived', 'Deceased'];
        
        const data = {
          labels,
          datasets: [
            {
              label: 'Kits',
              data: [countTotalSurvivedKits,countTotalDeceasedKits],
              backgroundColor: [
                'rgba(58, 198, 68, 0.77)',
                'rgba(255, 46, 61, 0.77)',
              ],
              borderColor: [
                'rgba(58, 198, 68, 0.77)',
                'rgba(255, 46, 61, 0.77)',
              ],
              borderWidth: 1,

            },
          ],
        };
  
      return(
        <TitleCard title={"Litters Chart"} topMargin="mt-2">
              <Bar options={options} data={data} />
        </TitleCard>
  
      )
  }
  
  
  export default StackBarChart
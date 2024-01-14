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
import { useState, useEffect } from 'react'
import firebase from "firebase/compat/app";
import 'firebase/firestore';
import '../../../app/firebase_config'
import { getFirestore, collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"; 


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart({ startDate, endDate }){

  const [countTotalBuck, setCountTotalBuck] = useState(0);
  const [countTotalDoe, setCountTotalDoe] = useState(0);


  const db = getFirestore();

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
        let buckCount = 0;
        let doeCount = 0;

        // Calculate counts for each feedType
        data.forEach((item) => {
          switch (item.gender) {
            case 'Buck':
              buckCount++;
              break;
            case 'Doe':
              doeCount++;
              break;
            // Add more cases for other feedTypes if needed
            default:
              break;
          }
        });

        // Update state with the counts
        setCountTotalBuck(buckCount);
        setCountTotalDoe(doeCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [db, startDate, endDate]);

    const options = {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: {
            position: 'top',
          }
        },
      };
      
      const labels = ["Buck","Doe"];
      
      const data = {
        labels,
        datasets: [
          {
            axis: 'y',
            label: 'Buck and Doe as of (' + startDate + ' : ' + endDate + ')',
            data: [countTotalBuck, countTotalDoe],
            fill: false,
            backgroundColor: [
              'rgba(95, 150, 251, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderColor: [
              'rgba(95, 150, 251)',
              'rgba(255, 99, 132)'
            ],
          },
        ],
      };

    return(
      <TitleCard title={"Buck and Doe Chart"} topMargin="mt-2">
            <Bar options={options} data={data} />
      </TitleCard>

    )
}


export default BarChart
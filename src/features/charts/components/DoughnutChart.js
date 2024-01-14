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
import { PolarArea } from 'react-chartjs-2';
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

function DoughnutChart(){

  const db = getFirestore();

  const [countNewZealand, setCountNewZealand] = useState(0);
  const [countCalifornian, setCountCalifornian] = useState(0);
  const [countFlemishGiant, setCountFlemishGiant] = useState(0);
  const [countPSLine, setCountPSLine] = useState(0);
  const [countHylaOptima, setCountHylaOptima] = useState(0);
  const [countHylaPlus, setCountHylaPlus] = useState(0);
  const [countGermanGiant, setCountGermanGiant] = useState(0);
  const [countHollandLop, setCountHollandLop] = useState(0);

  useEffect(() => {

    const fetchDocumentCountNewZealand = async () => {
      try {
          const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("breed", "==", "New Zealand")))).size;
          setCountNewZealand(querySnapshot);
      } catch (error) {
          console.error('Error fetching document count:', error);
      }
    };

    const fetchDocumentCountCalifornian = async () => {
      try {
          const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("breed", "==", "Californian")))).size;
          setCountCalifornian(querySnapshot);
      } catch (error) {
          console.error('Error fetching document count:', error);
      }
    };

    const fetchDocumentCountFlemishGiant = async () => {
      try {
          const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("breed", "==", "Flemish Giant")))).size;
          setCountFlemishGiant(querySnapshot);
      } catch (error) {
          console.error('Error fetching document count:', error);
      }
    };

    const fetchDocumentCountPSLine = async () => {
      try {
          const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("breed", "==", "PS Line")))).size;
          setCountPSLine(querySnapshot);
      } catch (error) {
          console.error('Error fetching document count:', error);
      }
    };

    const fetchDocumentCountHylaOptima = async () => {
      try {
          const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("breed", "==", "Hyla Optima")))).size;
          setCountHylaOptima(querySnapshot);
      } catch (error) {
          console.error('Error fetching document count:', error);
      }
    };

    const fetchDocumentCountHylaPlus = async () => {
      try {
          const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("breed", "==", "Hyla Plus")))).size;
          setCountHylaPlus(querySnapshot);
      } catch (error) {
          console.error('Error fetching document count:', error);
      }
    };

    const fetchDocumentCountGermanGiant = async () => {
      try {
          const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("breed", "==", "German Giant")))).size;
          setCountGermanGiant(querySnapshot);
      } catch (error) {
          console.error('Error fetching document count:', error);
      }
    };

    const fetchDocumentCountHollandLop = async () => {
      try {
          const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("breed", "==", "Holland Lop")))).size;
          setCountHollandLop(querySnapshot);
      } catch (error) {
          console.error('Error fetching document count:', error);
      }
    };

    
    fetchDocumentCountNewZealand();
    fetchDocumentCountCalifornian();
    fetchDocumentCountFlemishGiant();
    fetchDocumentCountPSLine();
    fetchDocumentCountHylaOptima();
    fetchDocumentCountHylaPlus();
    fetchDocumentCountGermanGiant();
    fetchDocumentCountHollandLop();
    

  }, [db]);

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      };
      
      const labels = ['New Zealand', 'Californian', 'Flemish Giant', 'PS Line', 'Hyla Optima', 'Hyla Plus', 'German Giant', 'Holland Lop'];
      
      const data = {
        labels,
        datasets: [
            {
                label: '# of rabbits',
                data: [countNewZealand, countCalifornian, countFlemishGiant, countPSLine, countHylaOptima, countHylaPlus,countGermanGiant,countHollandLop],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(255, 159, 64, 0.8)',
                  'rgba(200, 159, 120, 0.8)',
                  'rgba(175, 159, 50, 0.8)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(200, 159, 120, 0.8)',
                  'rgba(175, 159, 50, 0.8)',
                ],
                borderWidth: 1,
              }
        ],
      };

    return(
        <TitleCard title={"Breeds Chart"}>
                <Pie options={options} data={data} />
        </TitleCard>
    )
}


export default DoughnutChart
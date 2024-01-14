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
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import AnalyticStats from './AnalyticStats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function LittersAnalysis({ rabbitName }) {
  const [chartData, setChartData] = useState([]);
  const [successRate, setSuccessRate] = useState(0);
  const [mortalityRate, setMortalityRate] = useState(0);

  const [comparisonResultTitle, setComparisonResultTitle] = useState('');
  const [comparisonResult, setComparisonResult] = useState('');
  
  const [averageSurvivedKits, setAverageSurvivedKits] = useState(0);
  const [averageDeceasedKits, setAverageDeceasedKits] = useState(0);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      try {

        const sireQuerySnapshot = await getDocs(
          query(collection(db, 'Breeding'), where('sireName', '==', rabbitName))
        );
        
        const damQuerySnapshot = await getDocs(
          query(collection(db, 'Breeding'), where('damName', '==', rabbitName))
        );
        
        // Define the mapData function
        const mapData = (doc) => {
          const documentName = doc.get('documentName');
          const litterSize = doc.get('litterSize');
          const litterSizeSurvived = doc.get('litterSurvived');
          const survivedKits = litterSizeSurvived;
          const deceasedKits = litterSize - litterSizeSurvived;
          const birthDate = doc.get('birthDate');
        
          return {
            documentName,
            litterSize,
            survivedKits,
            deceasedKits,
            birthDate,
          };
        };
        
        let data = [];
        
        if (!sireQuerySnapshot.empty) {
          data = sireQuerySnapshot.docs.map((doc) => mapData(doc));
        } else if (!damQuerySnapshot.empty) {
          data = damQuerySnapshot.docs.map((doc) => mapData(doc));
        } else {
          console.log('No matching records for rabbitName:', rabbitName);
        }

        data.forEach((item) => {
          item.birthDate = new Date(item.birthDate);
        });

        // Sort the data array based on birthDate in ascending order
        data.sort((a, b) => a.birthDate - b.birthDate);

        // Find the last entry based on birthDate
        const lastEntry = data.reduce(
          (latest, current) => {
            if (!latest.birthDate || (current.birthDate && current.birthDate > latest.birthDate)) {
              return {
                birthDate: current.birthDate,
                survivedKits: current.survivedKits,
                litterSize: current.litterSize,
              };
            }
            return latest;
          },
          {}
        );

        setChartData(data);

        const newTotalKits = data.length > 0 ? data.reduce((sum, item) => sum + item.litterSize, 0) : 0;
        const newTotalSurvivedKits = data.length > 0 ? data.reduce((sum, item) => sum + item.survivedKits, 0) : 0;
        const newTotalDeceasedKits = data.length > 0 ? data.reduce((sum, item) => sum + item.deceasedKits, 0) : 0;

        console.log('Total Kits:', newTotalKits);
        console.log('Total Survived Kits:', newTotalSurvivedKits);

        const newSuccessRate = newTotalKits > 0 ? (newTotalSurvivedKits / newTotalKits) * 100 : 0;
        const mortalityRate = newTotalKits > 0 ? (newTotalDeceasedKits / newTotalKits) * 100 : 0;

        console.log('Success Rate:', newSuccessRate);

        setAverageSurvivedKits(newTotalSurvivedKits);
        setAverageDeceasedKits(newTotalKits - newTotalSurvivedKits || 0);
        setSuccessRate(newSuccessRate);
        setMortalityRate(mortalityRate);

        // Ensure birthDate is not undefined before comparison
        if (lastEntry.birthDate !== undefined) {
          console.log('Last Entry: ', lastEntry);
        
          const litterSizeSurvived  = lastEntry.survivedKits  !== undefined ? lastEntry.survivedKits : 0;
          const litterSize          = lastEntry.litterSize          !== undefined ? lastEntry.litterSize : 1;
        
          console.log('litterSizeSurvived: ', litterSizeSurvived);
          console.log('litterSize: ', litterSize);
          console.log('birthDate: ', lastEntry.birthDate);
        
          const lastEntrySuccessRate = (litterSizeSurvived / litterSize) * 100;
        
          console.log('Last Entry Success Rate: ', lastEntrySuccessRate.toFixed(2));
          console.log('New Success Rate:', newSuccessRate);
        
          if (newSuccessRate < lastEntrySuccessRate) {
            setComparisonResultTitle('Great')
            setComparisonResult('↗︎ Latest outcome is better with a rate of ' + lastEntrySuccessRate + '%');
          } else if (newSuccessRate > lastEntrySuccessRate) {
            setComparisonResultTitle('Failure')
            setComparisonResult('↙ Recent outcome is worse');
          } else {
            setComparisonResultTitle('---')
            setComparisonResult('Recent outcome is the same');
          }
        } else {
          // Handle the case when birthDate is undefined
          console.log('No birth date found in the last entry');
        }
        

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [db, rabbitName]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const labels = chartData.map((item) => item.documentName || '');

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

  const statsData = [
    { title: 'Survived Kits', value: averageSurvivedKits.toFixed(0), description: '↗︎ Number of survived kits' },
    { title: 'Deceased Kits', value: averageDeceasedKits.toFixed(0), description: '↙ Number of deceased kits' },
    { title: 'Survival Rate', value: successRate.toFixed(2) + '%', description: '↗︎ Survival rate based on the total kits  and survived kits' },
    { title: 'Comparison Result', value: comparisonResultTitle, description: comparisonResult },
    { title: 'Mortality Rate', value: mortalityRate.toFixed(2) + '%', description: '↙ Mortality rate based on the deceased kits  and total kits' },
    
  ];

  return (
    <TitleCard title={`Breeding Performance`} topMargin="mt-2" children={'s'}>
      <Bar options={options} data={data} />

      {statsData.map((d, k) => (
        <AnalyticStats key={k} {...d} colorIndex={k} />
      ))}
    </TitleCard>
  );
}

export default LittersAnalysis;
  
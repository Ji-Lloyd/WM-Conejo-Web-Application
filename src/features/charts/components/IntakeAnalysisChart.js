/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import '../../../app/firebase_config';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

function IntakeAnalysisChart({ rabbitName, timeFrame }) {
  const db = getFirestore();
  const [chartData, setChartData] = useState([]);
  
  const [prediction, setPrediction] = useState({
    predictedIntake: 0,
    averageGoalWeight: 0,
    averageCurrentWeight: 0,
    totalDailyCalories: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'FeedingAndNutrition'), where('name', '==', rabbitName));

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched Data:', data);

        const feedQuantities = data.reduce((acc, item) => {
          const formattedDate = formatDate(item.feedDate);
          const feedQuantity = parseInt(item.feedQuantity, 10);
          const currentWeight = parseInt(item.currentWeight, 10);
          const goalWeight = parseInt(item.goalWeight, 10);

          if (!acc[formattedDate]) {
            acc[formattedDate] = {
              currentWeightSum: 0,
              goalWeightSum: 0,
              count: 0,
            };
          }

          acc[formattedDate].currentWeightSum += currentWeight;
          acc[formattedDate].goalWeightSum += goalWeight;
          acc[formattedDate].count += 1;

          if (!acc[formattedDate][item.feedType]) {
            acc[formattedDate][item.feedType] = 0;
          }

          acc[formattedDate][item.feedType] += feedQuantity;
          return acc;
        }, {});

        const feedQuantitiesArray = Object.entries(feedQuantities).map(([date, feedTypes]) => {
          const Mommi = feedTypes['Mommi (Lactating Pellets)'] || 0;
          const Premium = feedTypes['Premium (Optimax Growth)'] || 0;
          const Fibrellet = feedTypes['Fibrellet (Maintenance)'] || 0;
        
          return {
            feedDate: date,
            Mommi,
            Premium,
            Fibrellet,
            feedIntake: Mommi + Premium + Fibrellet,
          };
        });
        

        console.log('Feed Intake:', feedQuantitiesArray.map(item => item.feedIntake));
        console.log('Feed Quantities:', feedQuantitiesArray);
        setChartData(feedQuantitiesArray);
        
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

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toISOString().split('T')[0];
  };

  const data = {
    labels: chartData.map((item) => formatDate(item.feedDate)),
    datasets: [
      {
        fill: false,
        label: 'Feed Intake',
        data: chartData.map((item) => item.feedIntake),
        borderColor: 'rgba(113, 100, 150, 0.77)',
        backgroundColor: 'rgba(113, 100, 150, 0.77)',
      },
    ],
  };

  return (
    <TitleCard title={'Pellets Intake Chart (grams)'}>
      {chartData.length > 0 ? (
      <>
        <Line data={data} options={options} />
      </>
    ) : (
      <p>Loading data...</p>
    )}
    </TitleCard>
  );
}

export default IntakeAnalysisChart;




  {/*
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import '../../../app/firebase_config';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

function IntakeAnalysisChart({ rabbitName, timeFrame }) {
  const db = getFirestore();
  const [chartData, setChartData] = useState([]);
  
  const [prediction, setPrediction] = useState({
    predictedIntake: 0,
    averageGoalWeight: 0,
    averageCurrentWeight: 0,
    totalDailyCalories: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'FeedingAndNutrition'), where('name', '==', rabbitName));

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched Data:', data);

        const feedQuantities = data.reduce((acc, item) => {
          const formattedDate = formatDate(item.feedDate);
          const feedQuantity = parseInt(item.feedQuantity, 10);
          const currentWeight = parseInt(item.currentWeight, 10);
          const goalWeight = parseInt(item.goalWeight, 10);

          if (!acc[formattedDate]) {
            acc[formattedDate] = {
              currentWeightSum: 0,
              goalWeightSum: 0,
              count: 0,
            };
          }

          acc[formattedDate].currentWeightSum += currentWeight;
          acc[formattedDate].goalWeightSum += goalWeight;
          acc[formattedDate].count += 1;

          if (!acc[formattedDate][item.feedType]) {
            acc[formattedDate][item.feedType] = 0;
          }

          acc[formattedDate][item.feedType] += feedQuantity;
          return acc;
        }, {});

        const feedQuantitiesArray = Object.entries(feedQuantities).map(([date, feedTypes]) => ({
          feedDate: date,
          currentWeight: feedTypes.currentWeightSum / feedTypes.count,
          goalWeight: feedTypes.goalWeightSum / feedTypes.count,
          Mommi: feedTypes['Mommi (Lactating Pellets)'] || 0,
          Premium: feedTypes['Premium (Optimax Growth)'] || 0,
          Fibrellet: feedTypes['Fibrellet (Maintenance)'] || 0,
        }));

        console.log('Feed Quantities:', feedQuantitiesArray);
        setChartData(feedQuantitiesArray);

        const { predictedIntake, averageGoalWeight, averageCurrentWeight, totalDailyCalories } = calculatePrediction();
        setPrediction({ predictedIntake, averageGoalWeight, averageCurrentWeight, totalDailyCalories });
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    //calculatePrediction();
    fetchData();
  }, [db, rabbitName]);

  const calculatePrediction = () => {
    if (chartData.length === 0) {
      return {
        predictedIntake: 0,
        averageGoalWeight: 0,
        averageCurrentWeight: 0,
        totalDailyCalories: 0,
      };
    }
  
    // Calculate the average of currentWeight and goalWeight
    const averageCurrentWeight = chartData.reduce((sum, entry) => sum + entry.currentWeight, 0) / chartData.length;
    const averageGoalWeight = chartData.reduce((sum, entry) => sum + entry.goalWeight, 0) / chartData.length;
  
    // Calculate BMR
    const bmr = 60 * averageCurrentWeight;
  
    // Adjust for Activity Level
    const activityLevelFactor = 1.5; // Example: Moderately active
    const adjustedBMR = bmr * activityLevelFactor;
  
    // Determine Weight Change Calories
    const timeframeInDays = timeFrame; // Example: 30 days
    const weightChangeCalories = (averageGoalWeight - averageCurrentWeight) * 7700 / timeframeInDays;
  
    // Calculate Total Daily Calories
    const totalDailyCalories = adjustedBMR + weightChangeCalories;
  
    // Calculate the predicted feed intake needed to reach the goal weight
    const predictedIntake = averageGoalWeight - averageCurrentWeight;
  
    return {
      predictedIntake,
      averageGoalWeight,
      averageCurrentWeight,
      totalDailyCalories,
    };
  };
  
  

  useEffect(() => {
    const { predictedIntake, averageGoalWeight, averageCurrentWeight, totalDailyCalories } = calculatePrediction();
    setPrediction({ predictedIntake, averageGoalWeight, averageCurrentWeight, totalDailyCalories });
  }, [chartData]);
  

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
    return date.toISOString().split('T')[0];
  };

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
    <TitleCard title={'Pellets Intake Chart (grams)'}>
      {chartData.length > 0 ? (
      <>
        <Line data={data} options={options} />

        <div>
          <p>Average Current Weight: {prediction.averageCurrentWeight.toFixed(2)} kgs</p>
          <p>Average Goal Weight: {prediction.averageGoalWeight.toFixed(2)} kgs</p>
          <p>Daily Calories: {prediction.totalDailyCalories.toFixed(2)} kcal</p>
          <p>Predicted Feed Intake Needed to Reach Goal Weight: {prediction.predictedIntake.toFixed(2)} grams</p>
        </div>
      </>
    ) : (
      <p>Loading data...</p>
    )}
    </TitleCard>
  );
}

export default IntakeAnalysisChart;
* */}

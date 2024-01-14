/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import '../../../app/firebase_config';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import AnalyticStats from './AnalyticStats';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

function WeightAnalysisChart({ rabbitName, timeFrame }) {
  const db = getFirestore();
  const [chartData, setChartData] = useState([]);
  const [forecastedDate, setForecastedDate] = useState(null);

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

        const feedQuantitiesArray = data.map((item) => ({
          feedDate: formatDate(item.feedDate),
          currentWeight: parseFloat(item.currentWeight),
          goalWeight: parseFloat(item.goalWeight),
        }));

        console.log('Feed Quantities:', feedQuantitiesArray);
        setChartData(feedQuantitiesArray);

        const { predictedIntake, averageGoalWeight, averageCurrentWeight, totalDailyCalories } = calculatePrediction(timeFrame);
        setPrediction({ predictedIntake, averageGoalWeight, averageCurrentWeight, totalDailyCalories });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

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
  
    const validChartData = chartData.filter(item => !isNaN(item.currentWeight) && !isNaN(item.goalWeight));
  
    if (validChartData.length === 0) {
      return {
        predictedIntake: 0,
        averageGoalWeight: 0,
        averageCurrentWeight: 0,
        totalDailyCalories: 0,
      };
    }
  
    const averageCurrentWeight = validChartData.reduce((sum, item) => sum + (item.currentWeight), 0) / validChartData.length;
    const averageGoalWeight = validChartData.reduce((sum, item) => sum + (item.goalWeight), 0) / validChartData.length;
  
    const bmr = 60 * averageCurrentWeight;
    const activityLevelFactor = 1.5;
    const adjustedBMR = bmr * activityLevelFactor;
    const weightChangeCalories = (averageGoalWeight - averageCurrentWeight) * 7700;
    const totalDailyCalories = adjustedBMR + weightChangeCalories;
  
    const forecastedIntakeForGoalWeight = 70 * averageGoalWeight;
    const currentWeightInKg = averageCurrentWeight / 1000;
    const goalWeightInKg = averageGoalWeight / 1000;
    const additionalIntakeForGoalWeight = 75 * (goalWeightInKg - currentWeightInKg);
  
    const predictedIntake = forecastedIntakeForGoalWeight + additionalIntakeForGoalWeight;
  
    // Calculate the number of days required to reach the goal weight
    const daysToReachGoal = Math.ceil((averageGoalWeight - averageCurrentWeight) / (predictedIntake / 1000));
  
    // Calculate the forecasted date
    const today = new Date();
    const forecastedDate = new Date(today.setDate(today.getDate() + daysToReachGoal));
  
    setForecastedDate(forecastedDate.toISOString().split('T')[0]);
  
    return {
      predictedIntake,
      averageGoalWeight,
      averageCurrentWeight,
      totalDailyCalories,
    };
  };
  
  
  
  
  useEffect(() => {
    const { predictedIntake, averageGoalWeight, averageCurrentWeight, totalDailyCalories } = calculatePrediction(timeFrame);
    setPrediction({ predictedIntake, averageGoalWeight, averageCurrentWeight, totalDailyCalories });
  }, [chartData, timeFrame]);

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
        label: 'Current Weight',
        data: chartData.map((item) => item.currentWeight),
        borderColor: 'rgba(0, 91, 179, 0.77)',
        backgroundColor: 'rgba(0, 91, 179, 0.77)',
      },
      {
        fill: false,
        label: 'Goal Weight',
        data: chartData.map((item) => item.goalWeight),
        borderColor: 'rgba(46, 255, 148, 0.77)',
        backgroundColor: 'rgba(46, 255, 148, 0.77)',
      },
    ],
  };

  const statsData = [
    { title: "Average Current Weight", value: prediction.averageCurrentWeight.toFixed(2) + " kg", description: "" },
    { title: "Average Goal Weight", value: prediction.averageGoalWeight.toFixed(2) + " kg", description: "" },
    { title: "Suggested Intake", value: prediction.predictedIntake.toFixed(0) + " grams", description: "↗︎ Daily feeds needed to reach the goal weight" },
    { title: "Forecasted Date", value: forecastedDate, description: "↗︎ Forecasted Date to Reach Goal Weight" },
  ];


  return (
    <TitleCard title={'Weight Analysis (kgs)'}>
      {chartData.length > 0 ? (
        <>
        <Line data={data} options={options} />
        { statsData.map((d, k) => {
            return (
                <AnalyticStats key={k} {...d} colorIndex={k}/>
            )
        })}
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </TitleCard>
  );
}

export default WeightAnalysisChart;

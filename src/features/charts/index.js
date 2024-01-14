/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-vars */
import AnalyticStats from './components/AnalyticStats'
import LineChart from './components/LineChart'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import DiseasesChart from './components/DiseasesChart'
import Datepicker from "react-tailwindcss-datepicker"; 
import NutritionChart from './components/NutritionChart'
import { showNotification } from '../common/headerSlice'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import TopDamBreeders from '../dashboard/components/TopDamBreeders'
import UserChannels from '../dashboard/components/UserChannels'
import NutritionQuantityChart from './components/NutritionQuantityChart'
import KitsDeceasedChart from './components/KitsDeceasedChart';
import StudChart from './components/StudChart';
import BirthChart from './components/BirthChart';
import NutritionAnalysisChart from './components/NutritionAnalysisChart';
import IntakeAnalysisChart from './components/IntakeAnalysisChart';
import WeightAnalysisChart from './components/WeightAnalysisChart';
import LittersAnalysis from './components/LittersAnalysis';
import BreedingPairAnalysis from './components/BreedingPairAnalysis'




function Charts(){

    const [inputRabbitName, setInputRabbitName] = useState('');
    const [inputTimeFrame, setInputTimeFrame] = useState('');

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    {/*
    const [dateValue, setDateValue] = useState({ 
        startDate: new Date(), 
        endDate: new Date() 
    }); 

    const updateDataAnalytics = (newRange) => {
        // Data Analytics range changed, write code to refresh your values
        dispatch(showNotification({message : `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status : 1}))
        setDateValue(newRange);
    }
     */}

     

    const rabbitAnalysis = () => {
        dispatch(showNotification({message : `Analysis of Rabbit: ${inputRabbitName}`, status : 1}))
        setButtonClicked(true);
        //setButtonClicked(false);
    }
    

    return(
        <>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" value={inputRabbitName} onChange={(e) => setInputRabbitName(e.target.value)} placeholder="Rabbit Name" className="input  input-bordered w-30 "/>
            <input type="hidden" value={inputTimeFrame} onChange={(e) => setInputTimeFrame(e.target.value)} placeholder="Time frame in days" className="input  input-bordered w-30"/>
            <button
                className="btn btn-primary float-right w-40"
                onClick={rabbitAnalysis} 
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Get'}
            </button>

        </div>
        
        
        <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">

            {buttonClicked && (
                <WeightAnalysisChart
                    rabbitName={inputRabbitName}
                    timeFrame={inputTimeFrame}
                />
            )}

            {buttonClicked && (
                <LittersAnalysis
                    rabbitName={inputRabbitName}
                />
            )}


        </div>

        <div className="grid lg:grid-cols-0 mt-4 grid-cols-1 gap-6">
            
            {buttonClicked &&(
                <BreedingPairAnalysis
                    rabbitName={inputRabbitName}/>
            )}

        </div>

        </>
    )
}

export default Charts
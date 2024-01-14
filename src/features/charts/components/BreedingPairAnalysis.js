/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import firebase from 'firebase/compat/app';
import { useDispatch } from 'react-redux'
import { showNotification } from '../../common/headerSlice';
import 'firebase/firestore';
import '../../../app/firebase_config';
import { getFirestore, collection, getDocs, where, query, limit, orderBy, doc } from 'firebase/firestore';
import AnalyticStats from './AnalyticStats';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

function BreedingPairAnalysis({ rabbitName }) {
  
    const db = getFirestore();
    const dispatch = useDispatch()
    
    const [sireName, setSireName] = useState('');
    const [sireSuccessRate, setSireSuccessRate] = useState(0);

    const [damName, setDamName] = useState('');
    const [damSuccessRate, setDamSuccessRate] = useState(0);

    const [pairSuccessRate, setPairSuccessRate] = useState(0);
    const [pairLitterSize, setPairLitterSize] = useState(0);

    const [sireBreeders, setSireBreeders] = useState([]);
    const [damBreeders, setDamBreeders] = useState([]);


    let [rabbitBreedingMessage, setRabbitBreedingMessage] = useState([]);

    const topSireArray = [];
    const topDamArray = [];

    //const [topSireArray, setTopSireArray] = useState([]);
    //const [topDamArray, setTopDamArray] = useState([]);

    const [loading, setLoading] = useState(false);

    const [damIndex, setDamIndex] = useState(-1);
    const [sireIndex, setSireIndex] = useState(0);

    let sireQuerySnapshot = '';
    let sireQuerySnapshotTopBreeders ='';
    let damQuerySnapshot ='';
    let damQuerySnapshotTopBreeders ='';

    let pairSuccess = 0;
    let pairLitter = 0;
    const breederIncrementer = async () => {
        setLoading(true);
    
        sireQuerySnapshot = await getDocs(query(collection(db, 'SireBreeders'), where('sireName', '==', rabbitName)));

        sireQuerySnapshotTopBreeders = await getDocs(query(collection(db, "SireBreeders"), where('sireStatus', '==', 'Healthy'), limit(10), orderBy("sireSuccessRate", 'desc')));
        damQuerySnapshotTopBreeders = await getDocs(query(collection(db, "DamBreeders"), where('damStatus', '==', 'Healthy'), limit(10), orderBy("damSuccessRate", 'desc')));
    
        // Ensure that damBreeders and sireBreeders are initialized as arrays
        const newDamBreeders = [];
        await damQuerySnapshotTopBreeders.forEach((doc) => { newDamBreeders.push(doc.data()); });
        setDamBreeders(newDamBreeders);
    
        const newSireBreeders = [];
        await sireQuerySnapshotTopBreeders.forEach((doc) => { newSireBreeders.push(doc.data()); });
        setSireBreeders(newSireBreeders);
    
        if (damIndex < newDamBreeders.length - 1) {
            const newIndex = damIndex + 1;
            setDamIndex(newIndex);
    
            if (newDamBreeders.length > newIndex) {
                
                setSireName(rabbitName);
                sireQuerySnapshot.forEach((doc) => {
                    setSireSuccessRate(doc.get("sireSuccessRate"));

                });

                setDamName(newDamBreeders[newIndex].damName);
                setDamSuccessRate(newDamBreeders[newIndex].damSuccessRate);
                
                const sireRate = newSireBreeders[0].sireSuccessRate;
                const damRate = newDamBreeders[newIndex].damSuccessRate;
                pairSuccess = (sireRate + damRate) / 2;
                setPairSuccessRate(pairSuccess);

                console.log("Sire Success: " + sireRate);
                console.log("Dam Success: " + damRate);
                console.log("Pair Success: " + pairSuccess);

                pairLitter = (pairSuccess * 0.01) * (10 - 1);
                setPairLitterSize(pairLitter.toFixed(0));
                console.log("Pair Size: " + pairLitter);
            } else {
                console.log("Reached the end of topDamArray");
            }
        } else {
            console.log("Reached the end of topDamArray");
        }
    
        setLoading(false);
    };
    
    

    const fetchData = async () =>
    { 
        try{
            sireQuerySnapshot = await getDocs(query(collection(db, 'SireBreeders'), where('sireName', '==', rabbitName)));
            sireQuerySnapshotTopBreeders = await getDocs(query(collection(db, "SireBreeders"), where('sireStatus', '==', 'Healthy'),limit(10),orderBy("sireSuccessRate",'desc')));

            damQuerySnapshot = await getDocs(query(collection(db, 'DamBreeders'), where('damName', '==', rabbitName)));
            damQuerySnapshotTopBreeders = await getDocs(query(collection(db, "DamBreeders"), where('damStatus', '==', 'Healthy'),limit(10),orderBy("damSuccessRate",'desc')));

            if (!sireQuerySnapshot.empty) 
            {
                setDamName("");
                setDamSuccessRate("");
                setSireName(rabbitName);
                sireQuerySnapshot.forEach((doc) => {setSireSuccessRate(doc.get("sireSuccessRate"));});
                if(damIndex === 0){
                    damQuerySnapshotTopBreeders.forEach((doc) => {
                        setDamBreeders((prevBreeders) => [...prevBreeders, doc.data()]);
                      });
                      
                    //setDamBreeders(topDamArray);
                    console.log(damQuerySnapshotTopBreeders);
                    console.log(damBreeders);
                    setDamName(damBreeders[damIndex].damName);
                    setDamSuccessRate(damBreeders[damIndex].damSuccessRate);
                    console.log(damIndex);
                }
            } 
            else if (!damQuerySnapshot.empty) 
            {
                setSireName("");
                setSireSuccessRate("");
                setDamName(rabbitName);
                damQuerySnapshot.forEach((doc) => {setDamSuccessRate(doc.get("damSuccessRate"));});

                if(sireIndex === 0){
                    sireQuerySnapshotTopBreeders.forEach((doc) => { setSireBreeders(doc.data());});
                    setSireBreeders(topSireArray);
                    setSireName(sireBreeders[sireIndex].sireName);
                    setSireSuccessRate(sireBreeders[sireIndex].sireSuccessRate);
                    console.log(sireIndex);
                }
            
            } 
            else 
            {
                setSireName("");
                setSireSuccessRate("");
                setDamName("");
                setDamSuccessRate("");
            }

            const pairSuccess = (sireSuccessRate + damSuccessRate) / 2;
            setPairSuccessRate(pairSuccess);

            const pairLitters = (pairSuccessRate * 0.01) * (10 - 1 + 1);
            setPairLitterSize(pairLitters.toFixed(0));
        }catch(error){
            console.log('Error Fetching Data' + error)
        }
    }

    useEffect(() =>{
       //fetchData(); 
       console.log("damName updated:", damName);
    },[db]);

    const statsData = [
        { title: "Sire", value: sireName, description: "↗︎ Success Rate: " + sireSuccessRate + "%"},
        { title: "Dam", value: damName, description: "↗︎ Success Rate: " + damSuccessRate + "%"},
        { title: "Expected Pairing Sucess Rate", value: pairSuccessRate +'%', description: "↗︎ Predicted success rate for the recommended paired rabbit" },
        { title: "Expected Litter Size", value: pairLitterSize, description: "↗︎ Predicted litter size for the recommended paired " + pairLitterSize + "/10"  },
    ];


    return (
        <TitleCard title={'Breeding Recommendation Analysis'}>
            { statsData.map((d, k) => {
                return (<AnalyticStats key={k} {...d} colorIndex={k}/>)
            })}
            <button
                className="btn btn-primary float-right w-40"
                onClick={breederIncrementer} 
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Recommend'}
            </button>
            
        </TitleCard>
    );
}

export default BreedingPairAnalysis;
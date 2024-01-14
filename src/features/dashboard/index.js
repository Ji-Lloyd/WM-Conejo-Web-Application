/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-vars */
import DashboardStats from './components/DashboardStats'
import { useDispatch } from 'react-redux'
import DoughnutChart from '../charts/components/DoughnutChart'
import StackBarChart from '../charts/components/StackBarChart'
import { useState, useEffect } from 'react'
import firebase from "firebase/compat/app";
import 'firebase/firestore';
import '../../app/firebase_config';
import { getFirestore, collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"; 





function Dashboard(){

    const dispatch = useDispatch();
    const [count, setCount] = useState(0);
    const [countTotalBuck, setCountTotalBuck] = useState(0);
    const [countTotalDoe, setCountTotalDoe] = useState(0);
    const [countTotalKits, setCountTotalKits] = useState(0);

    const [countTotalPregnant, setCountTotalPregnant] = useState(0);
    const [countTotalHealthy, setCountTotalHealthy] = useState(0);
    const [countTotalIll, setCountTotalIll] = useState(0);
    const [countTotalDeceased, setCountTotalDeceased] = useState(0);

    const db = getFirestore();


    useEffect(() => {
        const fetchDocumentCount = async () => {
            try {
                const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("status", "!=", "Deceased")))).size;
                setCount(querySnapshot);
                console.log(querySnapshot);
            } catch (error) {
                console.error('Error fetching document count:', error);
            }
        };


        const fetchDocumentCountBuck = async () => {
            try {
                const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("gender", "==", "Buck"),where("status", "!=", "Deceased")))).size;
                setCountTotalBuck(querySnapshot);
            } catch (error) {
                console.error('Error fetching document count:', error);
            }
        };

        const fetchDocumentCountDoe = async () => {
            try {
                const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("gender", "==", "Doe"),where("status", "!=", "Deceased")))).size;
                setCountTotalDoe(querySnapshot);
            } catch (error) {
                console.error('Error fetching document count:', error);
            }
        };

        const fetchDocumentCountKits = async () => {
            try {
                let kit = 0;
                const querySnapshot = (await getDocs(query(collection(db, "Breeding"))));
                
                querySnapshot.forEach((doc) => {
                    let litterSize = doc.get("litterSurvived");
                    kit = kit + litterSize;
                });

                setCountTotalKits(kit);
            } catch (error) {
                console.error('Error fetching document count:', error);
            }
        };

        const fetchDocumentCountPregnant = async () => {
            try {
                const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("pregnant", "==", "Yes")))).size;
                setCountTotalPregnant(querySnapshot);
            } catch (error) {
                console.error('Error fetching document count:', error);
            }
        };

        const fetchDocumentCountHealthy = async () => {
            try {
                const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("status", "==", "Healthy")))).size;
                setCountTotalHealthy(querySnapshot);
            } catch (error) {
                console.error('Error fetching document count:', error);
            }
        };

        const fetchDocumentCountIll = async () => {
            try {
                const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("status", "==", "Ill")))).size;
                setCountTotalIll(querySnapshot);
            } catch (error) {
                console.error('Error fetching document count:', error);
            }
        };


        const fetchDocumentCountDeceased = async () => {
            try {
                const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("status", "==", "Deceased") ))).size;
                setCountTotalDeceased(querySnapshot);
            } catch (error) {
                console.error('Error fetching document count:', error);
            }
        };

        
        fetchDocumentCount();
        fetchDocumentCountBuck();
        fetchDocumentCountDoe();
        fetchDocumentCountKits();
        
        fetchDocumentCountPregnant();
        fetchDocumentCountHealthy();
        fetchDocumentCountIll();
        fetchDocumentCountDeceased();
         
    }, [db]);


    const statsData = [
        {title : "Total Rabbit", value : count, description : ""},
        {title : "Total Kits", value : countTotalKits, description : ""},
        {title : "Total Buck", value : countTotalBuck, description : ""},
        {title : "Total Dam", value : countTotalDoe, description : ""},
    ]

    const statsData2 = [
        {title : "Pregnant", value : countTotalPregnant, description : ""},
        {title : "Healthy Rabbits", value : countTotalHealthy, description : ""},
        {title : "Ill Rabbits", value : countTotalIll, description : ""},
        {title : "Deceased Rabbits", value : countTotalDeceased, description : ""},
    ]
 


    return(
        <>
            
        
        {/** ---------------------- Different stats content 1 ------------------------- */}
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                {
                    statsData.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k}/>
                        )
                    })
                }
            </div>

        {/** ---------------------- Different stats content 2 ------------------------- */}
            <div className="grid lg:grid-cols-4 mt-6 md:grid-cols-2 grid-cols-1 gap-6">
                {
                    statsData2.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k}/>
                        )
                    })
                }
            </div>

        {/** ---------------------- User source channels table  ------------------------- */}
        {/* 
            <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <UserChannels />
                <TopDamBreeders />
            </div>
        */}
        {/** ---------------------- User source channels table  ------------------------- */}
        
        <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
            {/* Breeds */}
            <DoughnutChart />
            
            <StackBarChart />
        </div>
        
        </>
    )
}

export default Dashboard
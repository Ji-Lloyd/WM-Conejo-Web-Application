/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard"
import firebase from "firebase/compat/app";
import 'firebase/firestore';
import '../../../app/firebase_config';
import { getFirestore, collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"; 


function TopDamBreeders(){

    const db = getFirestore();
    
    let [damBreeders, setDamBreeders] = useState([]);

    useEffect(() => {
        const fetchDamBreeders = async () => {
            const querySnapshot = await getDocs(query(collection(db, "DamBreeders"),limit(5),orderBy("damSuccessRate",'desc')));
            const temporaryArr = [];
            querySnapshot.forEach((doc) => {
                temporaryArr.push(doc.data());
            });

            setDamBreeders(temporaryArr);

        };

        fetchDamBreeders();

    }, [db]);

    return(
        <TitleCard title={"Top Dam Breeders"}>
             {/** Table Data */}
             <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th></th>
                        <th className="normal-case">Dam Name</th>
                        <th className="normal-case">Success Rate</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            damBreeders.map((u, k) => {
                                return(
                                    <tr key={k}>
                                        <th>{k+1}</th>
                                        <td>{u.damName}</td>
                                        <td>{u.damSuccessRate}%</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </TitleCard>
    )
}

export default TopDamBreeders
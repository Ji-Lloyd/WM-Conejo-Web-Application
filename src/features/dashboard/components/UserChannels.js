/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard"
import firebase from "firebase/compat/app";
import 'firebase/firestore';
import '../../../app/firebase_config';
import { getFirestore, collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"; 

function UserChannels(){

    const db = getFirestore();
    
    let [sireBreeders, setSireBreeders] = useState([]);

    useEffect(() => {
        const fetchSireBreeders = async () => {
            const querySnapshot = await getDocs(query(collection(db, "SireBreeders"),limit(5),orderBy("sireSuccessRate",'desc')));
            const temporaryArr = [];
            querySnapshot.forEach((doc) => {
                temporaryArr.push(doc.data());
            });

            setSireBreeders(temporaryArr);

        };

        fetchSireBreeders();

    }, [db]);

    return(
        <TitleCard title={"Top Sire Breeders"}>
             {/** Table Data */}
             <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th></th>
                        <th className="normal-case">Sire Name</th>
                        <th className="normal-case">Success Rate</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            sireBreeders.map((u, k) => {
                                return(
                                    <tr key={k}>
                                        <th>{k+1}</th>
                                        <td>{u.sireName}</td>
                                        <td>{u.sireSuccessRate}%</td>
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

export default UserChannels
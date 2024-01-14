/* eslint-disable no-unused-vars */
import moment from "moment"
import { useEffect, useState, useRef } from "react"
import TitleCard from "../../components/Cards/TitleCard"
import { PDFDocument } from "pdf-lib"
import firebase from "firebase/compat/app";
import 'firebase/firestore';
import '../../app/firebase_config'
import { getFirestore, collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux'
import { showNotification } from '../common/headerSlice'



function LinageTracker(){

    const db = getFirestore();
    const dispatch = useDispatch();
    //const [pdfBytes, setPdfBytes] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [inputRabbitName, setInputRabbitName] = useState('');

    const [inputMicro, setInputMicro] = useState('');
    const [inputSoldTo, setInputSoldTo] = useState('');
    const [inputAddress, setInputAddress] = useState('');
    const [inputFarm, setInputFarm] = useState('');
    const [inputContactNumber, setInputContactNumber] = useState('');
    const [inputTransactionDate, setInputTransactionDate] = useState('');


    const validateInputs = () => {
        return (
            inputRabbitName,
            inputMicro,
            inputSoldTo,
            inputAddress,
            inputFarm,
            inputContactNumber,
            inputTransactionDate
        );
        };
    
    

    const fetchRabbitInfo = async () => {
        try {
            setLoading(true);

            if (validateInputs()) {
            // Main Rabbit
            const querySnapshot = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", inputRabbitName))));
                let birthDate = "";
                let breed = "";
                let gender = "";
                let sire = "";
                let dam = "";

                querySnapshot.forEach((doc) => {
                    birthDate = doc.get("birthDate");
                    breed = doc.get("breed");
                    gender = doc.get("gender");
                    sire = doc.get("sire");
                    dam = doc.get("dam");

                    console.log(birthDate);
                });

            // Sire
            const sireInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", sire))));
                let sireBreed = "";
                let sireOrigin = "";
                let sire_GSire = "";
                let sire_GDam = "";

                sireInfo.forEach((doc) => {
                    sireBreed = doc.get("breed");
                    sireOrigin = doc.get("origin");
                    sire_GSire = doc.get("sire");
                    sire_GDam = doc.get("dam");
                });

            // Sire - Grand Sire
            const sire_GSireInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", sire_GSire))));
                let sire_GSireBreed = "";
                let sire_GSireOrigin = "";
                let sire_GSire_GGSire = "";
                let sire_GSire_GGDam = "";

                sire_GSireInfo.forEach((doc) => {
                    sire_GSireBreed = doc.get("breed");
                    sire_GSireOrigin = doc.get("origin");
                    sire_GSire_GGSire = doc.get("sire");
                    sire_GSire_GGDam = doc.get("dam");
                });

            // Sire - GSire - GGSire
            const sire_GGSireInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", sire_GSire_GGSire))));
                let sire_GSire_GGSireBreed = "";
                let sire_GSire_GGSireOrigin = "";

                sire_GGSireInfo.forEach((doc) => {
                    sire_GSire_GGSireBreed = doc.get("breed");
                    sire_GSire_GGSireOrigin = doc.get("origin");
                });

            // Sire - GDam - GGDam
            const sire_GGDamInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", sire_GSire_GGDam))));
                let sire_GSire_GGDamBreed = "";
                let sire_GSire_GGDamOrigin = "";

                sire_GGDamInfo.forEach((doc) => {
                    sire_GSire_GGDamBreed = doc.get("breed");
                    sire_GSire_GGDamOrigin = doc.get("origin");
                });
            
            // Sire - Grand Dam
            const sire_GDamInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", sire_GDam))));
                let sire_GDamBreed = "";
                let sire_GDamOrigin = "";
                let sire_GDam_GGSire = "";
                let sire_GDam_GGDam = "";

                sire_GDamInfo.forEach((doc) => {
                    sire_GDamBreed = doc.get("breed");
                    sire_GDamOrigin = doc.get("origin");
                    sire_GDam_GGSire = doc.get("sire");
                    sire_GDam_GGDam = doc.get("dam");
                });

            // Sire - Great Grand Dam
            const sire_gdam_GGSireInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", sire_GDam_GGSire))));
                let sire_gdam_GGSireBreed = "";
                let sire_gdam_GGSireOrigin = "";

                sire_gdam_GGSireInfo.forEach((doc) => {
                    sire_gdam_GGSireBreed = doc.get("breed");
                    sire_gdam_GGSireOrigin = doc.get("origin");
                });

            // Sire - Great Grand Dam
            const sire_GDam_GGDamInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", sire_GDam_GGDam))));
                let sire_GDam_GGDamBreed = "";
                let sire_GDam_GGDamOrigin = "";

                sire_GDam_GGDamInfo.forEach((doc) => {
                    sire_GDam_GGDamBreed = doc.get("breed");
                    sire_GDam_GGDamOrigin = doc.get("origin");
                });
            
            

            //
            //
            // Dam

            const damInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", dam))));
            let damBreed = "";
            let damOrigin = "";
            let dam_GSire = "";
            let dam_GDam = "";

            damInfo.forEach((doc) => {
                damBreed = doc.get("breed");
                damOrigin = doc.get("origin");
                dam_GSire = doc.get("sire");
                dam_GDam = doc.get("dam");
            });

            // Dam - Grand Sire
            const dam_GSireInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", dam_GSire))));
                let dam_GSireBreed = "";
                let dam_GSireOrigin = "";
                let dam_GSire_GGSire = "";
                let dam_GSire_GGDam = "";

                dam_GSireInfo.forEach((doc) => {
                    dam_GSireBreed = doc.get("breed");
                    dam_GSireOrigin = doc.get("origin");
                    dam_GSire_GGSire = doc.get("sire");
                    dam_GSire_GGDam = doc.get("dam");
                });

            // Dam - Grand Dam
            const dam_GDamInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", dam_GDam))));
                let dam_GDamBreed = "";
                let dam_GDamOrigin = "";
                let dam_GDam_GGSire = "";
                let dam_GDam_GGDam = "";

                dam_GDamInfo.forEach((doc) => {
                    dam_GDamBreed = doc.get("breed");
                    dam_GDamOrigin = doc.get("origin");
                    dam_GDam_GGSire = doc.get("sire");
                    dam_GDam_GGDam = doc.get("dam");
                });

            // Dam - GSire - GGSire
            const dam_GGSireInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", dam_GSire_GGSire))));
                let dam_GSire_GGSireBreed = "";
                let dam_GSire_GGSireOrigin = "";

                dam_GGSireInfo.forEach((doc) => {
                    dam_GSire_GGSireBreed = doc.get("breed");
                    dam_GSire_GGSireOrigin = doc.get("origin");
                });

            const dam_GGDamInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", dam_GSire_GGDam))));
                let dam_GSire_GGDamBreed = "";
                let dam_GSire_GGDamOrigin = "";

                dam_GGDamInfo.forEach((doc) => {
                    dam_GSire_GGDamBreed = doc.get("breed");
                    dam_GSire_GGDamOrigin = doc.get("origin");
                });

            const dam_gDam_GGSireInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", dam_GDam_GGSire))));
                let dam_GDam_GGSireBreed = "";
                let dam_GDam_GGSireOrigin = "";

                dam_gDam_GGSireInfo.forEach((doc) => {
                    dam_GDam_GGSireBreed = doc.get("breed");
                    dam_GDam_GGSireOrigin = doc.get("origin");
                });

            const dam_gDam_GGDamInfo = (await getDocs(query(collection(db, "Rabbit"),  where("name", "==", dam_GDam_GGDam))));
                let dam_GDam_GGDamBreed = "";
                let dam_GDam_GGDamOrigin = "";

                dam_gDam_GGDamInfo.forEach((doc) => {
                    dam_GDam_GGDamBreed = doc.get("breed");
                    dam_GDam_GGDamOrigin = doc.get("origin");
                });
            


            await fillForm(
                birthDate,breed,gender, 
                sire,sireOrigin,sireBreed, 
                sire_GSire,sire_GSireBreed,sire_GSireOrigin, 
                sire_GDam,sire_GDamBreed,sire_GDamOrigin,
                sire_GSire_GGSire,sire_GSire_GGSireBreed,sire_GSire_GGSireOrigin,
                sire_GSire_GGDam,sire_GSire_GGDamBreed,sire_GSire_GGDamOrigin,
                sire_GDam_GGSire,sire_gdam_GGSireBreed,sire_gdam_GGSireOrigin,
                sire_GDam_GGDam,sire_GDam_GGDamBreed,sire_GDam_GGDamOrigin,
                dam,damBreed,damOrigin,
                dam_GSire,dam_GSireBreed,dam_GSireOrigin,
                dam_GDam,dam_GDamBreed,dam_GDamOrigin,
                dam_GSire_GGSire,dam_GSire_GGSireBreed,dam_GSire_GGSireOrigin,
                dam_GSire_GGDam,dam_GSire_GGDamBreed,dam_GSire_GGDamOrigin,
                dam_GDam_GGSire,dam_GDam_GGSireBreed,dam_GDam_GGSireOrigin,
                dam_GDam_GGDam,dam_GDam_GGDamBreed,dam_GDam_GGDamOrigin);
            } else {
                dispatch(showNotification({message : 'Fill in all required fields.', status : 0}))
                console.error('Please fill in all required fields.');
            }

            


        } catch (error) {
            console.error('Error fetching rabbit:', error);
            alert(error);
        }finally{
            setLoading(false);
        }


    };


    
    const fillForm = async (birthDate,breed,gender, 
                    sire,sireOrigin,sireBreed, 
                    sire_GSire,sire_GSireBreed,sire_GSireOrigin,
                    sire_GDam,sire_GDamBreed,sire_GDamOrigin,
                    sire_GSire_GGSire,sire_GSire_GGSireBreed,sire_GSire_GGSireOrigin,
                    sire_GSire_GGDam,sire_GSire_GGDamBreed,sire_GSire_GGDamOrigin,
                    sire_GDam_GGSire,sire_gdam_GGSireBreed,sire_gdam_GGSireOrigin,
                    sire_GDam_GGDam,sire_GDam_GGDamBreed,sire_GDam_GGDamOrigin,
                    dam,damBreed,damOrigin,
                    dam_GSire,dam_GSireBreed,dam_GSireOrigin,
                    dam_GDam,dam_GDamBreed,dam_GDamOrigin,
                    dam_GSire_GGSire,dam_GSire_GGSireBreed,dam_GSire_GGSireOrigin,
                    dam_GSire_GGDam,dam_GSire_GGDamBreed,dam_GSire_GGDamOrigin,
                    dam_GDam_GGSire,dam_GDam_GGSireBreed,dam_GDam_GGSireOrigin,
                    dam_GDam_GGDam,dam_GDam_GGDamBreed,dam_GDam_GGDamOrigin) => {

        try{
            const url = 'https://firebasestorage.googleapis.com/v0/b/wm-conejo-el-patio.appspot.com/o/Linage_Tracking_Form.pdf?alt=media&token=cf1681bf-0164-4905-a642-77cdba43a9f8';
            const arrayBuffer = await fetch(url).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const form = pdfDoc.getForm();

            const microchip = form.getField("rabbitMicro").setText(inputMicro);
            form.getField("rabbitDateOfBirth").setText(birthDate);
            form.getField("rabbitGender").setText(gender);
            form.getField("rabbitBreed").setText(breed);
            
            form.getField("buyerName").setText(inputSoldTo);
            form.getField("buyerAddress").setText(inputAddress);
            form.getField("farm").setText(inputFarm);
            form.getField("buyerContactNumber").setText(inputContactNumber);

            //const formattedDate = inputTransactionDate.toISOString().slice(0, 10);

            const formattedDate = inputTransactionDate
                    ? inputTransactionDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })
                    : '';
            form.getField("transactionDate").setText(formattedDate);
            
            // Sire
            form.getField("sireName").setText(sire);
            form.getField("sireBreed").setText(sireBreed);
            form.getField("sireOrigin").setText(sireOrigin);

            // Sire - Grand Sire
            form.getField("sireGSireName").setText(sire_GSire);
            form.getField("sireGSireBreed").setText(sire_GSireBreed);
            form.getField("sireGSireOrigin").setText(sire_GSireOrigin);

            // Sire - Grand Sire - Great Grand Sire
            form.getField("sGSGGSireName").setText(sire_GSire_GGSire);
            form.getField("sGSGGSireBreed").setText(sire_GSire_GGSireBreed);
            form.getField("sGSGGSireOrigin").setText(sire_GSire_GGSireOrigin);

            // Sire - Grand Sire - Great Grand Dam
            form.getField("sGSGGDamName").setText(sire_GSire_GGDam);
            form.getField("sGSGGDamBreed").setText(sire_GSire_GGDamBreed);
            form.getField("sGSGGDamOrigin").setText(sire_GSire_GGDamOrigin);

            // Sire - Grand Dam
            form.getField("sireGDamName").setText(sire_GDam);
            form.getField("sireGDamBreed").setText(sire_GDamBreed);
            form.getField("sireGDamOrigin").setText(sire_GDamOrigin);

            // Sire - Grand Dam - Great Sire
            form.getField("sGDGGSireName").setText(sire_GDam_GGSire);
            form.getField("sGDGGSireBreed").setText(sire_gdam_GGSireBreed);
            form.getField("sGDGGSireOrigin").setText(sire_gdam_GGSireOrigin);

            // Sire - Grand Dam - Great Dam
            form.getField("sGDGGDamName").setText(sire_GDam_GGDam);
            form.getField("sGDGGDamBreed").setText(sire_GDam_GGDamBreed);
            form.getField("sGDGGDamOrigin").setText(sire_GDam_GGDamOrigin);


            //
            // Dam Side
            
            form.getField("damName").setText(dam);
            form.getField("damBreed").setText(damBreed);
            form.getField("damOrigin").setText(damOrigin);

            // Dam - Grand Sire
            form.getField("damGSireName").setText(dam_GSire);
            form.getField("damGSireBreed").setText(dam_GSireBreed);
            form.getField("damGSireOrigin").setText(dam_GSireOrigin);

            // Dam - Grand Dam
            form.getField("damGDamName").setText(dam_GDam);
            form.getField("damGDamBreed").setText(dam_GDamBreed);
            form.getField("damGDamOrigin").setText(dam_GDamOrigin);

            // Dam - GSire - Great Sire
            form.getField("dGSGGSireName").setText(dam_GSire_GGSire);
            form.getField("dGSGGSireBreed").setText(dam_GSire_GGSireBreed);
            form.getField("dGSGGSireOrigin").setText(dam_GSire_GGSireOrigin);

            // Dam - GSire - Great Dam
            form.getField("dGSGGDamName").setText(dam_GSire_GGDam);
            form.getField("dGSGGDamBreed").setText(dam_GSire_GGDamBreed);
            form.getField("dGSGGDamOrigin").setText(dam_GSire_GGDamOrigin);

            // Dam - GDam - Great Sire
            form.getField("dGDGGSireName").setText(dam_GDam_GGSire);
            form.getField("dGDGGSireBreed").setText(dam_GDam_GGSireBreed);
            form.getField("dGDGGSireOrigin").setText(dam_GDam_GGSireOrigin);

            // Dam - GDam - Great Dam
            form.getField("dGDGGDamName").setText(dam_GDam_GGDam);
            form.getField("dGDGGDamBreed").setText(dam_GDam_GGDamBreed);
            form.getField("dGDGGDamOrigin").setText(dam_GDam_GGDamOrigin);
            
            
            const filledPDFBytes = await pdfDoc.save();

            // Convert the filled PDF buffer to a Blob
            const filledPDFBlob = new Blob([filledPDFBytes], { type: 'application/pdf' });

            // Create a URL for the Blob
            const filledPDFUrl = URL.createObjectURL(filledPDFBlob);

            window.open(filledPDFUrl, '_blank'); // Open in a new tab

        }catch(error){
            console.log('Error filling pdf form: ', error);
            dispatch(showNotification({message : 'If persist. Use Firefox browser with CORS-Everywhere extension enable.', status : 0}))
        }
    };


    return(
        <>
             
            <TitleCard title="Lineage Tracker" topMargin="mt-2">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={inputRabbitName} onChange={(e) => setInputRabbitName(e.target.value)} placeholder="Rabbit Name" className="input  input-bordered w-full "/>
                    <input type="text" value={inputMicro} onChange={(e) => setInputMicro(e.target.value)} placeholder="Microchip" className="input  input-bordered w-full " />
                    <input type="text" value={inputSoldTo} onChange={(e) => setInputSoldTo(e.target.value)} placeholder="Sold To" className="input  input-bordered w-full "/>
                    <input type="text" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} placeholder="Address" className="input  input-bordered w-full "/>
                    <input type="text" value={inputFarm} onChange={(e) => setInputFarm(e.target.value)} placeholder="Farm" className="input  input-bordered w-full "/>
                    <input type="text" value={inputContactNumber} onChange={(e) => setInputContactNumber(e.target.value)} placeholder="Contact #" className="input  input-bordered w-full "/>
                    <DatePicker
                        selected={inputTransactionDate}
                        onChange={(date) => setInputTransactionDate(date)}
                        dateFormat="MMM dd yyyy"
                        placeholderText="Select date"
                        className="input input-bordered w-full"
                        />
                </div>
                <div className="divider" ></div>

                <div className="mt-16">
                    <button className="btn btn-primary float-right" onClick={fetchRabbitInfo} disabled={loading}>
                        {loading ? 'Loading...' : 'Track'}
                    </button>
                </div>
                
            
            </TitleCard>
            
        </>
    )
}


export default LinageTracker
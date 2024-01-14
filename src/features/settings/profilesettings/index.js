/* eslint-disable no-unused-vars */
import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import firebase from "firebase/compat/app";
import 'firebase/firestore';
import '../../../app/firebase_config';
import { getFirestore, collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged, reauthenticateWithCredential, updatePassword, EmailAuthProvider, createUserWithEmailAndPassword, updateCurrentUser  } from 'firebase/auth';


function ProfileSettings(){

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);

    const [error, setError] = useState(null);
    const [errorAdd, setErrorAdd] = useState(null);
    
    const [inputEmailAddress, setInputEmailAddress] = useState('');
    const [inputCurrentPassword, setInputCurrentPassword] = useState('');
    const [inputNewPassword, setInputNewPassword] = useState('');

    const [inputAddEmailAddress, setInputAddEmailAddress] = useState('');
    const [inputAddCurrentPassword, setInputAddCurrentPassword] = useState('');

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            try {
                if (user) {
                    if(!inputEmailAddress){
                        setInputEmailAddress(user.email);
                    }
                } else {
                    setInputEmailAddress('');
                }
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        });
        

        return () => unsubscribe();
    },[auth,inputEmailAddress]);

    // Add a loading state to prevent rendering the component until authentication state is determined
    if (inputEmailAddress === null) {
        return <div>Loading...</div>;
    }

    const handleChangePassword = async () => {
        //const auth = getAuth();
        //const user = auth.currentUser;
        
        // Create a credential using the current user's email and password
        const credential = EmailAuthProvider.credential(user.email, inputCurrentPassword);
    
        try {
            setLoading(true);
            // Reauthenticate the user with their current credentials
            await reauthenticateWithCredential(user, credential);

            // If reauthentication is successful, update the password
            await updatePassword(user, inputNewPassword);
            dispatch(showNotification({message : "Password updated successfully", status : 1}))
            setError(null);
            setLoadingAdd(false);
        } catch (error) {
          console.error('Error changing password:', error.message);
          dispatch(showNotification({message : "Error in changing password", status : 0}))
          //setError("Error in changing password");
          setLoading(false);
        }
    };

    const handleAddAccount = async () => {
        const auth = getAuth();
    
        try {

            let originalUser = auth.currentUser;

            setLoadingAdd(true);
            
            const userCredential = await createUserWithEmailAndPassword(auth, inputAddEmailAddress, inputAddCurrentPassword);
        
            dispatch(showNotification({message : "New account created successfully", status : 1}));
        
            setInputAddEmailAddress('');
            setInputAddCurrentPassword('');
            setErrorAdd(null);
            setLoadingAdd(false);

            //await auth.signOut();

            updateCurrentUser(auth,originalUser);
        } catch (error) {
          console.error('Error creating new account:', error.message);
          //setErrorAdd("Error creating new account");
          dispatch(showNotification({message : "Error creating new account", status : 0}));
          setLoadingAdd(false);
        }
    };

    const handleDeleteAccount = async () => {
        //const auth = getAuth();
        //const user = auth.currentUser;
    
        const confirmed = window.confirm("Are you sure you want to delete your account? The app will automatically logout after this process.");

        if (!confirmed) {
            // User cancelled the deletion
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email,inputCurrentPassword);
            await reauthenticateWithCredential(user,credential);

            // If reauthentication is successful, delete the user account
            await user.delete();

            // Sign out the user after the account has been deleted
            await auth.signOut();
            localStorage.clear();
            window.location.href = '/'
            setLoading(false);
        } catch (error) {
            console.error('Error deleting account:', error.message);
            dispatch(showNotification({ message: "Error deleting account", status: 0 }));
            setLoading(false);
        }
    };
    


    return(
        <>  
            <TitleCard title="Account Management" topMargin="mt-2">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={inputEmailAddress} onChange={(e) => setInputEmailAddress(e.target.value)} placeholder="Email Address" className="input  input-bordered w-full " readOnly />
                    <input type="text" value={inputCurrentPassword} onChange={(e) => setInputCurrentPassword(e.target.value)} placeholder="Current Password" className="input  input-bordered w-full "/>
                    <input type="text" value={inputNewPassword} onChange={(e) => setInputNewPassword(e.target.value)} placeholder="New Password" className="input  input-bordered w-full "/>
                </div>
                <div className="divider" ></div>

                <div className="mt-10 ml-5">
                    <button className="btn btn-warning float-right" onClick={handleDeleteAccount} disabled={loading}>
                        {loading ? 'Loading...' : 'Delete'}
                    </button>
                </div>

                <div className="mt-1 ml-5">
                    <button className="btn btn-primary float-right" onClick={handleChangePassword} disabled={loading}>
                        {loading ? 'Loading...' : 'Update'}  
                    </button>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </TitleCard>

            <TitleCard title="Add User" topMargin="mt-2">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" value={inputAddEmailAddress} onChange={(e) => setInputAddEmailAddress(e.target.value)} placeholder="New Email Address" className="input  input-bordered w-full " />
                    <input type="text" value={inputAddCurrentPassword} onChange={(e) => setInputAddCurrentPassword(e.target.value)} placeholder="New Password" className="input  input-bordered w-full "/>
                </div>
                <div className="divider" ></div>

                <div className="mt-10">
                    <button className="btn btn-primary float-right" onClick={handleAddAccount} disabled={loadingAdd}>
                        {loadingAdd ? 'Loading...' : 'Add'}
                    </button>
                </div>
                {errorAdd && <p style={{ color: 'red' }}>{errorAdd}</p>}
            </TitleCard>
        </>
    )
}


export default ProfileSettings
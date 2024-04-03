import React, {useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom';

function RemoveProfile({children}){
    const [showProfile,setShowProfile] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(location.pathname === '/login' || location.pathname === '/signup'){
            setShowProfile(false);
        } else {
            setShowProfile(true);
        }
    },[location]);

    return(
        <div>{showProfile && children}</div>
    )
}

export default RemoveProfile;
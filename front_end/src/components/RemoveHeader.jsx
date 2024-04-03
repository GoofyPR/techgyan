import React, {useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom';

function RemoveHeader({children}){
    const [showHeader,setShowHeader] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(location.pathname === '/login' || location.pathname === '/signup'){
            setShowHeader(false);
        } else {
            setShowHeader(true);
        }
    },[location]);

    return(
        <div>{showHeader && children}</div>
    )
}

export default RemoveHeader;
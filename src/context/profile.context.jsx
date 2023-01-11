import React , { createContext, useContext, useEffect, useRef, useState } from "react";
import { auth, database } from "../misc/firebase";


const ProfileContext= createContext();

export const ProfileProvider = ({children}) => {
    const [profile, setProfile ]  = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        // with onAuthStateChanged we can subscribe to the currently signed in user
        let userRef;
        const authUnsub = auth.onAuthStateChanged(authObj => {
            if(authObj)
            {
                userRef = database.ref(`/profiles/${authObj.uid}`);
                userRef.on('value', (snap)=>{
                 
                    const {name,createdAt} = snap.val();
                    const data = {name, createdAt, uid: authObj.uid,email:authObj.email};
                    setProfile(data);
                    setIsLoading(false);    
                });
            }
            else{
                if(userRef)
                {
                    useRef.off()  // for sign-off, unsubscribing from this user reference
                }
                setProfile(null);
                setIsLoading(false);
            }
        });
        return () => authUnsub();
    },[]);
    // eslint-disable-next-line
    return <ProfileContext.Provider value={{isLoading,profile}}>
        {children}
    </ProfileContext.Provider>
};

export const useProfile = ()=>useContext(ProfileContext);
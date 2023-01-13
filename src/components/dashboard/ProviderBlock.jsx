import React, { useState } from 'react';
import firebase from 'firebase/app';
import { Alert, Button, Icon, Tag } from 'rsuite';
import { auth } from '../../misc/firebase';

const ProviderBlock = () => {
  const curruser= auth.currentUser;
  // eslint-disable-next-line
  const [isConnected, setIsConnected] = useState({
    'google.com': curruser.providerData.some((data)=> data.providerId==='google.com'),
    'facebook.com': curruser.providerData.some((data)=> data.providerId==='facebook.com')
  })

  const updateIsConnected = (providerId,value) =>
  {
    setIsConnected(p=>{return {
      ...p,
      [providerId]: value,
      
    };})
  }
  const unlink = async (providerId)=>{
try{
  if(curruser.providerData.length===1)
  {
    throw new Error(`Cannot disconnect from ${providerId}. You must be connected to atleast 1 provider.`,4000);
  }

  await curruser.unlink(providerId);
  updateIsConnected(providerId,false);
  Alert.info(`Disconnected from ${providerId}`,2000);
}
catch(err)
{
  Alert.error(err.message,2000);
}

  };

  const unlinkFacebook = () => {unlink('facebook.com');};
  const unlinkGoogle = () => {unlink('google.com')};

  const link = async (provider) => {
      try{
        await auth.currentUser.linkWithPopup(provider);
        Alert.info(`Linked to ${provider.providerId}`,2000);
        updateIsConnected(provider.providerId,true);
      }
      catch(err)
      {
          Alert.error(err.message,2000);
      }
  }

  const linkFacebook = () => {link(new firebase.auth.FacebookAuthProvider())};
  const linkGoogle = () => {link(new firebase.auth.GoogleAuthProvider())};

  return (
    <div>
      {isConnected["google.com"] && 
      <Tag color="green" closable onClose={unlinkGoogle}>
        <Icon icon="google"> &nbsp; Connected</Icon>
      </Tag>
      }
      { isConnected["facebook.com"] &&
      <Tag color="blue" closable onClose={unlinkFacebook}>
        <Icon icon="facebook">&nbsp; Connected</Icon>
      </Tag>
      }
      <div className='mt-2'>
      { !isConnected["google.com"] && 
        <Button block color="green" onClick={linkGoogle}>
        <Icon icon="google"> &nbsp; Link to Google</Icon>
        </Button>
      }
      { !isConnected["facebook.com"] &&
        <Button block color="blue" onClick={linkFacebook}>
        <Icon icon="facebook"> &nbsp; Link to Facebook</Icon>
        </Button>
      }
     
      </div>
    </div>
  )
}

export default ProviderBlock
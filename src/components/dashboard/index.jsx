import React from 'react';
import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { database } from '../../misc/firebase';
import AvatarUploadBtn from './AvatarUploadBtn';
import EditableInput from './EditableInput';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({onSignOut}) => {
  const {profile} = useProfile();
  const onSave = async (newData) => { 
    const userNicknameRef = database.ref(`/profiles/${profile.uid}`).child('name'); 
    // this could also have been done as database.ref(`/profiles/${profile.uid}/name`)
    try{
      await userNicknameRef.set(newData);
      Alert.success('Nickname has beeen updated',2000);
    }
    catch(err)
    {
        Alert.error(err.message,2000);
    }
  };
  return (

    <>
      <Drawer.Header>
        <Drawer.Title>
          Dashboard
        </Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h3>Hello , {profile.name} !</h3>
        <ProviderBlock/>
        <Divider/>
        <EditableInput name="nickname" initialValue={profile.name} onSave={onSave} label={<h6 className='mb-2'>NickName</h6>}/>
        <AvatarUploadBtn/>
      </Drawer.Body>
      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          Sign Out
        </Button>
      </Drawer.Footer>
    </>
  )
}

export default Dashboard;
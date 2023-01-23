import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
  const {chatId} =useParams();
  const [messages, setMessages] = useState(null);
  
    const isChatEmpty = messages && messages.length ===0 ;
    const canShowMessages=messages && messages.length > 0 

  useEffect(() => {
    const messagesRef = database.ref('/messages');
    messagesRef.orderByChild('roomId').equalTo(chatId).on('value',(snap)=>{
      const data= transformToArrWithId(snap.val());
      setMessages(data);
    })
    return ()=>{
      messagesRef.off('value');
    }
  }, [chatId]);

  const handleAdmin = useCallback(
    async (uid) => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);
      let alertMsg;
      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            // eslint-disable-next-line
            admins[uid]=null;
            alertMsg="admin permission removed";
          } else {
            // eslint-disable-next-line
            admins[uid]=true;
            alertMsg="admin permission granted";
          }
        }
        return admins;
      });
      Alert.info(alertMsg,4000);
    },
    [chatId],
  )
  
  const handleLike = useCallback(async(msgId)=>{
    const {uid}=auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);
    let alertMsg;

    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          // eslint-disable-next-line
          msg.likeCount -=1;
          // eslint-disable-next-line
          msg.likes[uid]=null;
          alertMsg="Like removed";
        } else {
          // eslint-disable-next-line
          msg.likeCount +=1;
          if(!msg.likes)
          {
            // eslint-disable-next-line
            msg.likes={};
          }
          // eslint-disable-next-line
          msg.likes[uid]=true;
          alertMsg="Like added";
        }
      }
      return msg;
    });
    Alert.info(alertMsg,4000);
  },[]);

  const handleDelete = useCallback(async(msgId,file)=>{
// eslint-disable-next-line
    if(!window.confirm('Delete this message?'))
    {
      return;
    }
    const isLast = messages[messages.length-1] === msgId;
    const updates = {};
    updates[`/messages/${msgId}`]=null;

    if(isLast && messages.length>1)
    {
      updates[`/rooms/${chatId}/lastMessage`]={
        ...messages[messages.length-2],msgId:messages[messages.length-2].id
      }
    }

    if(isLast && messages.length===1)
    {
      updates[`/rooms/${chatId}/lastMessage`]=null;
    }
    try {
      await database.ref().update(updates)
      Alert.info('Message has been deleted',3000);
    } catch (err) {
      Alert.error(err.message);
      return;
    }

    if(file)
    {
    try {
      const fileRef = storage.refFromURL(file.url);
      await fileRef.delete();
    } catch (err) {
      Alert.error(err.message);
    }
  }

  },[chatId,messages]);
  
const renderMessages = ()=>{
  const groups = groupBy(messages,(item)=>new Date(item.createdAt).toDateString())


const items=[];

Object.keys(groups).forEach((date)=>{
  items.push(<li key={date} className='text-center mb-1 padded'>{date}</li>)
  const msgs = groups[date].map(msg=>< MessageItem key={msg.id} message={msg } handleAdmin={handleAdmin} handleLike={handleLike} handleDelete={handleDelete}/>);

  items.push(...msgs);
});
return items;
};

  return (
    <ul className='msg-list custom-scroll'>
      {isChatEmpty && <li>No Messages yet..
        </li>}
        {
          canShowMessages && renderMessages()
        }
    </ul>
  )
}

export default Messages;

// messages.map(msg=>< MessageItem key={msg.id} message={msg } handleAdmin={handleAdmin} handleLike={handleLike} handleDelete={handleDelete}/>)
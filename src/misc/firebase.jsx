
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAEYuqzMngwLsh05h8ZmkZ5dotmagANMkI",
    authDomain: "chat-web-app-98de3.firebaseapp.com",
    databaseURL: "https://chat-web-app-98de3-default-rtdb.firebaseio.com",
    projectId: "chat-web-app-98de3",
    storageBucket: "chat-web-app-98de3.appspot.com",
    messagingSenderId: "928995862655",
    appId: "1:928995862655:web:c225fa3a206f43bd97b74a"
  };
// eslint-disable-next-line
  const app = firebase.initializeApp(firebaseConfig);
  export const auth=app.auth();
  export const database = app.database();
  export const storage = app.storage();
  

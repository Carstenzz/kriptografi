import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const sendData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    // console.log('Document written with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
};

export const fetchData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    // console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
};

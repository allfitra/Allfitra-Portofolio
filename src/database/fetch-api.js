// importing db firebase
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function postMessage(itemData) {
  try {
    const collectionRef = collection(db, 'message');
    const docRef = await addDoc(collectionRef, itemData);

    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e; // Re-throw the error so calling code can handle it
  }
}

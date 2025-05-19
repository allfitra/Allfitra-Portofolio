// importing db firebase
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

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

export async function getMessages() {
  try {
    const collectionRef = collection(db, 'message');
    const snapshot = await getDocs(collectionRef);
    const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return messages;
  } catch (e) {
    console.error('Error fetching documents: ', e);
    throw e; // Re-throw the error so calling code can handle it
  }
}

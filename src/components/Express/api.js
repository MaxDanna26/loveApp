import { db, doc, getDocs, collection, deleteDoc, addDoc, query } from "../../services/firebase";

const collectionName = 'loveApp';

export const createNote = async (idUser, note) => {
  await addDoc(collection(db, "loveApp", idUser, "loveNotes"), note);
};

export const getNotes = async (idUser) => {
  const colRef = collection(db, collectionName, idUser, 'loveNotes');
  const result = await getDocs(query(colRef));
  return getArrayFromCollection(result);
}

export const deleteNote = async (uid, id) => {
  await deleteDoc(doc(db, "loveApp", uid, "loveNotes", id));
};

const getArrayFromCollection = (collection) => {
  return collection.docs.map(doc => {
    return { ...doc.data(), id: doc.id };
  });
}

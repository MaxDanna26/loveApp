import { db, doc, getDoc, getDocs, collection, updateDoc, deleteDoc, addDoc, query, where } from "../../services/firebase";

const collectionName = 'loveApp';

// CREATE
export const createExpense = async (idUser, obj) => {
  const colRef = collection(db, collectionName, idUser, 'expense');
  const data = await addDoc(colRef, obj);
  return data.id;
}

// UPDATE
export const updateExpense = async (userId, id, obj) => {
  const docRef = doc(db, 'loveApp', userId, 'expense', id);
  await updateDoc(docRef, obj)
}

// READ
export const getExpenses = async (idUser) => {
  const colRef = collection(db, collectionName, idUser, 'expense');
  const result = await getDocs(query(colRef));
  return getArrayFromCollection(result);
}

// READ WITH WHERE
// Tener en cuenta que el tipo de dato de la condición debe coincidir con el tipo de dato que hay en Firebase o no obtendré un dato de respuesta
export const getExpenseByCondition = async (value) => {
  const colRef = collection(db, collectionName);
  const result = await getDocs(query(colRef, where('age', '==', value)));
  return getArrayFromCollection(result);
}

export const getExpenseById = async (userId, id) => {
  const docRef = doc(db, 'users', userId, 'expense', id);
  const result = await getDoc(docRef);
  return result.data();
}

// DELETE
export const deleteExpense = async (userId, id) => {
  const docRef = doc(db, 'loveApp', userId, 'expense', id);
  await deleteDoc(docRef);
}

export const getExpenseByUserId = async (userId) => {
  const colRef = collection(db, 'users', userId, 'expense');
  const result = await getDocs(colRef);
  return getArrayFromCollection(result);
}

const getArrayFromCollection = (collection) => {
  return collection.docs.map(doc => {
    return { ...doc.data(), id: doc.id };
  });
}

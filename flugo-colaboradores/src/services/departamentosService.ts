import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Departamento } from '../types/Departamento';

const collectionRef = collection(db, 'departamentos');

export const listarDepartamentos = async (): Promise<Departamento[]> => {
  const snapshot = await getDocs(collectionRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Departamento, 'id'>),
  }));
};

export const criarDepartamento = async (data: Departamento) => {
  await addDoc(collectionRef, data);
};

export const editarDepartamento = async (id: string, data: Partial<Departamento>) => {
  const ref = doc(db, 'departamentos', id);
  await updateDoc(ref, data);
};

export const excluirDepartamento = async (id: string) => {
  const ref = doc(db, 'departamentos', id);
  await deleteDoc(ref);
};

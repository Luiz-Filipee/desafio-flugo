import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { Colaborador } from '../types/Colaborador';

const COLECAO = 'colaboradores';

export async function cadastrarColaborador(colaborador: Colaborador) {
  await addDoc(collection(db, COLECAO), {
    ...colaborador,
    criadoEm: serverTimestamp(),
  });
}

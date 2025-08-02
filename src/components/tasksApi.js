import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    if (!projectId) return;
    const q = query(collection(db, 'tasks'), where('projectId', '==', projectId));
    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [projectId]);
  return tasks;
}

export async function addTask(task) {
  await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: Timestamp.now()
  });
}

export async function updateTask(id, updates) {
  await updateDoc(doc(db, 'tasks', id), updates);
}

export async function deleteTask(id) {
  await deleteDoc(doc(db, 'tasks', id));
}

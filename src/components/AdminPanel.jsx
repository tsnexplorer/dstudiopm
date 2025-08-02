import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Typography, Paper, Button } from '@mui/material';

export default function AdminPanel() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      setProjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  const addProject = async () => {
    const newProject = { name: 'New Project', created: Date.now() };
    const docRef = await addDoc(collection(db, 'projects'), newProject);
    setProjects((prev) => [...prev, { ...newProject, id: docRef.id }]);
  };

  const removeProject = async () => {
    if (projects[0]) {
      await deleteDoc(doc(db, 'projects', projects[0].id));
      setProjects((prev) => prev.slice(1));
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>🔒 Admin Panel</Typography>
      <Button variant="contained" color="success" sx={{ mb: 2, borderRadius: 2 }} onClick={addProject}>Add Project</Button>
      <Button variant="contained" color="error" sx={{ mb: 2, borderRadius: 2 }} onClick={removeProject}>Remove Project</Button>
      <Typography color="text.secondary">Monitor performance and manage projects here.</Typography>
      <ul>
        {projects.map(p => (
          <li key={p.id}>{p.name} ({p.created})</li>
        ))}
      </ul>
    </Paper>
  );
}

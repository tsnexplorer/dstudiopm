import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Paper } from '@mui/material';

export default function TaskTracker({ handleAssignTask }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', due: '', status: 'Pending' });

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      setTasks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTasks();
  }, []);

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = async () => {
    const docRef = await addDoc(collection(db, 'tasks'), newTask);
    setTasks((prev) => [...prev, { ...newTask, id: docRef.id }]);
    setNewTask({ title: '', due: '', status: 'Pending' });
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="secondary" fontWeight={700} gutterBottom>✅ Task Tracker</Typography>
      <TextField label="Task Title" name="title" value={newTask.title} onChange={handleTaskChange} fullWidth sx={{ mb: 2 }} />
      <TextField label="Due Date" name="due" type="date" value={newTask.due} onChange={handleTaskChange} fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select name="status" value={newTask.status} onChange={handleTaskChange} label="Status">
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" sx={{ mr: 2, borderRadius: 2 }} onClick={addTask}>Add Task</Button>
      <Button variant="outlined" color="secondary" sx={{ borderRadius: 2 }} onClick={handleAssignTask}>Assign Task</Button>
      <ul style={{ listStyle: 'disc', paddingLeft: 20, marginTop: 16 }}>
        {tasks.map((task, idx) => (
          <li key={idx}>{task.title} - {task.status} (Due: {task.due})</li>
        ))}
      </ul>
    </Paper>
  );
}

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Typography, Paper, Button } from '@mui/material';

export default function TimelineTracker() {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      const querySnapshot = await getDocs(collection(db, 'timeline'));
      setTimeline(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTimeline();
  }, []);

  const addEvent = async () => {
    const event = { name: 'New Event', date: new Date().toISOString() };
    const docRef = await addDoc(collection(db, 'timeline'), event);
    setTimeline((prev) => [...prev, { ...event, id: docRef.id }]);
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="error" fontWeight={700} gutterBottom>📊 Timeline Tracker (Gantt Chart)</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={addEvent}>Add Event</Button>
      <ul>
        {timeline.map(ev => (
          <li key={ev.id}>{ev.name} - {ev.date}</li>
        ))}
      </ul>
    </Paper>
  );
}

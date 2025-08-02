import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { Typography, Paper, Button, TextField } from '@mui/material';

export default function BudgetDashboard() {
  const [budget, setBudget] = useState({ planned: 0, actual: 0 });

  useEffect(() => {
    const fetchBudget = async () => {
      const querySnapshot = await getDocs(collection(db, 'budgets'));
      if (querySnapshot.docs[0]) {
        setBudget(querySnapshot.docs[0].data());
      }
    };
    fetchBudget();
  }, []);

  const updateBudget = async () => {
    const budgetSnap = await getDocs(collection(db, 'budgets'));
    if (budgetSnap.docs[0]) {
      await updateDoc(doc(db, 'budgets', budgetSnap.docs[0].id), budget);
    } else {
      await addDoc(collection(db, 'budgets'), budget);
    }
    alert('Budget updated!');
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="warning.main" fontWeight={700} gutterBottom>💰 Budget Dashboard</Typography>
      <TextField label="Planned Budget" type="number" value={budget.planned} onChange={e => setBudget(b => ({ ...b, planned: e.target.value }))} fullWidth sx={{ mb: 2 }} />
      <TextField label="Actual Spend" type="number" value={budget.actual} onChange={e => setBudget(b => ({ ...b, actual: e.target.value }))} fullWidth sx={{ mb: 2 }} />
      <Button variant="contained" color="warning" sx={{ mt: 2, borderRadius: 2 }} onClick={updateBudget}>Update Budget</Button>
    </Paper>
  );
}

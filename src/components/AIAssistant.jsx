import React from 'react';
import { Typography, Paper, Button } from '@mui/material';

export default function AIAssistant({ handleAutoReport, handleBudgetAlert, handleVendorReminder }) {
  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="secondary" fontWeight={700} gutterBottom>🤖 AI Assistant</Typography>
      <Button variant="contained" color="success" sx={{ mb: 2, borderRadius: 2 }} onClick={handleAutoReport}>Generate Weekly Report</Button>
      <Button variant="contained" color="primary" sx={{ mb: 2, borderRadius: 2 }} onClick={handleAutoReport}>Generate Monthly Report</Button>
      <Button variant="contained" color="warning" sx={{ mb: 2, borderRadius: 2 }} onClick={handleBudgetAlert}>Check Budget Status</Button>
      <Button variant="contained" color="error" sx={{ mb: 2, borderRadius: 2 }} onClick={handleVendorReminder}>Send Vendor Reminder</Button>
    </Paper>
  );
}

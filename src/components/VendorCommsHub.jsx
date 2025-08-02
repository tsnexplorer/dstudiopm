import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Typography, Paper, Button, TextField } from '@mui/material';

export default function VendorCommsHub() {
  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState({ vendor: '', order: '' });

  useEffect(() => {
    const fetchVendors = async () => {
      const querySnapshot = await getDocs(collection(db, 'vendors'));
      setVendors(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchVendors();
  }, []);

  const addVendor = async () => {
    const docRef = await addDoc(collection(db, 'vendors'), vendor);
    setVendors((prev) => [...prev, { ...vendor, id: docRef.id }]);
    setVendor({ vendor: '', order: '' });
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>🛒 Vendor Comms Hub</Typography>
      <TextField label="Vendor Name" name="vendor" value={vendor.vendor} onChange={e => setVendor(v => ({ ...v, vendor: e.target.value }))} fullWidth sx={{ mb: 2 }} />
      <TextField label="Order Details" name="order" value={vendor.order} onChange={e => setVendor(v => ({ ...v, order: e.target.value }))} fullWidth sx={{ mb: 2 }} />
      <Button variant="contained" color="primary" sx={{ borderRadius: 2 }} onClick={addVendor}>Add Vendor</Button>
      <ul>
        {vendors.map(v => (
          <li key={v.id}>{v.vendor}: {v.order}</li>
        ))}
      </ul>
    </Paper>
  );
}

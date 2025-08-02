import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Typography, Paper, Button, TextField } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export default function SitePhotoLogs() {
  const [photos, setPhotos] = useState([]);
  const [photo, setPhoto] = useState({ tag: '', notes: '' });

  useEffect(() => {
    const fetchPhotos = async () => {
      const querySnapshot = await getDocs(collection(db, 'photos'));
      setPhotos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPhotos();
  }, []);

  const addPhoto = async () => {
    const docRef = await addDoc(collection(db, 'photos'), photo);
    setPhotos((prev) => [...prev, { ...photo, id: docRef.id }]);
    setPhoto({ tag: '', notes: '' });
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="error" fontWeight={700} gutterBottom>📷 Site Photo Logs</Typography>
      <Button variant="contained" color="secondary" startIcon={<PhotoCameraIcon />} sx={{ mb: 2, borderRadius: 2 }} onClick={addPhoto}>
        Add Photo Metadata
      </Button>
      <TextField label="Tag" name="tag" value={photo.tag} onChange={e => setPhoto(p => ({ ...p, tag: e.target.value }))} fullWidth sx={{ mb: 2 }} />
      <TextField label="Notes" name="notes" value={photo.notes} onChange={e => setPhoto(p => ({ ...p, notes: e.target.value }))} fullWidth multiline rows={2} />
      <ul>
        {photos.map(p => (
          <li key={p.id}>{p.tag}: {p.notes}</li>
        ))}
      </ul>
    </Paper>
  );
}

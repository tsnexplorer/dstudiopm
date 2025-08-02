import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// Dynamically load leaflet CSS
function useLeafletCss() {
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);
}

const initialForm = {
  client: '',
  address: '',
  maps: '',
  notes: '',
};

export default function ClientOnboarding({ clients, onAdd, onUpdate, onDelete }) {
  useLeafletCss();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const [clientsData, setClientsData] = useState([]);
  // Fetch clients from Firestore on mount
  useEffect(() => {
    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClientsData(data);
    };
    fetchClients();
  }, []);
  // Load leaflet.js and set up map picker
  useEffect(() => {
    if (!showMap) return;
    const loadLeaflet = async () => {
      if (!window.L) {
        await import('leaflet');
      }
      const L = window.L || (await import('leaflet')).default;
      if (mapRef.current && !mapRef.current._leaflet_id) {
        const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Center on India
        leafletMapRef.current = map;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
        map.on('click', function(e) {
          if (markerRef.current) {
            markerRef.current.remove();
          }
          const { lat, lng } = e.latlng;
          markerRef.current = L.marker([lat, lng]).addTo(map);
          setForm((prev) => ({ ...prev, maps: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}` }));
        });
      }
    };
    loadLeaflet();
    // eslint-disable-next-line
  }, [showMap]);

  // Handle current location
  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (!window.L) {
          await import('leaflet');
        }
        const L = window.L || (await import('leaflet')).default;
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([lat, lng], 16);
          if (markerRef.current) {
            markerRef.current.remove();
          }
          markerRef.current = L.marker([lat, lng]).addTo(leafletMapRef.current);
          setForm((prev) => ({ ...prev, maps: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}` }));
        }
      },
      (error) => {
        alert('Unable to retrieve your location.');
      }
    );
  };
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState({});

  // Validation
  const validate = () => {
    const err = {};
    if (!form.client) err.client = 'Required';
    if (!form.address) err.address = 'Required';
    return err;
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (Object.keys(err).length) return;
    if (editingId) {
      // Update client in Firestore
      await updateDoc(doc(db, 'clients', editingId), form);
      setClientsData(prev => prev.map(c => c.id === editingId ? { ...form, id: editingId } : c));
    } else {
      // Add client to Firestore
      const docRef = await addDoc(collection(db, 'clients'), form);
      setClientsData(prev => [...prev, { ...form, id: docRef.id }]);
    }
    setForm(initialForm);
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (id) => {
    const client = clientsData.find((c) => c.id === id);
    setForm(client);
    setEditingId(id);
    setError({});
  };

  // Handle delete
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'clients', id));
    setClientsData(prev => prev.filter((c) => c.id !== id));
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
      setError({});
    }
  };

  // Filter clients
  const filteredClients = clientsData.filter(
    (c) => c.client.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper elevation={3} sx={{ maxWidth: 800, margin: '32px auto', padding: 4, fontFamily: 'Roboto, Arial, sans-serif' }}>
      <Typography variant="h4" component="h2" gutterBottom fontWeight={700} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <span role="img" aria-label="Client">👤</span>&nbsp;Client Onboarding
      </Typography>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid #c7d2fe', display: 'grid', gap: 24 }}>
          <TextField
            label="Client Name"
            name="client"
            value={form.client}
            onChange={handleChange}
            required
            error={!!error.client}
            helperText={error.client}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            error={!!error.address}
            helperText={error.address}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Mobile Number"
            name="mobile"
            value={form.mobile || ''}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Email Address"
            name="email"
            value={form.email || ''}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
          />
          <div>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>Location</Typography>
            <Button variant="contained" color="primary" startIcon={<LocationOnIcon />} sx={{ mr: 2, borderRadius: 8 }} onClick={() => setShowMap((v) => !v)}>
              {showMap ? 'Hide Map' : 'Pick on Map'}
            </Button>
            {showMap && (
              <Button variant="contained" color="secondary" sx={{ borderRadius: 8 }} onClick={handleCurrentLocation}>
                Use Current Location
              </Button>
            )}
            {showMap && (
              <div style={{ marginTop: 16, height: 300, width: '100%', borderRadius: 16, overflow: 'hidden' }}>
                <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Click on the map to select a location, or use your current location. The link will be auto-filled.
                </Typography>
              </div>
            )}
          </div>
          {/* Removed propertyType, projectType, budget, currency, targetDate fields from client form */}
          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
          <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: 8, fontWeight: 600 }} startIcon={<span>💾</span>}>
            {editingId ? 'Update' : 'Add'}
          </Button>
          {editingId && (
            <Button type="button" variant="outlined" color="secondary" sx={{ borderRadius: 8, ml: 2 }} onClick={() => { setForm(initialForm); setEditingId(null); setError({}); }}>
              Cancel
            </Button>
          )}
        </div>
      </form>
      <div style={{ marginTop: 40 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>Existing Clients</Typography>
        <TextField
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
            <TableRow sx={{ backgroundColor: 'background.accent' }}>
                <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Client Name</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Address</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Mobile</TableCell>
                <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Email</TableCell>
                {/* Removed propertyType, projectType, budget, targetDate columns from client table */}
                <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: '#9ca3af' }}>No clients found.</TableCell>
                </TableRow>
              )}
              {filteredClients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.client}</TableCell>
                  <TableCell>
                    {c.address}
                    {c.maps && (
                      <IconButton href={c.maps} target="_blank" rel="noopener noreferrer" color="primary" sx={{ ml: 1 }}>
                        <LocationOnIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>{c.mobile}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  {/* Removed propertyType, projectType, budget, targetDate cells from client table */}
                  <TableCell>
                    <Button variant="outlined" color="primary" sx={{ mr: 1, borderRadius: 8 }} onClick={() => handleEdit(c.id)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="error" sx={{ borderRadius: 8 }} onClick={() => handleDelete(c.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
}

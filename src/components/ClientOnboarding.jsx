import React, { useState, useEffect, useRef } from 'react';
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
  propertyType: '',
  projectType: '',
  budget: '',
  currency: 'INR',
  targetDate: '',
  notes: '',
};

export default function ClientOnboarding({ clients, onAdd, onUpdate, onDelete }) {
  useLeafletCss();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
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
    if (!form.propertyType) err.propertyType = 'Required';
    if (!form.projectType) err.projectType = 'Required';
    if (!form.budget) err.budget = 'Required';
    if (!form.targetDate) err.targetDate = 'Required';
    return err;
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (Object.keys(err).length) return;
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onAdd(form);
    }
    setForm(initialForm);
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (id) => {
    const client = clients.find((c) => c.id === id);
    setForm(client);
    setEditingId(id);
    setError({});
  };

  // Handle delete
  const handleDelete = (id) => {
    onDelete(id);
    if (editingId === id) {
      setForm(initialForm);
      setEditingId(null);
      setError({});
    }
  };

  // Filter clients
  const filteredClients = clients.filter(
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
          <FormControl fullWidth variant="outlined" required error={!!error.propertyType}>
            <InputLabel id="propertyType-label">Property Type</InputLabel>
            <Select
              labelId="propertyType-label"
              id="propertyType"
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              label="Property Type"
            >
              <MenuItem value="">Select...</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Villa">Villa</MenuItem>
              <MenuItem value="Independent House">Independent House</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
            </Select>
            {error.propertyType && <Typography variant="caption" color="error">{error.propertyType}</Typography>}
          </FormControl>
          <FormControl fullWidth variant="outlined" required error={!!error.projectType}>
            <InputLabel id="projectType-label">Project Type</InputLabel>
            <Select
              labelId="projectType-label"
              id="projectType"
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              label="Project Type"
            >
              <MenuItem value="">Select...</MenuItem>
              {(form.propertyType === 'Apartment' || form.propertyType === 'Villa') && [ '1 BHK', '2BHK', '3BHK', '4BHK', '4+BHK' ].map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
              {form.propertyType === 'Commercial' && (
                <MenuItem value="Custom">Custom</MenuItem>
              )}
            </Select>
            {error.projectType && <Typography variant="caption" color="error">{error.projectType}</Typography>}
          </FormControl>
          <div style={{ display: 'flex', gap: 16 }}>
            <FormControl variant="outlined" sx={{ minWidth: 100 }}>
              <InputLabel id="currency-label">Currency</InputLabel>
              <Select
                labelId="currency-label"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                label="Currency"
              >
                <MenuItem value="INR">₹ INR</MenuItem>
                <MenuItem value="USD">$ USD</MenuItem>
                <MenuItem value="EUR">€ EUR</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Budget"
              name="budget"
              type="number"
              min={0}
              value={form.budget}
              onChange={handleChange}
              required
              error={!!error.budget}
              helperText={error.budget}
              fullWidth
              variant="outlined"
            />
          </div>
          <TextField
            label="Target Date"
            name="targetDate"
            type="date"
            value={form.targetDate}
            onChange={handleChange}
            required
            error={!!error.targetDate}
            helperText={error.targetDate}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
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
              <TableRow sx={{ backgroundColor: '#e0e7ff' }}>
                <TableCell>Client Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Property Type</TableCell>
                <TableCell>Project Type</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Target Date</TableCell>
                <TableCell>Actions</TableCell>
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
                  <TableCell>{c.propertyType}</TableCell>
                  <TableCell>{c.projectType}</TableCell>
                  <TableCell>{c.currency} {c.budget}</TableCell>
                  <TableCell>{c.targetDate}</TableCell>
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

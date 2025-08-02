import React, { useState } from 'react';
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
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function ProjectsPage({ projects, clients, onAdd, onUpdate, onDelete }) {
  // Map picker state
  const [showMap, setShowMap] = useState(false);
  const mapRef = React.useRef(null);
  const markerRef = React.useRef(null);
  const leafletMapRef = React.useRef(null);

  // Dynamically load leaflet CSS
  React.useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  // Load leaflet.js and set up map picker
  React.useEffect(() => {
    if (!showMap) return;
    const loadLeaflet = async () => {
      if (!window.L) {
        await import('leaflet');
      }
      const L = window.L || (await import('leaflet')).default;
      if (mapRef.current && !mapRef.current._leaflet_id) {
        const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
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
          setForm((prev) => ({ ...prev, location: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}` }));
        });
      }
    };
    loadLeaflet();
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
          setForm((prev) => ({ ...prev, location: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}` }));
        }
      },
      (error) => {
        alert('Unable to retrieve your location.');
      }
    );
  };
  // Sort clients alphabetically by name
  const sortedClients = [...clients].sort((a, b) => (a.name || a.client || '').localeCompare(b.name || b.client || ''));
  const [clientSearch, setClientSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    clientId: '',
    address: '',
    location: '',
    currency: 'INR',
    budget: '',
    propertyType: '',
    propertySize: '',
    projectType: '',
    notes: '',
    state: 'Lead',
    stateHistory: [],
    targetDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onAdd(form);
    }
    setForm({
      clientId: '',
      address: '',
      location: '',
      currency: 'INR',
      budget: '',
      propertyType: '',
      projectType: '',
      notes: '',
      state: 'Lead',
      stateHistory: []
    });
    setEditingId(null);
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({ ...project });
  };

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>Projects</Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        {/* Property Size Dropdown (moved below Property Type and Project Type) */}
        {/* ...existing code... */}
        {/* Client Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Client</InputLabel>
          <Select
            name="clientId"
            value={form.clientId}
            label="Client"
            onChange={handleChange}
            required
            renderValue={selected => {
              const c = sortedClients.find(cl => cl.id === selected);
              return c ? `${c.name || c.client} (${c.mobile || ''}${c.email ? ', ' + c.email : ''})` : 'Select Client';
            }}
            MenuProps={{ PaperProps: { style: { maxHeight: 320 } } }}
          >
            <MenuItem disabled value="">
              <TextField
                placeholder="Search clients..."
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                fullWidth
                size="small"
                sx={{ minWidth: 200 }}
              />
            </MenuItem>
            {sortedClients
              .filter(client => (client.name || client.client || '').toLowerCase().includes(clientSearch.toLowerCase()))
              .map(client => (
                <MenuItem key={client.id} value={client.id}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{client.name || client.client}</span>
                    <span style={{ fontSize: 12, color: '#888' }}>{client.mobile || ''}{client.email ? ' | ' + client.email : ''}</span>
                  </div>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {/* State */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>State</InputLabel>
          <Select name="state" value={form.state} label="State" onChange={handleChange} required>
            <MenuItem value="Lead">Lead</MenuItem>
            <MenuItem value="Proposal">Proposal</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Archived">Archived</MenuItem>
          </Select>
        </FormControl>
        {/* Budget */}
        <TextField name="budget" label="Budget" value={form.budget} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        {/* Target Completion Date - Material UI DatePicker */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Target Completion Date"
            value={form.targetDate ? new Date(form.targetDate) : null}
            onChange={date => {
              // Format as DD-MM-YYYY for display, but store as YYYY-MM-DD
              if (date) {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                setForm(prev => ({ ...prev, targetDate: `${year}-${month}-${day}` }));
              } else {
                setForm(prev => ({ ...prev, targetDate: '' }));
              }
            }}
            inputFormat="dd-MM-yyyy"
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
          />
        </LocalizationProvider>
        {/* Project Type Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Project Type</InputLabel>
          <Select
            name="projectType"
            value={form.projectType}
            label="Project Type"
            onChange={handleChange}
            required
          >
            <MenuItem value="Interior">Interior</MenuItem>
            <MenuItem value="Renovation">Renovation</MenuItem>
            <MenuItem value="New Build">New Build</MenuItem>
            <MenuItem value="Landscape">Landscape</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        {/* Property Type Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Property Type</InputLabel>
          <Select
            name="propertyType"
            value={form.propertyType}
            label="Property Type"
            onChange={handleChange}
            required
          >
            <MenuItem value="Apartment">Apartment</MenuItem>
            <MenuItem value="Villa">Villa</MenuItem>
            <MenuItem value="Office">Office</MenuItem>
            <MenuItem value="Retail">Retail</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        {/* Property Size Dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Property Size</InputLabel>
          <Select
            name="propertySize"
            value={form.propertySize || ''}
            label="Property Size"
            onChange={handleChange}
            required
          >
            <MenuItem value="1BHK">1BHK</MenuItem>
            <MenuItem value="2BHK">2BHK</MenuItem>
            <MenuItem value="3BHK">3BHK</MenuItem>
            <MenuItem value="4BHK">4BHK</MenuItem>
            <MenuItem value="Studio">Studio</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        {/* Address */}
        <TextField name="address" label="Address" value={form.address} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
        {/* Map picker after address */}
        <div style={{ marginBottom: 24 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2, borderRadius: 8 }} onClick={() => setShowMap((v) => !v)}>
            {showMap ? 'Hide Map' : 'Pick Location on Map'}
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
        {/* Notes */}
        <TextField name="notes" label="Notes" value={form.notes} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" color="primary">
          {editingId ? 'Update Project' : 'Add Project'}
        </Button>
        {editingId && (
          <Button variant="text" color="secondary" sx={{ ml: 2 }} onClick={() => { setEditingId(null); setForm({ clientId: '', address: '', location: '', currency: 'INR', budget: '', propertyType: '', projectType: '', notes: '', state: 'Lead', stateHistory: [] }); }}>
            Cancel
          </Button>
        )}
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Property Type</TableCell>
              <TableCell>Project Type</TableCell>
              <TableCell>Target Date</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map(project => {
              const clientObj = clients.find(c => c.id === project.clientId);
              const clientName = clientObj ? (clientObj.name || clientObj.client || 'Unknown') : 'Unknown';
              return (
                <TableRow key={project.id}>
                  <TableCell>{clientName}</TableCell>
                  <TableCell>{project.address}</TableCell>
                  <TableCell>
                    {project.location ? (
                      <a href={project.location} target="_blank" rel="noopener noreferrer">View Map</a>
                    ) : ''}
                  </TableCell>
                  <TableCell>{project.currency}</TableCell>
                  <TableCell>{project.budget}</TableCell>
                  <TableCell>{project.propertyType}</TableCell>
                  <TableCell>{project.projectType}</TableCell>
                  <TableCell>{project.targetDate}</TableCell>
                  <TableCell>{project.state}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(project)}><EditIcon /></IconButton>
                    <IconButton onClick={() => onDelete(project.id)} color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

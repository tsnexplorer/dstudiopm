import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
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
    <div className="card-pro max-w-3xl mx-auto">
      <h2 className="heading-pro mb-8"><span>👤</span>Client Onboarding</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6 pb-6 border-b border-blue-200 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-blue-700 font-medium mb-1" htmlFor="client">Client Name <span className="text-red-500">*</span></label>
            <input id="client" name="client" className="input-pro" value={form.client} onChange={handleChange} />
            {error.client && <span className="text-xs text-red-500">{error.client}</span>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1" htmlFor="address">Address <span className="text-red-500">*</span></label>
            <input id="address" name="address" className="input-pro" value={form.address} onChange={handleChange} />
            {error.address && <span className="text-xs text-red-500">{error.address}</span>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1" htmlFor="maps">Location</label>
            <div className="flex gap-2 items-center">
              <button type="button" className="btn-rounded" onClick={() => setShowMap((v) => !v)}>
                {showMap ? 'Hide Map' : 'Pick on Map'}
              </button>
              {showMap && (
                <button type="button" className="btn-rounded" style={{ backgroundImage: 'linear-gradient(to right, #38bdf8, #6366f1)' }} onClick={handleCurrentLocation}>
                  Use Current Location
                </button>
              )}
            </div>
            {showMap && (
              <div className="mt-2" style={{ height: '300px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
                <div className="text-xs text-gray-500 mt-1">Click on the map to select a location, or use your current location. The link will be auto-filled.</div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1" htmlFor="propertyType">Property Type <span className="text-red-500">*</span></label>
            <select id="propertyType" name="propertyType" className="input-pro" value={form.propertyType} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Independent House">Independent House</option>
              <option value="Commercial">Commercial</option>
            </select>
            {error.propertyType && <span className="text-xs text-red-500">{error.propertyType}</span>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1" htmlFor="projectType">Project Type <span className="text-red-500">*</span></label>
            <select id="projectType" name="projectType" className="input-pro" value={form.projectType} onChange={handleChange}>
              <option value="">Select...</option>
              {form.propertyType === 'Apartment' || form.propertyType === 'Villa' ? (
                [ '1 BHK', '2BHK', '3BHK', '4BHK', '4+BHK' ].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))
              ) : form.propertyType === 'Commercial' ? (
                <option value="Custom">Custom</option>
              ) : null}
            </select>
            {error.projectType && <span className="text-xs text-red-500">{error.projectType}</span>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1" htmlFor="budget">Budget <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <select name="currency" className="input-pro w-24" value={form.currency} onChange={handleChange}>
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
              <input id="budget" name="budget" className="input-pro" type="number" min="0" value={form.budget} onChange={handleChange} />
            </div>
            {error.budget && <span className="text-xs text-red-500">{error.budget}</span>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1" htmlFor="targetDate">Target Date <span className="text-red-500">*</span></label>
            <input id="targetDate" name="targetDate" type="date" className="input-pro" value={form.targetDate} onChange={handleChange} />
            {error.targetDate && <span className="text-xs text-red-500">{error.targetDate}</span>}
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-1" htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" className="input-pro" value={form.notes} onChange={handleChange}></textarea>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button type="submit" className="btn-rounded flex items-center gap-2">
            <span>💾</span> {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" className="btn-rounded flex items-center gap-2 ml-2" onClick={() => { setForm(initialForm); setEditingId(null); setError({}); }}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="mt-10">
        <h3 className="heading-pro text-lg mb-4">Existing Clients</h3>
        <input className="input-pro mb-4" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2">Client Name</th>
              <th className="p-2">Address</th>
              <th className="p-2">Property Type</th>
              <th className="p-2">Project Type</th>
              <th className="p-2">Budget</th>
              <th className="p-2">Target Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 && (
              <tr><td colSpan={7} className="p-2 text-center text-gray-400">No clients found.</td></tr>
            )}
            {filteredClients.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.client}</td>
                <td className="p-2">
                  {c.address}
                  {c.maps && (
                    <a href={c.maps} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-2">View on Map</a>
                  )}
                </td>
                <td className="p-2">{c.propertyType}</td>
                <td className="p-2">{c.projectType}</td>
                <td className="p-2">{c.currency} {c.budget}</td>
                <td className="p-2">{c.targetDate}</td>
                <td className="p-2">
                  <button className="btn-rounded mr-2" onClick={() => handleEdit(c.id)}>Edit</button>
                  <button className="btn-rounded" style={{ backgroundImage: 'linear-gradient(to right, #ef4444, #db2777)' }} onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

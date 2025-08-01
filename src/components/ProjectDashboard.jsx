import React, { useState } from 'react';
import ClientOnboarding from './ClientOnboarding';
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
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StoreIcon from '@mui/icons-material/Store';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function TopNav({ current, setCurrent }) {
  const navItems = [
    { key: 'onboarding', label: 'Client Onboarding', icon: '👤' },
    { key: 'tasks', label: 'Task Tracker', icon: '✅' },
    { key: 'timeline', label: 'Timeline Tracker', icon: '📊' },
    { key: 'budget', label: 'Budget Dashboard', icon: '💰' },
    { key: 'vendor', label: 'Vendor Comms Hub', icon: '🛒' },
    { key: 'photos', label: 'Site Photo Logs', icon: '📷' },
    { key: 'ai', label: 'AI Assistant', icon: '🤖' },
    { key: 'admin', label: 'Admin Panel', icon: '🔒' },
  ];
  const icons = {
    onboarding: <AssignmentIcon />,
    tasks: <AssignmentIcon />,
    timeline: <TimelineIcon />,
    budget: <AttachMoneyIcon />,
    vendor: <StoreIcon />,
    photos: <PhotoCameraIcon />,
    ai: <SmartToyIcon />,
    admin: <AdminPanelSettingsIcon />,
  };
  return (
    <Paper elevation={2} sx={{ display: 'flex', justifyContent: 'center', mb: 4, borderRadius: '0 0 16px 16px', py: 1, bgcolor: 'primary.main' }}>
      {navItems.map(item => (
        <Button
          key={item.key}
          variant={current === item.key ? 'contained' : 'text'}
          color={current === item.key ? 'secondary' : 'inherit'}
          startIcon={icons[item.key]}
          sx={{ mx: 1, px: 3, py: 1.5, fontWeight: 600, fontSize: 16, borderRadius: '16px 16px 0 0' }}
          onClick={() => setCurrent(item.key)}
        >
          {item.label}
        </Button>
      ))}
    </Paper>
  );
}


function TaskTracker({ newTask, handleTaskChange, addTask, handleAssignTask, tasks }) {
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

function TimelineTracker() {
  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="error" fontWeight={700} gutterBottom>📊 Timeline Tracker (Gantt Chart)</Typography>
      <Typography color="text.secondary">Timeline visualization will be displayed here.</Typography>
    </Paper>
  );
}

function BudgetDashboard({ project, handleBudgetAlert }) {
  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="warning.main" fontWeight={700} gutterBottom>💰 Budget Dashboard</Typography>
      <Typography>Planned Budget: ₹{project.budget}</Typography>
      <Typography>Actual Spend: ₹0 {/* TODO: Track actual spend */}</Typography>
      <Button variant="contained" color="warning" sx={{ mt: 2, borderRadius: 2 }} onClick={handleBudgetAlert}>Check Budget Status</Button>
    </Paper>
  );
}

function VendorCommsHub({ project, handleChange, handleVendorReminder }) {
  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>🛒 Vendor Comms Hub</Typography>
      <TextField label="Vendor Name" name="vendor" value={project.vendor || ''} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
      <TextField label="Order Details" name="order" value={project.order || ''} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
      <Button variant="contained" color="primary" sx={{ borderRadius: 2 }} onClick={handleVendorReminder}>Send Reminder</Button>
    </Paper>
  );
}

function SitePhotoLogs({ project, handleChange, handlePhotoUpload }) {
  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="error" fontWeight={700} gutterBottom>📷 Site Photo Logs</Typography>
      <Button variant="contained" component="label" color="secondary" startIcon={<PhotoCameraIcon />} sx={{ mb: 2, borderRadius: 2 }}>
        Upload Photo
        <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
      </Button>
      <TextField label="Tag" name="photoTag" value={project.photoTag || ''} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
      <TextField label="Notes" name="photoNotes" value={project.photoNotes || ''} onChange={handleChange} fullWidth multiline rows={2} />
    </Paper>
  );
}

function AIAssistant({ handleAutoReport, handleBudgetAlert, handleVendorReminder }) {
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

function AdminPanel({ handleAddProject, handleRemoveProject }) {
  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mb: 4 }}>
      <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>🔒 Admin Panel</Typography>
      <Button variant="contained" color="success" sx={{ mb: 2, borderRadius: 2 }} onClick={handleAddProject}>Add Project</Button>
      <Button variant="contained" color="error" sx={{ mb: 2, borderRadius: 2 }} onClick={handleRemoveProject}>Remove Project</Button>
      <Typography color="text.secondary">Monitor performance and manage projects here.</Typography>
    </Paper>
  );
}

export default function ProjectDashboard() {
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', due: '', status: 'Pending' });
  const [currentPage, setCurrentPage] = useState('onboarding');

  // Client CRUD
  const handleAddClient = (client) => {
    setClients((prev) => [...prev, { ...client, id: Date.now().toString() }]);
  };
  const handleUpdateClient = (id, updated) => {
    setClients((prev) => prev.map((c) => c.id === id ? { ...updated, id } : c));
  };
  const handleDeleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // Task logic
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };
  const addTask = () => {
    setTasks((prev) => [...prev, newTask]);
    setNewTask({ title: '', due: '', status: 'Pending' });
  };

  // MVP Feature Handlers
  const handleAutoReport = () => {
    alert('Weekly report generated! (AI-powered)');
  };
  const handleBudgetAlert = () => {
    alert('Budget status: (Planned)');
  };
  const handleVendorReminder = () => {
    alert('Vendor reminder sent!');
  };
  const handlePhotoUpload = (e) => {
    alert('Photo uploaded!');
  };
  const handleAddProject = () => {
    alert('Project added!');
  };
  const handleRemoveProject = () => {
    alert('Project removed!');
  };
  const handleAssignTask = () => {
    alert('Task assigned!');
  };

  return (
    <div style={{ fontFamily: 'Roboto, Arial, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #232d1b 0%, #2e3b23 100%)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 48, marginBottom: 48 }}>
        <img src="/logo-350x294.png" alt="Designor Studio Logo" style={{ width: 80, height: 67, marginBottom: 16, objectFit: 'contain' }} />
        <img src="/title.png" alt="Designor Studio PM Title" style={{ maxWidth: 320, height: 'auto', marginBottom: 0 }} />
      </div>
      <TopNav current={currentPage} setCurrent={setCurrentPage} />
      <div style={{ marginTop: 32 }}>
        {currentPage === 'onboarding' && (
          <ClientOnboarding
            clients={clients}
            onAdd={handleAddClient}
            onUpdate={handleUpdateClient}
            onDelete={handleDeleteClient}
          />
        )}
        {currentPage === 'tasks' && (
          <TaskTracker newTask={newTask} handleTaskChange={handleTaskChange} addTask={addTask} handleAssignTask={handleAssignTask} tasks={tasks} />
        )}
        {currentPage === 'timeline' && (
          <TimelineTracker />
        )}
        {currentPage === 'budget' && (
          <BudgetDashboard project={clients[0] || {}} handleBudgetAlert={handleBudgetAlert} />
        )}
        {currentPage === 'vendor' && (
          <VendorCommsHub project={clients[0] || {}} handleChange={() => {}} handleVendorReminder={handleVendorReminder} />
        )}
        {currentPage === 'photos' && (
          <SitePhotoLogs project={clients[0] || {}} handleChange={() => {}} handlePhotoUpload={handlePhotoUpload} />
        )}
        {currentPage === 'ai' && (
          <AIAssistant handleAutoReport={handleAutoReport} handleBudgetAlert={handleBudgetAlert} handleVendorReminder={handleVendorReminder} />
        )}
        {currentPage === 'admin' && (
          <AdminPanel handleAddProject={handleAddProject} handleRemoveProject={handleRemoveProject} />
        )}
      </div>
    </div>
  );
}
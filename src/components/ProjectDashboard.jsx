import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import ClientOnboarding from './ClientOnboarding';
import TaskTracker from './TaskTracker';
import TimelineTracker from './TimelineTracker';
import BudgetDashboard from './BudgetDashboard';
import VendorCommsHub from './VendorCommsHub';
import SitePhotoLogs from './SitePhotoLogs';
import AdminPanel from './AdminPanel';
import AIAssistant from './AIAssistant';
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



export default function ProjectDashboard() {
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', due: '', status: 'Pending' });

  // Fetch tasks from Firestore on mount
  React.useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
    };
    fetchTasks();
  }, []);
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
  const addTask = async () => {
    const docRef = await addDoc(collection(db, 'tasks'), newTask);
    setTasks((prev) => [...prev, { ...newTask, id: docRef.id }]);
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
          <TaskTracker handleAssignTask={handleAssignTask} />
        )}
        {currentPage === 'timeline' && (
          <TimelineTracker />
        )}
        {currentPage === 'budget' && (
          <BudgetDashboard />
        )}
        {currentPage === 'vendor' && (
          <VendorCommsHub />
        )}
        {currentPage === 'photos' && (
          <SitePhotoLogs />
        )}
        {currentPage === 'ai' && (
          <AIAssistant handleAutoReport={handleAutoReport} handleBudgetAlert={handleBudgetAlert} handleVendorReminder={handleVendorReminder} />
        )}
        {currentPage === 'admin' && (
          <AdminPanel />
        )}
      </div>
    </div>
  );
}
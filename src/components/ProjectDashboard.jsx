import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import ClientOnboarding from './ClientOnboarding';
import TasksPage from './TasksPage';
import { addTask, updateTask, deleteTask } from './tasksApi';
import { ProjectStatePieChart, ProjectStateStackedBarChart } from './ProjectCharts';
import ProjectsPage from './ProjectsPage';
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
    { key: 'summary', label: 'Summary', icon: '📈' },
    { key: 'analytics', label: 'Analytics', icon: '📊' },
    { key: 'projects', label: 'Projects', icon: '🏗️' },
    { key: 'tasks', label: 'Tasks & Timeline', icon: '✅' },
    { key: 'more', label: 'More', icon: '⋯' },
  ];
  const moreItems = [
    { key: 'onboarding', label: 'Client Onboarding', icon: '�' },
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
        item.key !== 'more' ? (
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
        ) : (
          <FormControl key="more" sx={{ mx: 1, minWidth: 120 }}>
            <Select
              value={current.startsWith('more-') ? current : ''}
              displayEmpty
              onChange={e => setCurrent(e.target.value)}
              renderValue={() => 'More'}
              sx={{ px: 3, py: 1.5, fontWeight: 600, fontSize: 16, borderRadius: '16px 16px 0 0', bgcolor: 'inherit' }}
            >
              {moreItems.map(m => (
                <MenuItem key={m.key} value={m.key} sx={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 8 }}>{m.icon}</span>{m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      ))}
    </Paper>
  );
}



export default function MainPage() {
  // Charting helpers
  const getProjectStateCounts = () => {
    const counts = {};
    projects.forEach(p => {
      counts[p.state] = (counts[p.state] || 0) + 1;
    });
    return counts;
  };

  const getMonthlyStateData = (monthsBack = 3, monthsForward = 0) => {
    const now = new Date();
    const data = [];
    for (let i = -monthsBack; i < monthsForward; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = month.toLocaleString('default', { month: 'short', year: 'numeric' });
      const monthProjects = projects.filter(p => {
        if (!p.targetDate) return false;
        const d = new Date(p.targetDate);
        return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
      });
      const stateCounts = {};
      monthProjects.forEach(p => {
        stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
      });
      data.push({ label, ...stateCounts });
    }
    return data;
  };
  // Client data model: id, name, address, mobile, email
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({ name: '', address: '', mobile: '', email: '' });
  // Project data model: id, clientId, address, location, currency, budget, propertyType, projectType, notes, state, stateHistory, targetDate
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ clientId: '', address: '', location: '', currency: 'INR', budget: '', propertyType: '', projectType: '', notes: '', state: 'Lead', stateHistory: [], targetDate: '' });
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

  // Fetch clients and projects from Firestore on mount
  React.useEffect(() => {
    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      setClients(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchClients();
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      setProjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);
  // Project CRUD
  const handleAddProject = async (project) => {
    const docRef = await addDoc(collection(db, 'projects'), project);
    setProjects((prev) => [...prev, { ...project, id: docRef.id }]);
  };
  const handleUpdateProject = async (id, updated) => {
    await updateDoc(doc(db, 'projects', id), updated);
    setProjects((prev) => prev.map((p) => p.id === id ? { ...updated, id } : p));
  };
  const handleDeleteProject = async (id) => {
    await deleteDoc(doc(db, 'projects', id));
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Client CRUD
  const handleAddClient = async (client) => {
    const docRef = await addDoc(collection(db, 'clients'), client);
    setClients((prev) => [...prev, { ...client, id: docRef.id }]);
  };
  const handleUpdateClient = async (id, updated) => {
    await updateDoc(doc(db, 'clients', id), updated);
    setClients((prev) => prev.map((c) => c.id === id ? { ...updated, id } : c));
  };
  const handleDeleteClient = async (id) => {
    await deleteDoc(doc(db, 'clients', id));
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
        {currentPage === 'analytics' && (
          <Paper elevation={3} sx={{ maxWidth: 1200, margin: '32px auto', padding: 4, borderRadius: 4, fontFamily: 'Roboto, Arial, sans-serif' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>Advanced Analytics</Typography>
            {/* Add advanced analytics charts/components here, e.g. completion rate, duration, budget utilization, funnel, deadlines, leaderboard, type distribution, monthly new projects, alerts */}
            <Typography variant="body1" sx={{ mb: 2 }}>
              This page will show:
              <ul>
                <li>Project Completion Rate</li>
                <li>Average Project Duration</li>
                <li>Budget Utilization</li>
                <li>State Transition Funnel</li>
                <li>Upcoming Deadlines</li>
                <li>Client Leaderboard</li>
                <li>Project Type Distribution</li>
                <li>Monthly New Projects</li>
                <li>Custom Alerts</li>
              </ul>
            </Typography>
          </Paper>
        )}
        {currentPage === 'summary' && (
          <Paper elevation={3} sx={{ maxWidth: 1200, margin: '32px auto', padding: 4, borderRadius: 4, fontFamily: 'Roboto, Arial, sans-serif', background: 'linear-gradient(135deg, #232d1b 0%, #2e3b23 100%)' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3, color: '#eafbe7' }}>AI Agent Project Summary</Typography>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <Paper elevation={2} sx={{ flex: 1, minWidth: 320, p: 3, borderRadius: 3, mb: 2, background: '#2e3b23', border: '1px solid #b6d7a8' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#c7e7c1' }}>Ongoing Projects by State</Typography>
                <ProjectStatePieChart data={getProjectStateCounts()} />
              </Paper>
              <Paper elevation={2} sx={{ flex: 2, minWidth: 400, p: 3, borderRadius: 3, mb: 2, background: '#232d1b', border: '1px solid #90caf9' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#90caf9' }}>Last 3 Months Summary</Typography>
                <ProjectStateStackedBarChart data={getMonthlyStateData(3, 0)} />
              </Paper>
              <Paper elevation={2} sx={{ flex: 2, minWidth: 400, p: 3, borderRadius: 3, mb: 2, background: '#232d1b', border: '1px solid #ffb74d' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: '#ffb74d' }}>Next 3 Months Pipeline</Typography>
                <ProjectStateStackedBarChart data={getMonthlyStateData(0, 3)} />
              </Paper>
            </div>
            <Typography variant="body2" sx={{ mt: 4, color: '#b6d7a8', fontWeight: 500, textAlign: 'center', letterSpacing: 1 }}>
              <span style={{ background: '#232d1b', padding: '8px 16px', borderRadius: 8, border: '1px dashed #b6d7a8', color: '#c7e7c1' }}>
                Guidelines: Review project states regularly. Use the pipeline chart to anticipate workload. Completed projects improve your completion rate!
              </span>
            </Typography>
          </Paper>
        )}
        {currentPage === 'onboarding' && (
          <ClientOnboarding
            clients={clients}
            onAdd={handleAddClient}
            onUpdate={handleUpdateClient}
            onDelete={handleDeleteClient}
          />
        )}
        {/* ...existing code... */}
        {currentPage === 'projects' && (
          <ProjectsPage
            projects={projects}
            clients={clients}
            onAdd={handleAddProject}
            onUpdate={handleUpdateProject}
            onDelete={handleDeleteProject}
          />
        )}
        {currentPage === 'tasks' && (
          <TasksPage
            projects={projects}
            tasks={tasks}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
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
import React, { useState } from 'react';
import ClientOnboarding from './ClientOnboarding';

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
  return (
    <nav className="flex justify-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 shadow-lg border-b mb-8 rounded-b-xl py-2">
      {navItems.map(item => (
        <button
          key={item.key}
          className={`mx-2 px-5 py-3 font-semibold rounded-t-xl transition-all duration-200 focus:outline-none text-lg shadow flex items-center gap-2 ${current === item.key ? 'bg-white text-blue-700 shadow-lg' : 'text-white hover:bg-white hover:text-blue-700'}`}
          onClick={() => setCurrent(item.key)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}


function TaskTracker({ newTask, handleTaskChange, addTask, handleAssignTask, tasks }) {
  return (
    <div className="card-pro max-w-2xl mx-auto">
      <h2 className="heading-pro text-purple-700 mb-4">✅ Task Tracker</h2>
      <input className="input-pro mb-2" placeholder="Task Title" name="title" value={newTask.title} onChange={handleTaskChange}/>
      <input className="input-pro mb-2" type="date" name="due" value={newTask.due} onChange={handleTaskChange}/>
      <select className="input-pro mb-2" name="status" value={newTask.status} onChange={handleTaskChange}>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <button className="btn-rounded mr-2" onClick={addTask}>Add Task</button>
      <button className="btn-rounded" style={{ backgroundImage: 'linear-gradient(to right, #a21caf, #db2777)' }} onClick={handleAssignTask}>Assign Task</button>
      <ul className="list-disc pl-5 mt-2">
        {tasks.map((task, idx) => (
          <li key={idx}>{task.title} - {task.status} (Due: {task.due})</li>
        ))}
      </ul>
    </div>
  );
}

function TimelineTracker() {
  return (
    <div className="card-pro max-w-2xl mx-auto">
      <h2 className="heading-pro text-pink-700 mb-4">📊 Timeline Tracker (Gantt Chart)</h2>
      <p className="text-gray-600">Timeline visualization will be displayed here.</p>
    </div>
  );
}

function BudgetDashboard({ project, handleBudgetAlert }) {
  return (
    <div className="card-pro max-w-2xl mx-auto">
      <h2 className="heading-pro text-yellow-700 mb-4">💰 Budget Dashboard</h2>
      <p>Planned Budget: ₹{project.budget}</p>
      <p>Actual Spend: ₹0 {/* TODO: Track actual spend */}</p>
      <button className="btn-rounded" style={{ backgroundImage: 'linear-gradient(to right, #fbbf24, #db2777)' }} onClick={handleBudgetAlert}>Check Budget Status</button>
    </div>
  );
}

function VendorCommsHub({ project, handleChange, handleVendorReminder }) {
  return (
    <div className="card-pro max-w-2xl mx-auto">
      <h2 className="heading-pro text-blue-700 mb-4">🛒 Vendor Comms Hub</h2>
      <input className="input-pro mb-2" placeholder="Vendor Name" name="vendor" value={project.vendor || ''} onChange={handleChange}/>
      <input className="input-pro mb-2" placeholder="Order Details" name="order" value={project.order || ''} onChange={handleChange}/>
      <button className="btn-rounded" style={{ backgroundImage: 'linear-gradient(to right, #2563eb, #a21caf)' }} onClick={handleVendorReminder}>Send Reminder</button>
    </div>
  );
}

function SitePhotoLogs({ project, handleChange, handlePhotoUpload }) {
  return (
    <div className="card-pro max-w-2xl mx-auto">
      <h2 className="heading-pro text-pink-700 mb-4">📷 Site Photo Logs</h2>
      <input className="input-pro mb-2" type="file" accept="image/*" onChange={handlePhotoUpload}/>
      <input className="input-pro mb-2" placeholder="Tag" name="photoTag" value={project.photoTag || ''} onChange={handleChange}/>
      <textarea className="input-pro mb-2" placeholder="Notes" name="photoNotes" value={project.photoNotes || ''} onChange={handleChange}></textarea>
    </div>
  );
}

function AIAssistant({ handleAutoReport, handleBudgetAlert, handleVendorReminder }) {
  return (
    <div className="card-pro max-w-2xl mx-auto">
      <h2 className="heading-pro text-purple-700 mb-4">🤖 AI Assistant</h2>
      <button className="btn-rounded mb-2" style={{ backgroundImage: 'linear-gradient(to right, #22c55e, #2563eb)' }} onClick={handleAutoReport}>Generate Weekly Report</button>
      <button className="btn-rounded mb-2" style={{ backgroundImage: 'linear-gradient(to right, #2563eb, #a21caf)' }} onClick={handleAutoReport}>Generate Monthly Report</button>
      <button className="btn-rounded mb-2" style={{ backgroundImage: 'linear-gradient(to right, #fbbf24, #db2777)' }} onClick={handleBudgetAlert}>Check Budget Status</button>
      <button className="btn-rounded mb-2" style={{ backgroundImage: 'linear-gradient(to right, #a21caf, #db2777)' }} onClick={handleVendorReminder}>Send Vendor Reminder</button>
    </div>
  );
}

function AdminPanel({ handleAddProject, handleRemoveProject }) {
  return (
    <div className="card-pro max-w-2xl mx-auto">
      <h2 className="heading-pro text-blue-900 mb-4">🔒 Admin Panel</h2>
      <button className="btn-rounded mb-2" style={{ backgroundImage: 'linear-gradient(to right, #22c55e, #2563eb)' }} onClick={handleAddProject}>Add Project</button>
      <button className="btn-rounded mb-2" style={{ backgroundImage: 'linear-gradient(to right, #ef4444, #db2777)' }} onClick={handleRemoveProject}>Remove Project</button>
      <p className="text-gray-600">Monitor performance and manage projects here.</p>
    </div>
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
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center pt-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 drop-shadow-lg">🚀 Designor Studio PM</h1>
      <TopNav current={currentPage} setCurrent={setCurrentPage} />
      <div className="mt-8">
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
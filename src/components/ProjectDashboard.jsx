import React, { useState } from 'react';

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

function ClientOnboarding({ project, handleChange }) {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-xl border border-blue-200">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2"><span>👤</span>Client Onboarding</h2>
      <div className="grid grid-cols-1 gap-4">
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-blue-400" placeholder="Project Name" name="name" value={project.name} onChange={handleChange}/>
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-blue-400" placeholder="Client Name" name="client" value={project.client} onChange={handleChange}/>
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-blue-400" placeholder="Address" name="address" value={project.address || ''} onChange={handleChange}/>
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-blue-400" placeholder="Scope" name="scope" value={project.scope || ''} onChange={handleChange}/>
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-blue-400" placeholder="Budget (₹)" name="budget" value={project.budget} onChange={handleChange}/>
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-blue-400" type="date" placeholder="Timeline" name="timeline" value={project.timeline || ''} onChange={handleChange}/>
        <input className="border border-blue-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-blue-400" placeholder="Preferences" name="preferences" value={project.preferences || ''} onChange={handleChange}/>
        <textarea className="border border-blue-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 bg-white/80 placeholder-blue-400" placeholder="Notes" name="notes" value={project.notes} onChange={handleChange}></textarea>
      </div>
    </div>
  );
}

function TaskTracker({ newTask, handleTaskChange, addTask, handleAssignTask, tasks }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Task Tracker</h2>
      <input className="border p-2 w-full mb-2 rounded-lg focus:ring-2 focus:ring-purple-400" placeholder="Task Title" name="title" value={newTask.title} onChange={handleTaskChange}/>
      <input className="border p-2 w-full mb-2 rounded-lg focus:ring-2 focus:ring-purple-400" type="date" name="due" value={newTask.due} onChange={handleTaskChange}/>
      <select className="border p-2 w-full mb-2 rounded-lg focus:ring-2 focus:ring-purple-400" name="status" value={newTask.status} onChange={handleTaskChange}>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform" onClick={addTask}>Add Task</button>
      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg ml-2 shadow hover:scale-105 transition-transform" onClick={handleAssignTask}>Assign Task</button>
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
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-pink-700">📊 Timeline Tracker (Gantt Chart)</h2>
      <p className="text-gray-600">Timeline visualization will be displayed here.</p>
    </div>
  );
}

function BudgetDashboard({ project, handleBudgetAlert }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-yellow-700">💰 Budget Dashboard</h2>
      <p>Planned Budget: ₹{project.budget}</p>
      <p>Actual Spend: ₹0 {/* TODO: Track actual spend */}</p>
      <button className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform mb-2" onClick={handleBudgetAlert}>Check Budget Status</button>
    </div>
  );
}

function VendorCommsHub({ project, handleChange, handleVendorReminder }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🛒 Vendor Comms Hub</h2>
      <input className="border p-2 w-full mb-2 rounded-lg focus:ring-2 focus:ring-blue-400" placeholder="Vendor Name" name="vendor" value={project.vendor || ''} onChange={handleChange}/>
      <input className="border p-2 w-full mb-2 rounded-lg focus:ring-2 focus:ring-blue-400" placeholder="Order Details" name="order" value={project.order || ''} onChange={handleChange}/>
      <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform mb-2" onClick={handleVendorReminder}>Send Reminder</button>
    </div>
  );
}

function SitePhotoLogs({ project, handleChange, handlePhotoUpload }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-pink-700">📷 Site Photo Logs</h2>
      <input className="border p-2 w-full mb-2 rounded-lg focus:ring-2 focus:ring-pink-400" type="file" accept="image/*" onChange={handlePhotoUpload}/>
      <input className="border p-2 w-full mb-2 rounded-lg focus:ring-2 focus:ring-pink-400" placeholder="Tag" name="photoTag" value={project.photoTag || ''} onChange={handleChange}/>
      <textarea className="border p-2 w-full mb-2 rounded-lg focus:ring-2 focus:ring-pink-400" placeholder="Notes" name="photoNotes" value={project.photoNotes || ''} onChange={handleChange}></textarea>
    </div>
  );
}

function AIAssistant({ handleAutoReport, handleBudgetAlert, handleVendorReminder }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">🤖 AI Assistant</h2>
      <button className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform mb-2" onClick={handleAutoReport}>Generate Weekly Report</button>
      <button className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform mb-2" onClick={handleAutoReport}>Generate Monthly Report</button>
      <button className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform mb-2" onClick={handleBudgetAlert}>Check Budget Status</button>
      <button className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform mb-2" onClick={handleVendorReminder}>Send Vendor Reminder</button>
    </div>
  );
}

function AdminPanel({ handleAddProject, handleRemoveProject }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">🔒 Admin Panel</h2>
      <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform mb-2" onClick={handleAddProject}>Add Project</button>
      <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform mb-2" onClick={handleRemoveProject}>Remove Project</button>
      <p className="text-gray-600">Monitor performance and manage projects here.</p>
    </div>
  );
}

export default function ProjectDashboard() {
  const [project, setProject] = useState({ name: '', client: '', budget: '', notes: '' });
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', due: '', status: 'Pending' });
  const [currentPage, setCurrentPage] = useState('onboarding');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

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
    // TODO: Integrate OpenAI API for report generation
    alert('Weekly report generated! (AI-powered)');
  };

  const handleBudgetAlert = () => {
    // TODO: Integrate budget tracking logic
    alert(`Budget status: ₹${project.budget} (Planned)`);
  };

  const handleVendorReminder = () => {
    // TODO: Integrate messaging API for vendor reminders
    alert('Vendor reminder sent!');
  };

  const handlePhotoUpload = (e) => {
    // TODO: Integrate Firebase/Cloudinary upload
    alert('Photo uploaded!');
  };

  const handleAddProject = () => {
    // TODO: Admin panel logic to add project
    alert('Project added!');
  };

  const handleRemoveProject = () => {
    // TODO: Admin panel logic to remove project
    alert('Project removed!');
  };

  const handleAssignTask = () => {
    // TODO: Assign task to team (Trello/Notion API)
    alert('Task assigned!');
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center pt-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-400 drop-shadow-lg">🚀 Designor Studio PM</h1>
      <TopNav current={currentPage} setCurrent={setCurrentPage} />
      <div className="mt-8">
        {currentPage === 'onboarding' && (
          <ClientOnboarding project={project} handleChange={handleChange} />
        )}
        {currentPage === 'tasks' && (
          <TaskTracker newTask={newTask} handleTaskChange={handleTaskChange} addTask={addTask} handleAssignTask={handleAssignTask} tasks={tasks} />
        )}
        {currentPage === 'timeline' && (
          <TimelineTracker />
        )}
        {currentPage === 'budget' && (
          <BudgetDashboard project={project} handleBudgetAlert={handleBudgetAlert} />
        )}
        {currentPage === 'vendor' && (
          <VendorCommsHub project={project} handleChange={handleChange} handleVendorReminder={handleVendorReminder} />
        )}
        {currentPage === 'photos' && (
          <SitePhotoLogs project={project} handleChange={handleChange} handlePhotoUpload={handlePhotoUpload} />
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
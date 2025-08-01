import React, { useState } from 'react';

function TopNav({ current, setCurrent }) {
  const navItems = [
    { key: 'onboarding', label: 'Client Onboarding' },
    { key: 'tasks', label: 'Task Tracker' },
    { key: 'timeline', label: 'Timeline Tracker' },
    { key: 'budget', label: 'Budget Dashboard' },
    { key: 'vendor', label: 'Vendor Comms Hub' },
    { key: 'photos', label: 'Site Photo Logs' },
    { key: 'ai', label: 'AI Assistant' },
    { key: 'admin', label: 'Admin Panel' },
  ];
  return (
    <nav className="flex bg-gray-100 border-b mb-6">
      {navItems.map(item => (
        <button
          key={item.key}
          className={`px-4 py-3 font-semibold focus:outline-none ${current === item.key ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
          onClick={() => setCurrent(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function ClientOnboarding({ project, handleChange }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Client Onboarding</h2>
      <input className="border p-2 w-full mb-2" placeholder="Project Name" name="name" value={project.name} onChange={handleChange}/>
      <input className="border p-2 w-full mb-2" placeholder="Client Name" name="client" value={project.client} onChange={handleChange}/>
      <input className="border p-2 w-full mb-2" placeholder="Address" name="address" value={project.address || ''} onChange={handleChange}/>
      <input className="border p-2 w-full mb-2" placeholder="Scope" name="scope" value={project.scope || ''} onChange={handleChange}/>
      <input className="border p-2 w-full mb-2" placeholder="Budget (₹)" name="budget" value={project.budget} onChange={handleChange}/>
      <input className="border p-2 w-full mb-2" type="date" placeholder="Timeline" name="timeline" value={project.timeline || ''} onChange={handleChange}/>
      <input className="border p-2 w-full mb-2" placeholder="Preferences" name="preferences" value={project.preferences || ''} onChange={handleChange}/>
      <textarea className="border p-2 w-full mb-2" placeholder="Notes" name="notes" value={project.notes} onChange={handleChange}></textarea>
    </div>
  );
}

function TaskTracker({ newTask, handleTaskChange, addTask, handleAssignTask, tasks }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Task Tracker</h2>
      <input className="border p-2 w-full mb-2" placeholder="Task Title" name="title" value={newTask.title} onChange={handleTaskChange}/>
      <input className="border p-2 w-full mb-2" type="date" name="due" value={newTask.due} onChange={handleTaskChange}/>
      <select className="border p-2 w-full mb-2" name="status" value={newTask.status} onChange={handleTaskChange}>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addTask}>Add Task</button>
      <button className="bg-purple-500 text-white px-4 py-2 rounded ml-2" onClick={handleAssignTask}>Assign Task</button>
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
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Timeline Tracker (Gantt Chart)</h2>
      <p className="text-gray-600">Timeline visualization will be displayed here.</p>
    </div>
  );
}

function BudgetDashboard({ project, handleBudgetAlert }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">💰 Budget Dashboard</h2>
      <p>Planned Budget: ₹{project.budget}</p>
      <p>Actual Spend: ₹0 {/* TODO: Track actual spend */}</p>
      <button className="bg-yellow-500 text-white px-4 py-2 rounded mb-2" onClick={handleBudgetAlert}>Check Budget Status</button>
    </div>
  );
}

function VendorCommsHub({ project, handleChange, handleVendorReminder }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Vendor Comms Hub</h2>
      <input className="border p-2 w-full mb-2" placeholder="Vendor Name" name="vendor" value={project.vendor || ''} onChange={handleChange}/>
      <input className="border p-2 w-full mb-2" placeholder="Order Details" name="order" value={project.order || ''} onChange={handleChange}/>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={handleVendorReminder}>Send Reminder</button>
    </div>
  );
}

function SitePhotoLogs({ project, handleChange, handlePhotoUpload }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📷 Site Photo Logs</h2>
      <input className="border p-2 w-full mb-2" type="file" accept="image/*" onChange={handlePhotoUpload}/>
      <input className="border p-2 w-full mb-2" placeholder="Tag" name="photoTag" value={project.photoTag || ''} onChange={handleChange}/>
      <textarea className="border p-2 w-full mb-2" placeholder="Notes" name="photoNotes" value={project.photoNotes || ''} onChange={handleChange}></textarea>
    </div>
  );
}

function AIAssistant({ handleAutoReport, handleBudgetAlert, handleVendorReminder }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🤖 AI Assistant</h2>
      <button className="bg-green-500 text-white px-4 py-2 rounded mb-2" onClick={handleAutoReport}>Generate Weekly Report</button>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={handleAutoReport}>Generate Monthly Report</button>
      <button className="bg-yellow-500 text-white px-4 py-2 rounded mb-2" onClick={handleBudgetAlert}>Check Budget Status</button>
      <button className="bg-purple-500 text-white px-4 py-2 rounded mb-2" onClick={handleVendorReminder}>Send Vendor Reminder</button>
    </div>
  );
}

function AdminPanel({ handleAddProject, handleRemoveProject }) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🔒 Admin Panel</h2>
      <button className="bg-green-700 text-white px-4 py-2 rounded mb-2" onClick={handleAddProject}>Add Project</button>
      <button className="bg-red-700 text-white px-4 py-2 rounded mb-2" onClick={handleRemoveProject}>Remove Project</button>
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
    <div className="font-sans min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center pt-6">🚀 Designor Studio PM is Live!</h1>
      <TopNav current={currentPage} setCurrent={setCurrentPage} />
      <div className="mt-6">
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
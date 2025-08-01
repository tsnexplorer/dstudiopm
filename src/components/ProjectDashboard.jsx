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
  const required = (val) => !val ? "Required" : "";
  return (
    <form className="card-pro max-w-2xl mx-auto">
      <h2 className="heading-pro mb-8"><span>👤</span>Client Onboarding</h2>
      {/* Project Details Section */}
      <div className="mb-6 pb-6 border-b border-blue-200">
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1" htmlFor="name">Project Name <span className="text-red-500">*</span></label>
          <div className="relative">
            <input id="name" name="name" className="input-pro pl-10" value={project.name} onChange={handleChange} required />
            <span className="absolute left-3 top-3 text-blue-400">🏷️</span>
          </div>
          <span className="text-xs text-red-500">{required(project.name)}</span>
        </div>
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1" htmlFor="client">Client Name <span className="text-red-500">*</span></label>
          <div className="relative">
            <input id="client" name="client" className="input-pro pl-10" value={project.client} onChange={handleChange} required />
            <span className="absolute left-3 top-3 text-blue-400">🧑</span>
          </div>
          <span className="text-xs text-red-500">{required(project.client)}</span>
        </div>
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1" htmlFor="address">Address</label>
          <div className="relative">
            <input id="address" name="address" className="input-pro pl-10" value={project.address || ''} onChange={handleChange} />
            <span className="absolute left-3 top-3 text-blue-400">📍</span>
          </div>
          <span className="text-xs text-gray-400">Full site address</span>
        </div>
      </div>
      {/* Project Scope Section */}
      <div className="mb-6 pb-6 border-b border-blue-200">
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1" htmlFor="scope">Scope</label>
          <div className="relative">
            <input id="scope" name="scope" className="input-pro pl-10" value={project.scope || ''} onChange={handleChange} />
            <span className="absolute left-3 top-3 text-blue-400">📦</span>
          </div>
          <span className="text-xs text-gray-400">E.g. Renovation, New Build, etc.</span>
        </div>
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1" htmlFor="budget">Budget (₹)</label>
          <div className="relative">
            <input id="budget" name="budget" className="input-pro pl-10" value={project.budget} onChange={handleChange} />
            <span className="absolute left-3 top-3 text-blue-400">💰</span>
          </div>
          <span className="text-xs text-gray-400">Estimated total budget</span>
        </div>
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1" htmlFor="timeline">Timeline</label>
          <div className="relative">
            <input id="timeline" name="timeline" type="date" className="input-pro pl-10" value={project.timeline || ''} onChange={handleChange} />
            <span className="absolute left-3 top-3 text-blue-400">📅</span>
          </div>
          <span className="text-xs text-gray-400">Expected completion date</span>
        </div>
      </div>
      {/* Preferences & Notes Section */}
      <div className="mb-6">
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1" htmlFor="preferences">Preferences</label>
          <div className="relative">
            <input id="preferences" name="preferences" className="input-pro pl-10" value={project.preferences || ''} onChange={handleChange} />
            <span className="absolute left-3 top-3 text-blue-400">🎨</span>
          </div>
          <span className="text-xs text-gray-400">Design, style, color, etc.</span>
        </div>
        <div className="mb-4">
          <label className="block text-blue-700 font-medium mb-1" htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" className="input-pro pl-10" value={project.notes} onChange={handleChange}></textarea>
          <span className="text-xs text-gray-400">Any additional info</span>
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex justify-end mt-8">
        <button type="submit" className="btn-rounded flex items-center gap-2">
          <span>💾</span> Save
        </button>
      </div>
    </form>
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
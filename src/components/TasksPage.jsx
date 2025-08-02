import { Gantt } from 'gantt-task-react';
import './gantt-compact.css';
import 'gantt-task-react/dist/index.css';
import React, { useState } from 'react';
import { useEffect } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTasks, addTask, updateTask, deleteTask } from './tasksApi';

export default function TasksPage({ projects, tasks, onAddTask, onUpdateTask, onDeleteTask }) {
  // Toggle for Gantt chart
  const [showGantt, setShowGantt] = useState(false);
  // Only allow selection of projects that are not closed (not Completed or Archived)
  const openProjects = projects.filter(p => p.state !== 'Completed' && p.state !== 'Archived');
  const [selectedProjectId, setSelectedProjectId] = useState(openProjects.length ? openProjects[0].id : '');
  // Firestore tasks hook
  const tasksData = useTasks(selectedProjectId);
  // Prepare Gantt chart data
  const [ganttTasks, setGanttTasks] = useState([]);
  useEffect(() => {
    // Sort tasks by end date (dueDate)
    const sortedTasks = [...tasksData]
      .filter(task => task && typeof task === 'object')
      .sort((a, b) => {
        const aEnd = a.dueDate && !isNaN(new Date(a.dueDate).getTime()) ? new Date(a.dueDate).getTime() : 0;
        const bEnd = b.dueDate && !isNaN(new Date(b.dueDate).getTime()) ? new Date(b.dueDate).getTime() : 0;
        return aEnd - bEnd;
      });

    const ganttArr = [];
    for (let i = 0; i < sortedTasks.length; i++) {
      const task = sortedTasks[i];
      let endDate = task.dueDate && !isNaN(new Date(task.dueDate).getTime()) ? new Date(task.dueDate) : new Date();
      let startDate;
      if (i === 0) {
        startDate = endDate;
      } else {
        startDate = ganttArr[i - 1].end;
      }
      // Defensive: if startDate or endDate is invalid, fallback to today/tomorrow
      if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
        startDate = new Date();
      }
      if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);
      }
      ganttArr.push({
        id: task.id,
        name: task.name || 'Unnamed',
        start: startDate,
        end: endDate,
        type: 'task',
        progress: task.status === 'Completed' ? 100 : task.status === 'In Progress' ? 50 : 0,
        isDisabled: false,
        styles: {
          progressColor: 'var(--gantt-bar-green)',
          progressSelectedColor: 'var(--gantt-bar-selected)',
          barBackgroundColor: 'var(--gantt-bar-bg)',
          barBorderColor: 'var(--gantt-bar-border)',
          backgroundColor: 'var(--gantt-bar-bg-light)',
          textColor: 'var(--gantt-bar-text)'
        }
      });
    }
    setGanttTasks(ganttArr);
  }, [tasksData]);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [lastTasksSnapshot, setLastTasksSnapshot] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    projectId: openProjects.length ? openProjects[0].id : ''
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  // For copy/paste
  const [clipboard, setClipboard] = useState(null);
  // Track changes for Save button
  React.useEffect(() => {
    setLastTasksSnapshot(tasksData.map(task => ({ ...task })));
    setSaveStatus('Saved');
  }, [selectedProjectId]);

  const isChanged = () => {
    if (lastTasksSnapshot.length !== tasksData.length) return true;
    for (let i = 0; i < tasksData.length; i++) {
      const t1 = tasksData[i];
      const t2 = lastTasksSnapshot[i];
      if (!t2 || t1.id !== t2.id || JSON.stringify(t1) !== JSON.stringify(t2)) return true;
    }
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (e) => {
    setSelectedProjectId(e.target.value);
    setForm(prev => ({ ...prev, projectId: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskToAdd = { ...form, projectId: selectedProjectId };
    if (!taskToAdd.projectId) {
      alert('Please select a project before adding a task.');
      return;
    }
    if (editingId) {
      await updateTask(editingId, taskToAdd);
    } else {
      await addTask(taskToAdd);
    }
    setForm({ name: '', description: '', dueDate: '', status: 'Pending', projectId: selectedProjectId });
    setEditingId(null);
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setForm({ ...task });
    setSelectedProjectId(task.projectId);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setSelectedRows(selectedRows.filter(rowId => rowId !== id));
  };

  // Multiselect row toggle
  const handleRowSelect = (id) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
  };

  // Copy selected rows
  const handleCopy = () => {
    const selectedTasks = tasksData.filter(task => selectedRows.includes(task.id));
    setClipboard(JSON.stringify(selectedTasks));
  };

  // Paste copied rows
  const handlePaste = async () => {
    if (!clipboard) return;
    try {
      const tasksToPaste = JSON.parse(clipboard);
      for (const t of tasksToPaste) {
        const { id, ...rest } = t;
        await addTask(rest);
      }
      setClipboard(null);
      setSelectedRows([]);
    } catch (e) {
      alert('Paste failed. Invalid clipboard data.');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Tasks</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Project</InputLabel>
        <Select value={selectedProjectId} label="Project" onChange={handleProjectChange} required>
          {openProjects.map(project => (
            <MenuItem key={project.id} value={project.id}>
              {project.address} ({project.state})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Toolbar for copy/paste above table header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Button
          variant={showGantt ? "outlined" : "contained"}
          color="primary"
          size="small"
          sx={{ mr: 1, bgcolor: showGantt ? undefined : '#e3f2fd', color: '#1565c0' }}
          onClick={() => setShowGantt(v => !v)}
        >
          {showGantt ? 'Hide Gantt' : 'Show Gantt'}
        </Button>
        <Button
          variant="contained"
          color="success"
          size="small"
          sx={{ mr: 1, bgcolor: '#c8e6c9', color: '#256029' }}
          disabled={!isChanged() || saveStatus === 'Saving'}
          onClick={async () => {
            setSaveStatus('Saving');
            for (const task of tasksData) {
              const { id, ...rest } = task;
              await updateTask(id, rest);
            }
            setLastTasksSnapshot(tasksData.map(task => ({ ...task })));
            setSaveStatus('Saved');
          }}
        >
          Save
        </Button>
        <span style={{ marginRight: 16, color: saveStatus === 'Saved' ? '#388e3c' : '#fbc02d', fontWeight: 500, fontSize: 14 }}>
          {saveStatus === 'Saved' ? 'Saved' : saveStatus === 'Saving' ? 'Saving...' : 'Unsaved changes'}
        </span>
        <Button
          variant="outlined"
          size="small"
          sx={{ mr: 1, color: '#1565c0', borderColor: '#1565c0', bgcolor: '#e3f2fd' }}
          onClick={() => {
            if (selectedRows.length === tasksData.length) {
              setSelectedRows([]);
            } else {
              setSelectedRows(tasksData.map(task => task.id));
            }
          }}
        >
          {selectedRows.length === tasksData.length ? 'Unselect All' : 'Select All'}
        </Button>
        <IconButton onClick={handleCopy} disabled={selectedRows.length === 0} sx={{ color: '#1565c0', bgcolor: '#e3f2fd', mr: 1 }}>
          <ContentCopyIcon />
        </IconButton>
        <IconButton onClick={handlePaste} disabled={!clipboard} sx={{ color: '#1565c0', bgcolor: '#e3f2fd' }}>
          <ContentPasteIcon />
        </IconButton>
        <span style={{ marginLeft: 12, color: '#888', fontSize: 14 }}>
          {selectedRows.length > 0 ? `${selectedRows.length} selected` : 'Select rows to copy'}
        </span>
      </div>
      <TableContainer component={Paper} style={{ minHeight: 400 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Task Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasksData.map(task => (
              <TableRow key={task.id} selected={selectedRows.includes(task.id)}>
                <TableCell padding="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(task.id)}
                    onChange={() => handleRowSelect(task.id)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={task.name}
                    onChange={e => updateTask(task.id, { ...task, name: e.target.value })}
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={task.description}
                    onChange={e => updateTask(task.id, { ...task, description: e.target.value })}
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={task.dueDate}
                    onChange={e => updateTask(task.id, { ...task, dueDate: e.target.value })}
                    type="date"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={task.status}
                      onChange={e => updateTask(task.id, { ...task, status: e.target.value })}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(task.id)} color="error"><DeleteIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(task.id)} color="error" size="small" sx={{ ml: 1 }}>-</IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* Quick-add row for multiple tasks */}
            <TableRow>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSubmit}
                  disabled={!form.name}
                >
                  +
                </Button>
              </TableCell>
              <TableCell>
                <TextField
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Task Name"
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </TableCell>
              <TableCell>
                <FormControl fullWidth size="small">
                  <Select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSubmit}
                  disabled={!form.name}
                >
                  Add
                </Button>
                {editingId && (
                  <Button variant="text" color="secondary" size="small" sx={{ ml: 1 }} onClick={() => { setEditingId(null); setForm({ name: '', description: '', dueDate: '', status: 'Pending', projectId: selectedProjectId }); }}>
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* Gantt chart below the table */}
      {showGantt && (
        <div style={{ width: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Project Timeline</Typography>
          <Paper elevation={2} sx={{ p: 2, minHeight: 400, backgroundColor: 'var(--gantt-bar-bg-light)' }}>
            <Gantt
              tasks={Array.isArray(ganttTasks) ? ganttTasks.map(task => ({
                ...task,
                styles: {
                  ...task.styles,
                  backgroundColor: 'var(--gantt-row-bg-light)',
                  barBackgroundColor: 'var(--gantt-row-bg-light)',
                  textColor: 'var(--gantt-bar-text)',
                  rowBackgroundColor: 'var(--gantt-row-bg-light)',
                  progressColor: 'var(--gantt-bar-green)',
                  columnBackgroundColor: 'var(--gantt-bar-bg-light)',
                  progressSelectedColor: 'var(--gantt-bar-selected)',
                }
              })) : []}
              viewMode="Day"
              locale="en-GB"
              columnWidth={100}
              listCellWidth={150}
              dateColumnFormat={(date) => date.toLocaleDateString('en-US', { day: 'numeric' })}
            />
          </Paper>
        </div>
      )}
    </div>
  );
}
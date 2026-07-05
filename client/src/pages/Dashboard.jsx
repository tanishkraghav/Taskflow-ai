import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from '../components/Column';
import TaskModal from '../components/TaskModal';
import API from '../api';
import { Plus, ListTodo, Award, Percent, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completedToday: 0,
    completionRate: 0,
    columns: { urgent: 0, important: 0, low: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchData = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/stats'),
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Drop outside any column
    if (!destination) return;

    // Drop in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 1. Optimistic Local State Update
    const taskToMove = tasks.find((t) => t._id === draggableId);
    if (!taskToMove) return;

    // Create a new task object with updated priority
    const updatedTask = { ...taskToMove, priority: destination.droppableId };

    // Get all other tasks
    const remainingTasks = tasks.filter((t) => t._id !== draggableId);

    // Segment tasks by priority columns
    const otherPriorityTasks = remainingTasks.filter((t) => t.priority !== destination.droppableId);
    const targetPriorityTasks = remainingTasks.filter((t) => t.priority === destination.droppableId);

    // Insert task at specific index in target column list
    targetPriorityTasks.splice(destination.index, 0, updatedTask);

    // Recombine all segments
    const finalTasks = [...otherPriorityTasks, ...targetPriorityTasks];
    setTasks(finalTasks);

    // 2. Backend Persistence call
    try {
      await API.patch(`/tasks/${draggableId}/priority`, {
        priority: destination.droppableId,
      });
      // Fetch fresh stats to update cards
      const statsRes = await API.get('/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to persist drag drop priority update', err);
      // Revert if error
      fetchData();
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        // Edit Task
        const { data } = await API.put(`/tasks/${taskToEdit._id}`, taskData);
        setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      } else {
        // Create Task (AI-prioritized)
        const { data } = await API.post('/tasks', taskData);
        setTasks((prev) => [data, ...prev]);
      }
      // Refresh stats
      const statsRes = await API.get('/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error saving task', err);
      throw err;
    }
  };

  const handleTaskUpdated = async (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    try {
      const statsRes = await API.get('/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error refreshing stats', err);
    }
  };

  const handleTaskDeleted = async (deletedId) => {
    setTasks((prev) => prev.filter((t) => t._id !== deletedId));
    try {
      const statsRes = await API.get('/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error refreshing stats', err);
    }
  };

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Filter tasks into columns
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent');
  const importantTasks = tasks.filter((t) => t.priority === 'important');
  const lowTasks = tasks.filter((t) => t.priority === 'low');

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Loading your board...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-white flex items-center gap-2">
            Task Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tasks are auto-classified by AI. Drag and drop to override.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="glass-button-primary py-2.5 px-5 flex items-center space-x-2 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>New Smart Task</span>
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tasks Card */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Tasks</span>
            <div className="font-display font-extrabold text-3xl text-white">{stats.totalTasks}</div>
          </div>
          <div className="bg-indigo-600/15 text-indigo-400 p-3.5 rounded-xl border border-indigo-500/10">
            <ListTodo className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Today Card */}
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Completed Today</span>
            <div className="font-display font-extrabold text-3xl text-emerald-400">{stats.completedToday}</div>
          </div>
          <div className="bg-emerald-600/15 text-emerald-400 p-3.5 rounded-xl border border-emerald-500/10">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300 gap-4">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Completion Rate</span>
              <div className="font-display font-extrabold text-3xl text-violet-400">{stats.completionRate}%</div>
            </div>
            <div className="bg-violet-600/15 text-violet-400 p-3.5 rounded-xl border border-violet-500/10">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          {/* Visual progress bar */}
          <div className="w-full bg-slate-950/60 rounded-full h-1.5 border border-slate-900">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Drag-and-Drop Columns Section */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Column
            id="urgent"
            title="Urgent"
            tasks={urgentTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            onEditClick={handleOpenEditModal}
          />
          <Column
            id="important"
            title="Important"
            tasks={importantTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            onEditClick={handleOpenEditModal}
          />
          <Column
            id="low"
            title="Low Priority"
            tasks={lowTasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            onEditClick={handleOpenEditModal}
          />
        </div>
      </DragDropContext>

      {/* Form Dialog Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;

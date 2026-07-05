import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Trash2, Edit3, Sparkles, CheckCircle, Circle, RefreshCw } from 'lucide-react';
import API from '../api';

const TaskCard = ({ task, index, onTaskUpdated, onTaskDeleted, onEditClick }) => {
  const [isReprioritizing, setIsReprioritizing] = useState(false);

  const handleToggleComplete = async (e) => {
    e.stopPropagation();
    try {
      const { data } = await API.patch(`/tasks/${task._id}/complete`);
      onTaskUpdated(data);
    } catch (err) {
      console.error('Error completing task', err);
    }
  };

  const handleReprioritize = async (e) => {
    e.stopPropagation();
    setIsReprioritizing(true);
    try {
      const { data } = await API.post(`/tasks/${task._id}/reprioritize`);
      onTaskUpdated(data);
    } catch (err) {
      console.error('Error reprioritizing task', err);
    } finally {
      setIsReprioritizing(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${task._id}`);
        onTaskDeleted(task._id);
      } catch (err) {
        console.error('Error deleting task', err);
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
          }}
          className={`glass-card p-4 mb-3.5 rounded-xl transition-all duration-300 relative group flex flex-col justify-between ${
            snapshot.isDragging ? 'shadow-2xl border-indigo-500 bg-slate-900/90 scale-[1.02]' : 'hover:shadow-lg'
          } ${task.completed ? 'opacity-65' : ''}`}
        >
          <div className="flex items-start justify-between gap-3">
            <button
              onClick={handleToggleComplete}
              className="mt-0.5 text-slate-500 hover:text-indigo-400 focus:outline-none transition-colors"
            >
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h4
                className={`font-semibold text-slate-100 text-sm tracking-wide truncate ${
                  task.completed ? 'line-through text-slate-400 font-normal' : ''
                }`}
              >
                {task.title}
              </h4>
              {task.description && (
                <p
                  className={`text-xs text-slate-400 mt-1 line-clamp-2 ${
                    task.completed ? 'line-through text-slate-500' : ''
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-slate-500">
            {task.dueDate ? (
              <span className="flex items-center text-[10px] text-slate-400 font-medium space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(task.dueDate)}</span>
              </span>
            ) : (
              <span />
            )}

            <div className="flex items-center space-x-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleReprioritize}
                disabled={isReprioritizing}
                title="AI Re-prioritize"
                className="p-1.5 hover:text-indigo-400 hover:bg-slate-800/80 rounded-md transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReprioritizing ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
              <button
                onClick={() => onEditClick(task)}
                title="Edit Task"
                className="p-1.5 hover:text-amber-400 hover:bg-slate-800/80 rounded-md transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                title="Delete Task"
                className="p-1.5 hover:text-rose-500 hover:bg-slate-800/80 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;

import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('important');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority || 'important');
      if (taskToEdit.dueDate) {
        setDueDate(new Date(taskToEdit.dueDate).toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('important');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      priority,
    };

    try {
      await onSave(taskData);
      onClose();
    } catch (err) {
      console.error('Failed to save task', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel-heavy w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800 animate-scale-up">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg tracking-wide text-white">
            {taskToEdit ? 'Edit Task' : 'Create Smart Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:text-rose-400 hover:bg-slate-800/80 text-slate-400 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="title" className="text-xs font-semibold text-slate-400">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              placeholder="e.g. Finish building TaskFlow AI API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input text-sm"
              autoFocus
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="description" className="text-xs font-semibold text-slate-400">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Add details about this task. AI uses this to calculate priority..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-input text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="dueDate" className="text-xs font-semibold text-slate-400">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="glass-input text-sm text-slate-300"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="priority" className="text-xs font-semibold text-slate-400">
                Priority
              </label>
              {taskToEdit ? (
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="glass-input text-sm text-slate-300 bg-slate-900 focus:bg-slate-950"
                >
                  <option value="urgent">Urgent</option>
                  <option value="important">Important</option>
                  <option value="low">Low</option>
                </select>
              ) : (
                <div className="glass-input text-xs text-indigo-400 font-medium flex items-center justify-center space-x-2 border-indigo-500/20 bg-indigo-500/5 h-[38px]">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                  <span>AI Classified</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="glass-button-secondary py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="glass-button-primary py-2 text-sm flex items-center justify-center space-x-1.5 min-w-[100px]"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  {!taskToEdit && <Sparkles className="w-3.5 h-3.5" />}
                  <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const Column = ({ id, title, tasks, onTaskUpdated, onTaskDeleted, onEditClick }) => {
  
  // Style configurations for columns
  const getColumnStyles = () => {
    switch (id) {
      case 'urgent':
        return {
          border: 'border-t-rose-500',
          dot: 'bg-rose-500 shadow-rose-500/50',
          badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
          titleColor: 'text-rose-400',
        };
      case 'important':
        return {
          border: 'border-t-amber-500',
          dot: 'bg-amber-500 shadow-amber-500/50',
          badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
          titleColor: 'text-amber-400',
        };
      case 'low':
      default:
        return {
          border: 'border-t-slate-500',
          dot: 'bg-slate-400 shadow-slate-400/50',
          badge: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
          titleColor: 'text-slate-400',
        };
    }
  };

  const styles = getColumnStyles();

  return (
    <div className={`glass-panel rounded-2xl flex flex-col h-[70vh] border-t-4 ${styles.border} transition-all duration-300`}>
      {/* Column Header */}
      <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${styles.dot} shadow-sm animate-pulse`} />
          <h3 className={`font-display font-bold tracking-wider text-sm ${styles.titleColor}`}>
            {title}
          </h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${styles.badge}`}>
          {tasks.length}
        </span>
      </div>

      {/* Task List Drop Zone */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-4 overflow-y-auto transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-slate-900/20' : ''
            }`}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  onTaskUpdated={onTaskUpdated}
                  onTaskDeleted={onTaskDeleted}
                  onEditClick={onEditClick}
                />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-900 rounded-xl">
                <p className="text-xs text-slate-500 font-medium">No tasks here</p>
                <p className="text-[10px] text-slate-600 mt-1">Drag tasks or create new ones</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;

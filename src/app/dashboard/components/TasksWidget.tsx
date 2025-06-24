"use client";

import { TasksWidget as TasksWidgetType } from "@/hooks/useDashboardData";

interface TasksWidgetProps {
  widget: TasksWidgetType;
}

export default function TasksWidget({ widget }: TasksWidgetProps) {
  if (!widget || !widget.tasks || widget.tasks.length === 0) {
    return null;
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">{widget.title || "Tasks"}</h3>
      </div>
      <div className="px-4 pb-4">
        <ul className="divide-y divide-gray-200">
          {widget.tasks.map((task) => (
            <li key={task.id} className="py-3">
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={task.completed}
                      readOnly
                    />
                    <p 
                      className={`ml-3 text-sm font-medium ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </p>
                  </div>
                  
                  {/* Display description if available (may not be in backend schema) */}
                  {task.description && (
                    <p className="ml-7 mt-1 text-xs text-gray-500 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="ml-7 mt-1 flex items-center space-x-2 text-xs text-gray-500">
                    {task.dueDate && (
                      <span className="flex items-center">
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {/* Display assignee if available (may be specified as assignedTo in schema) */}
                    {(task.assignee || task.assignedTo) && (
                      <span className="flex items-center">
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        {task.assignee || task.assignedTo}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="ml-3 flex-shrink-0">
                  {task.priority && getPriorityBadge(task.priority)}
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {widget.tasks.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

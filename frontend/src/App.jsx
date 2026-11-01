import { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, Circle, Search, Plus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask) return;

    try {
      await fetch(`${API_URL}/add-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: newTask })
      });
      setNewTask(""); 
      fetchTasks(); 
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/delete-task/${id}`, {
        method: 'DELETE'
      });
      fetchTasks(); 
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  // Filter tasks based on the search input
  const filteredTasks = tasks.filter(task => 
    (task.name || task).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4">
      {/* Main Dashboard Card */}
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 border-b border-slate-800 bg-slate-900/50">
          <h1 className="text-3xl font-bold text-white tracking-tight">Task Dashboard</h1>
          <p className="text-slate-400 mt-2">Manage your daily workflow efficiently.</p>
        </div>

        <div className="p-8">
          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="flex gap-3 mb-6">
            <input 
              type="text" 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)} 
              placeholder="Add a new task..."
              className="flex-1 bg-slate-950 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus size={18} /> Add Task
            </button>
          </form>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <CheckCircle2 size={40} className="mx-auto mb-3 opacity-50" />
                <p>No tasks found. You're all caught up!</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div 
                  key={task._id} 
                  className="group flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Circle size={20} className="text-slate-600 group-hover:text-blue-500 transition-colors cursor-pointer" />
                    <div>
                      <p className="text-slate-200 font-medium">{task.name ? task.name : task}</p>
                      {/* Show date if it exists in the database */}
                      {task.createdAt && (
                        <p className="text-xs text-slate-500 mt-1">
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Delete Button (Only shows on hover) */}
                  <button 
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-slate-600 hover:text-red-500 transition-colors p-2 cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
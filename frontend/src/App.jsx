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

  // NEW: Handle clicking the circle
  const handleToggleComplete = async (id) => {
    try {
      await fetch(`${API_URL}/update-task/${id}`, {
        method: 'PUT'
      });
      fetchTasks(); // Refresh the list to show the new status
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => 
    (task.name || task).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Pure black background with the animated stars
    <div className="min-h-screen bg-black bg-stars text-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Whimsical glowing background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>

      {/* Main Dashboard Card */}
      <div className="w-full max-w-2xl bg-black/60 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden relative z-10">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-700/50 bg-black/40">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            Task Dashboard ✨
          </h1>
          <p className="text-slate-400 mt-2">Manage your daily workflow under the stars.</p>
        </div>

        <div className="p-8">
          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="flex gap-3 mb-6">
            <input 
              type="text" 
              value={newTask} 
              onChange={(e) => setNewTask(e.target.value)} 
              placeholder="Add a new task..."
              className="flex-1 bg-slate-900/50 text-white border border-slate-600/50 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm placeholder-slate-500"
            />
            <button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center gap-2 text-sm cursor-pointer shadow-[0_0_15px_rgba(147,51,234,0.5)]"
            >
              <Plus size={18} /> Add
            </button>
          </form>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search the stars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 text-white border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-purple-400 text-sm placeholder-slate-500"
            />
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <CheckCircle2 size={40} className="mx-auto mb-3 opacity-50 text-purple-400" />
                <p>The sky is clear. No tasks found!</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div 
                  key={task._id} 
                  className="group flex items-center justify-between p-4 bg-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-purple-500/50 hover:bg-slate-800/60 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-center gap-4">
                    
                    {/* Clickable Circle/Checkmark */}
                    <button onClick={() => handleToggleComplete(task._id)} className="cursor-pointer">
                      {task.isCompleted ? (
                        <CheckCircle2 size={20} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                      ) : (
                        <Circle size={20} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                      )}
                    </button>
                    
                    <div>
                      {/* Strikethrough if completed */}
                      <p className={`font-medium ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.name ? task.name : task}
                      </p>
                      
                      {/* Date */}
                      {task.createdAt && (
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-slate-600 hover:text-red-400 transition-colors p-2 cursor-pointer opacity-0 group-hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]"
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
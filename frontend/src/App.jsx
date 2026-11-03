import { useState, useEffect } from 'react';
import { Trash2, CheckCircle2, Circle, Search } from 'lucide-react';

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
      await fetch(`${API_URL}/delete-task/${id}`, { method: 'DELETE' });
      fetchTasks(); 
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await fetch(`${API_URL}/update-task/${id}`, { method: 'PUT' });
      fetchTasks(); 
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => 
    (task.name || task).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // The main container centers the max-w-xl column, but leaves text inside left-aligned
    <div 
      className="min-h-screen bg-black bg-stars text-white flex flex-col items-center py-20 px-4 relative"
      style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif' }}
    >
      
      <div className="w-full max-w-xl relative z-10">
        
        {/* The title is the ONLY thing forced to the exact center */}
        <h1 className="text-5xl font-bold mb-12 text-center tracking-widest text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] w-full block">
          TO DO LIST
        </h1>

        {/* Input Area - Back to normal side-by-side layout */}
        <form onSubmit={handleAddTask} className="flex gap-2 mb-8 border-b-2 border-gray-700 pb-4">
          <input 
            type="text" 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)} 
            placeholder="Add a new task..."
            className="flex-1 bg-transparent text-white text-xl px-2 py-2 focus:outline-none placeholder-gray-600"
            style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif' }}
          />
          <button 
            type="submit" 
            className="text-white font-bold px-4 py-2 hover:text-purple-400 transition-colors cursor-pointer text-xl"
          >
            Add
          </button>
        </form>

        {/* Search Bar - Normal layout */}
        <div className="mb-8">
          <input 
            type="text" 
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-gray-400 text-lg px-2 py-1 border-b border-gray-800 focus:outline-none focus:border-gray-500 placeholder-gray-700"
            style={{ fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif' }}
          />
        </div>

        {/* Task List - Normal layout */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <p className="text-gray-600 text-center text-lg italic mt-10">No tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task._id} 
                className="group flex items-center justify-between border-b border-gray-800 pb-3 pt-2"
              >
                <div className="flex items-center gap-4">
                  
                  {/* Clickable Circle/Checkmark */}
                  <button onClick={() => handleToggleComplete(task._id)} className="cursor-pointer text-gray-500 hover:text-white transition-colors">
                    {task.isCompleted ? (
                      <CheckCircle2 size={20} className="text-purple-400" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>
                  
                  <div>
                    <p className={`text-xl transition-all duration-300 ${task.isCompleted ? 'line-through text-gray-600 italic' : 'text-gray-200'}`}>
                      {task.name ? task.name : task}
                    </p>
                  </div>
                </div>
                
                {/* Delete Button */}
                <button 
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-transparent group-hover:text-gray-500 hover:!text-red-500 transition-colors p-2 cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
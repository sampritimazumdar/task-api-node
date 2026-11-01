import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000');
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
      await fetch('http://localhost:3000/add-task', {
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
      await fetch(`http://localhost:3000/delete-task/${id}`, {
        method: 'DELETE'
      });
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12 px-4">
      
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          My Tasks
        </h1>

        <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
          <input 
            type="text" 
            value={newTask} 
            onChange={(e) => setNewTask(e.target.value)} 
            placeholder="What needs to be done?"
            className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Add
          </button>
        </form>

        <div className="flex flex-col gap-3">
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-center mt-4">No tasks yet. Add one above!</p>
          ) : (
                        tasks.map((task, index) => (
              <div 
                key={task._id || index} 
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-sm flex items-center justify-between hover:border-gray-500 transition-colors"
              >
                <span className="text-lg">{task.name ? task.name : task}</span>
                <button 
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-400 hover:text-red-300 font-bold ml-4 cursor-pointer"
                >
                  Delete
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
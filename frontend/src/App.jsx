

import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import axios from "axios";

function App() {

  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");


  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);


  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };


  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

 
  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (error) {
      console.log("Error toggling todo:", error);
    }
  };


  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8">
 
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        To-Do App
        </h1>

        <form
          onSubmit={addTodo}
          className="flex items-center gap-3 border border-gray-200 p-3 rounded-xl shadow-sm"
        >
          <input
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new task..."
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
          >
            Add
          </button>
        </form>

  
        <div className="mt-6 space-y-4">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">
              No tasks yet. Add one to get started 
            </p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className={`flex justify-between items-center border border-gray-200 p-4 rounded-xl shadow-sm ${
                  todo.completed ? "bg-gray-100" : "bg-gray-50"
                }`}
              >
                {editingTodo === todo._id ? (
                  // Edit Mode
                  <div className="flex w-full items-center gap-3">
                    <input
                      className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MdOutlineDone size={18} />
                    </button>
                    <button
                      onClick={() => setEditingTodo(null)}
                      className="p-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white"
                    >
                      <IoClose size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => toggleTodo(todo._id)}
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 ${
                          todo.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-400 hover:border-blue-500"
                        }`}
                      >
                        {todo.completed && <MdOutlineDone size={16} />}
                      </div>
                      <span
                        className={`text-lg font-medium ${
                          todo.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>

                 
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(todo)}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50"
                      >
                        <MdModeEditOutline size={18} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

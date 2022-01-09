import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom' // get router
import Header from './components/Header'
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
import About from './components/About';

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>

function App() {
  const[showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([
    
])
  // get effect, connect with backend
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch data
  const fetchTasks = async() => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

// Add Task
const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    // get the JavaScript Object to the Json String and pass to backend
    body: JSON.stringify(task)
  })
  // get the return json value
  const data = await res.json()
  setTasks([...tasks, data])

  //const id = Math.floor(Math.random() * 10000) + 1
  //const newTask = { id, ...task }
  //setTasks([...tasks, newTask])
}


// Delete Task
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE',
  })

  setTasks(tasks.filter((task) => task.id !== id))
}

//Taggle Reminder
const toggleReminder = (id) => {
  setTasks(tasks.map((task) => task.id === id ? {...task, reminder:!task.reminder} : task))
}

  return (
    <Router>
      <div className="container">
        <Header title='CBR' onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
        
        <Routes>
          <Route path='/' exact element={
            <>
              {showAddTask ? <AddTask onAdd={addTask}/> : ''}
              {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : 'No Tasks To Show'
           } 
           </>
          }/>
          <Route path='/about' element={<><About /></>} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;

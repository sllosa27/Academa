import { useState } from 'react'
import './App.css'
function App() {
  const [showForm, setShowForm] = useState(false)
  const [assignmentName, setAssignmentName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('Low Priority')
  const [assignments, setAssignments] = useState(JSON.parse(localStorage.getItem('assignments')) || [])
  const [error, setError] = useState('')
  const [studySessions, setStudySessions] = useState([])
  const saveAssignment = () => {
    if (!assignmentName || !dueDate) {
      setError('Please enter an assignment name and due date.')
  return
}
  setError('')
    const newAssignment = { assignmentName, dueDate, priority }
    setAssignments([...assignments, newAssignment])
    localStorage.setItem('assignments', JSON.stringify([...assignments, newAssignment]))
    setAssignmentName('')
    setDueDate('')
    setPriority('Low Priority')
    
}

const completeAssignment = (index) => {
  const updatedAssignments = [...assignments]
  updatedAssignments[index].completed = true
  setAssignments(updatedAssignments)
  localStorage.setItem('assignments', JSON.stringify(updatedAssignments))
  }
const deleteAssignment = (index) => {
  const updatedAssignments = assignments.filter((_, i) => i !== index)
  setAssignments(updatedAssignments)
  localStorage.setItem('assignments', JSON.stringify(updatedAssignments))
  }
const generateStudySessions = () => {
  const sessions = assignments.flatMap((assignment) => {
    return [3, 2, 1].map((daysBefore, sessionIndex) => {
      const studyDate = new Date(`${assignment.dueDate}T12:00:00`)
        studyDate.setDate(studyDate.getDate() - daysBefore)
        return {
        sessionNumber: sessionIndex + 1,
          name: assignment.assignmentName,
        date: studyDate.toISOString().split('T')[0],
        priority: assignment.priority,
        }
        })
    
    
    
})
  setStudySessions(sessions)
}
  return (
    <div>
      <h1>Academa</h1>
      <p>Turn assignments into manageable study sessions.</p>

      <button onClick={() => setShowForm(true)}>
        Add Assignment
      </button>

      {showForm && (
        <div className="assignment-form">
          <h2>New Assignment</h2>
          {error && <p>{error}</p>}

          <input type="text" placeholder= "Assignment name" value={assignmentName} onChange={(e) => setAssignmentName(e.target.value)} />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low Priority</option>
            <option>Medium Priority</option>
            <option>High Priority</option>
          </select>

          <button onClick={saveAssignment}>Save Assignment</button>
        </div>
      )}
      <h2>My Assignments</h2>
      <button onClick={generateStudySessions}>Generate Study Sessions</button>
      {assignments.map((assignment, index) => (
        <div key={index} className="assignment-card">
          <h3>{assignment.assignmentName}</h3>
          <p>Due: {assignment.dueDate}</p>
          <p>Priority: {assignment.priority}</p>
          {assignment.completed && <p>✅ Completed</p>}
          <button onClick={() => completeAssignment(index)}>Mark Complete</button>
          <button onClick={() => deleteAssignment(index)}>Delete</button>
    </div>
  ))}
  {studySessions.length > 0 && (
  <div>
    <h2>Study Sessions</h2>

    {studySessions.map((session, index) => (
      <div key={index} className="assignment-card">
       <p>Session {session.sessionNumber}</p>
        <h3>{session.name}</h3>
        <p>Study before: {session.date}</p>
        <p>Priority: {session.priority}</p>
      </div>
    ))}
  </div>
)}
</div>
)
}

export default App


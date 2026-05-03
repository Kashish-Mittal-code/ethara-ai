import React, { useEffect, useState, useContext } from 'react'
import api from '../services/api'
import AuthContext from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function Admin() {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [u, p, t] = await Promise.all([
        api.get('/auth/users'),
        api.get('/projects'),
        api.get('/tasks')
      ])
      setUsers(u.data.data || [])
      setProjects(p.data.data || [])
      setTasks(t.data.data || [])
    } catch (err) {
      toast.error('Failed to load admin data')
    } finally { setLoading(false) }
  }

  const assignTask = async (taskId, userId) => {
    try {
      await api.put(`/tasks/${taskId}`, { assignedTo: userId })
      toast.success('Task assigned')
      fetchAll()
    } catch (err) { toast.error('Failed to assign task') }
  }

  if (!user || user.role !== 'admin') {
    return <div className="text-center p-8">Forbidden — admin only</div>
  }

  if (loading) return <div className="p-8 text-center">Loading admin...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Console</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Team Members</h2>
          <ul>
            {users.map(u => (
              <li key={u._id} className="py-2 border-b">{u.name} — {u.email} {u.emailVerified ? '✓' : ''}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Projects</h2>
          <ul>
            {projects.map(p => (
              <li key={p._id} className="py-2 border-b">{p.title}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Tasks</h2>
          <ul>
            {tasks.map(task => (
              <li key={task._id} className="py-2 border-b flex items-center justify-between">
                <div>
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-gray-500">{task.description}</div>
                </div>
                <div>
                  <select defaultValue={task.assignedTo || ''} onChange={(e)=>assignTask(task._id, e.target.value)} className="border p-1 rounded">
                    <option value="">Unassigned</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

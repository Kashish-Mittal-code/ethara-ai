import React, { useEffect, useState } from 'react'
import { CheckSquare, Plus, Trash2, Edit, CheckCircle2, Circle, Loader } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../services/api'

export default function Tasks() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' })
  const [editId, setEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks')
      setItems(res.data.data || [])
      setLoading(false)
    } catch (err) {
      toast.error('Failed to load tasks')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Task title is required')
      return
    }

    setSubmitting(true)
    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, form)
        toast.success('✓ Task updated')
      } else {
        await api.post('/tasks', form)
        toast.success('✓ Task created')
      }
      setForm({ title: '', description: '', status: 'pending' })
      setFormOpen(false)
      setEditId(null)
      fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}`)
      toast.success('✓ Task deleted')
      fetchTasks()
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const handleEdit = (task) => {
    setForm({ title: task.title, description: task.description, status: task.status })
    setEditId(task._id)
    setFormOpen(true)
  }

  const toggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    try {
      await api.put(`/tasks/${task._id}`, { ...task, status: newStatus })
      toast.success(newStatus === 'completed' ? '✓ Task completed!' : '✓ Task reopened')
      fetchTasks()
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const filteredItems = items.filter((t) => filterStatus === 'all' || t.status === filterStatus)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-gray-600 mt-1">Organize and track your work</p>
        </div>
        <button
          onClick={() => {
            setForm({ title: '', description: '', status: 'pending' })
            setEditId(null)
            setFormOpen(!formOpen)
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            {editId ? 'Edit Task' : 'Create New Task'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Task name"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Task description"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none h-20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editId ? 'Update' : 'Create'}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false)
                  setForm({ title: '', description: '', status: 'pending' })
                  setEditId(null)
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'All Tasks' },
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === filter.value
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {filterStatus === 'all' ? 'No tasks yet. Create one to get started!' : `No ${filterStatus} tasks`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((task) => (
            <div
              key={task._id}
              className={`bg-gradient-to-r border-2 rounded-xl p-4 hover:shadow-lg transition-all transform hover:scale-102 group flex items-center gap-4 ${
                task.status === 'completed'
                  ? 'from-gray-50 to-gray-100 border-gray-200 opacity-75'
                  : 'from-white to-gray-50 border-blue-200'
              }`}
            >
              <button
                onClick={() => toggleComplete(task)}
                className="flex-shrink-0 p-2 hover:bg-blue-100 rounded-lg transition-all"
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600" />
                )}
              </button>

              <div className="flex-grow min-w-0">
                <h3
                  className={`font-bold text-lg ${
                    task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
                )}
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => handleEdit(task)}
                  className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

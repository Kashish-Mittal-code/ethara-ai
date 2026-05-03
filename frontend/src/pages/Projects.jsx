import React, { useEffect, useState } from 'react'
import { FolderOpen, Plus, Trash2, Edit, Loader } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../services/api'

export default function Projects() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })
  const [editId, setEditId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      setItems(res.data.data || [])
      setLoading(false)
    } catch (err) {
      toast.error('Failed to load projects')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Project title is required')
      return
    }

    setSubmitting(true)
    try {
      if (editId) {
        await api.put(`/projects/${editId}`, form)
        toast.success('✓ Project updated')
      } else {
        await api.post('/projects', form)
        toast.success('✓ Project created')
      }
      setForm({ title: '', description: '' })
      setFormOpen(false)
      setEditId(null)
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      toast.success('✓ Project deleted')
      fetchProjects()
    } catch (err) {
      toast.error('Failed to delete project')
    }
  }

  const handleEdit = (project) => {
    setForm({ title: project.title, description: project.description })
    setEditId(project._id)
    setFormOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
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
            Projects
          </h1>
          <p className="text-gray-600 mt-1">Manage your team projects</p>
        </div>
        <button
          onClick={() => {
            setForm({ title: '', description: '' })
            setEditId(null)
            setFormOpen(!formOpen)
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Form */}
      {formOpen && (
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800">
            {editId ? 'Edit Project' : 'Create New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Project name"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Project description"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none h-24"
              />
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
                  setForm({ title: '', description: '' })
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

      {/* Projects List */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((project) => (
            <div
              key={project._id}
              className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all transform hover:scale-105 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

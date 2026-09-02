'use client'

import { useState } from 'react'
import { Upload, LockKeyhole, Save, LogOut } from 'lucide-react'

const sections = ['Profile', 'Milestones', 'Gallery', 'Favorites', 'Letters', 'Videos', 'Birthday', 'Family', 'Timeline']

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [secret, setSecret] = useState('')
  const [active, setActive] = useState('Profile')
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [fields, setFields] = useState({ name: 'Raghav', birthday: '20th October 2025', location: 'Dharashiv', parents: 'Pranjali Tambe, Amar Tambe', theme: '[Birthday theme]' })

  async function unlock(event: React.FormEvent) {
    event.preventDefault()
    const response = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret }) })
    if (response.ok) setAuthenticated(true)
    else setMessage('That secret did not unlock the editor.')
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true); setMessage('Uploading your memory...')
    const body = new FormData(); body.append('file', file); body.append('label', `${active} upload`); body.append('section', active)
    const response = await fetch('/api/admin/upload', { method: 'POST', body })
    setUploading(false); setMessage(response.ok ? 'Uploaded. Your memory is safely stored.' : 'Upload failed. Please try again.')
  }

  async function save() {
    const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: 'raghav', content: fields }) })
    setMessage(response.ok ? 'Saved to the capsule.' : 'Could not save changes.')
  }

  if (!authenticated) return <main className="admin-gate"><form onSubmit={unlock} className="admin-login"><span className="eyebrow">Private editor</span><LockKeyhole size={30} /><h1>Open the memory book</h1><p>Enter the shared secret to add photos and update Raghav&apos;s capsule.</p><input aria-label="Shared secret" type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="Shared secret" required /><button type="submit">Unlock editor</button>{message && <small>{message}</small>}</form></main>

  return <main className="admin-shell"><header className="admin-header"><div><span className="eyebrow">Raghav&apos;s time capsule</span><h1>Memory book editor</h1></div><button className="admin-logout" onClick={() => setAuthenticated(false)}><LogOut size={16} /> Lock</button></header><div className="admin-layout"><aside className="admin-sidebar"><p>Sections</p>{sections.map(section => <button className={active === section ? 'selected' : ''} key={section} onClick={() => setActive(section)}>{section}</button>)}</aside><section className="admin-content"><div className="admin-toolbar"><div><span className="eyebrow">Editing {active}</span><h2>Keep the story growing</h2></div><button onClick={save}><Save size={16} /> Save changes</button></div>{active === 'Profile' || active === 'Birthday' ? <div className="editor-form">{Object.entries(fields).map(([key, value]) => <label key={key}>{key.replace(/([A-Z])/g, ' $1')}<input value={value} onChange={e => setFields({ ...fields, [key]: e.target.value })} /></label>)}</div> : <div className="upload-panel"><Upload size={34} /><h3>Add {active.toLowerCase()} memories</h3><p>Choose a photo or video placeholder to add it to this chapter. The public capsule will use this private media bucket.</p><label className="upload-button">{uploading ? 'Uploading...' : 'Choose file'}<input type="file" accept="image/*,video/*" onChange={upload} disabled={uploading} /></label></div>}{message && <p className="admin-message" role="status">{message}</p>}</section></div></main>
}

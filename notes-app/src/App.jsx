import React, { useEffect, useMemo, useState } from 'react';

import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from './firebase.js';
 
export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'open' | 'done'
 
  // Load notes from Firestore and keep them up to date
  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setNotes(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);
 
  async function add() {
    const val = text.trim();
    if (!val) return;
    setText('');
    await addDoc(collection(db, 'notes'), {
      text: val, done: false, createdAt: new Date().toISOString()
    });
  }
 
  async function toggle(id) {
    const note = notes.find(n => n.id === id);
    await updateDoc(doc(db, 'notes', id), { done: !note.done });
  }
 
  async function remove(id) {
    await deleteDoc(doc(db, 'notes', id));
  }


  const filtered = useMemo(() => {
    if (filter === 'open') return notes.filter(n => !n.done);
    if (filter === 'done') return notes.filter(n => n.done);
    return notes;
  }, [notes, filter]);

  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', fontFamily: 'system-ui,sans-serif' }}>
      <h1>Notes App (JavaScript)</h1>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="New note"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          style={{ flex: 1, padding: 8 }}
          aria-label="New note text"
        />
        <button onClick={add}>Add</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Filter value="all"  current={filter} set={setFilter} />
        <Filter value="open" current={filter} set={setFilter} />
        <Filter value="done" current={filter} set={setFilter} />
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {filtered.map(n => (
          <li key={n.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <span style={{ textDecoration: n.done ? 'line-through' : 'none' }}>{n.text}</span>
            <button onClick={() => toggle(n.id)} aria-label={n.done ? 'Mark as not done' : 'Mark as done'}>{n.done ? 'Undo' : 'Done'}</button>
            <button onClick={() => remove(n.id)} aria-label="Delete">Delete</button>
          </li>
        ))}
        {filtered.length === 0 && <li style={{ color: '#666' }}>No notes to show.</li>}
      </ul>
    </main>
  );
}

function Filter({ value, current, set }) {
  const active = value === current;
  return (
    <button onClick={() => set(value)} aria-pressed={active} style={{ fontWeight: active ? 700 : 400 }}>
      {value[0].toUpperCase() + value.slice(1)}
    </button>
  );
}

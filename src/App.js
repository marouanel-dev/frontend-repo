import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/tickets';

const statusColors = {
  OUVERT: '#3498db',
  EN_COURS: '#f39c12',
  FERME: '#2ecc71'
};

const priorityColors = {
  FAIBLE: '#95a5a6',
  MOYENNE: '#e67e22',
  HAUTE: '#e74c3c'
};

function App() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'MOYENNE', status: 'OUVERT' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await axios.get(API_URL);
    setTickets(res.data);
  };

  const handleSubmit = async () => {
    if (!form.title) return alert('Le titre est obligatoire !');
    if (editTicket) {
      await axios.put(`${API_URL}/${editTicket.id}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ title: '', description: '', priority: 'MOYENNE', status: 'OUVERT' });
    setShowForm(false);
    setEditTicket(null);
    fetchTickets();
  };

  const handleEdit = (ticket) => {
    setEditTicket(ticket);
    setForm({ title: ticket.title, description: ticket.description, priority: ticket.priority, status: ticket.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce ticket ?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchTickets();
    }
  };

  const styles = {
    app: { fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: '#f5f6fa', minHeight: '100vh' },
    header: { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    btn: { padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    card: { background: 'white', borderRadius: '10px', padding: '15px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    badge: (color) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', color: 'white', backgroundColor: color, fontSize: '12px', fontWeight: 'bold' }),
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: 'white', padding: '30px', borderRadius: '10px', width: '450px' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>🎫 Gestion de Tickets</h1>
          <p style={{ margin: '5px 0 0', opacity: 0.8 }}>{tickets.length} ticket(s) au total</p>
        </div>
        <button style={{ ...styles.btn, backgroundColor: 'white', color: '#764ba2' }}
          onClick={() => { setShowForm(true); setEditTicket(null); setForm({ title: '', description: '', priority: 'MOYENNE', status: 'OUVERT' }); }}>
          + Nouveau Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
          <p style={{ fontSize: '48px' }}>📭</p>
          <p>Aucun ticket pour l'instant. Créez-en un !</p>
        </div>
      ) : (
        tickets.map(ticket => (
          <div key={ticket.id} style={styles.card}>
            <div>
              <h3 style={{ margin: '0 0 8px' }}>#{ticket.id} — {ticket.title}</h3>
              <p style={{ margin: '0 0 10px', color: '#666' }}>{ticket.description}</p>
              <span style={styles.badge(statusColors[ticket.status])}>{ticket.status}</span>
              {' '}
              <span style={styles.badge(priorityColors[ticket.priority])}>Priorité : {ticket.priority}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ ...styles.btn, backgroundColor: '#3498db', color: 'white' }} onClick={() => handleEdit(ticket)}>✏️</button>
              <button style={{ ...styles.btn, backgroundColor: '#e74c3c', color: 'white' }} onClick={() => handleDelete(ticket.id)}>🗑️</button>
            </div>
          </div>
        ))
      )}

      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={{ marginTop: 0 }}>{editTicket ? '✏️ Modifier le ticket' : '➕ Nouveau ticket'}</h2>
            <input style={styles.input} placeholder="Titre *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea style={{ ...styles.input, height: '80px', resize: 'vertical' }} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <select style={styles.select} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="FAIBLE">Priorité : FAIBLE</option>
              <option value="MOYENNE">Priorité : MOYENNE</option>
              <option value="HAUTE">Priorité : HAUTE</option>
            </select>
            {editTicket && (
              <select style={styles.select} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="OUVERT">OUVERT</option>
                <option value="EN_COURS">EN_COURS</option>
                <option value="FERME">FERME</option>
              </select>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button style={{ ...styles.btn, backgroundColor: '#95a5a6', color: 'white' }} onClick={() => setShowForm(false)}>Annuler</button>
              <button style={{ ...styles.btn, backgroundColor: '#764ba2', color: 'white' }} onClick={handleSubmit}>
                {editTicket ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

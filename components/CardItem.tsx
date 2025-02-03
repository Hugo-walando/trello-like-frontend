'use client';

import { useState } from 'react';
import axios from 'axios';

interface CardProps {
  card: {
    _id: string;
    title: string;
    status: string;
  };
  token: string;
  onUpdate: (updatedCard: any) => void;
  onDelete: (cardId: string) => void;
}

const CardItem = ({ card, token, onUpdate, onDelete }: CardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);

  // Passage en mode édition au double-clic sur le titre
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Lorsqu'on quitte le champ, on envoie la mise à jour si le titre a changé
  const handleBlur = async () => {
    if (newTitle.trim() && newTitle !== card.title) {
      try {
        const res = await axios.put(
          `http://localhost:5000/api/cards/${card._id}`,
          { title: newTitle },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        onUpdate(res.data);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du titre :', error);
      }
    }
    setIsEditing(false);
  };

  // Permet de terminer l'édition avec la touche Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  // Mise à jour du statut via un sélecteur
  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/cards/${card._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate(res.data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
    }
  };

  // Suppression de la carte
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cards/${card._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(card._id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la carte :', error);
    }
  };

  return (
    <div
      style={{
        marginBottom: '1rem',
        border: '1px solid #ccc',
        padding: '0.5rem',
      }}
    >
      {isEditing ? (
        <input
          type='text'
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{ fontSize: '1rem', padding: '0.2rem' }}
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
        >
          {card.title}
        </span>
      )}
      <div style={{ marginTop: '0.5rem' }}>
        <label>
          Statut:
          <select
            value={card.status}
            onChange={handleStatusChange}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value='todo'>À faire</option>
            <option value='in-progress'>En cours</option>
            <option value='done'>Terminé</option>
          </select>
        </label>
      </div>
      <button
        onClick={handleDelete}
        style={{
          marginTop: '0.5rem',
          background: 'red',
          color: 'white',
          border: 'none',
          padding: '0.3rem 0.6rem',
          cursor: 'pointer',
        }}
      >
        Supprimer
      </button>
    </div>
  );
};

export default CardItem;

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import CardItem from '../../../components/CardItem'; // Assure-toi que le chemin est correct

interface Card {
  _id: string;
  title: string;
  status: string;
}

export default function BoardPage() {
  const { boardId } = useParams() as { boardId: string };
  const { token } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [newCardTitle, setNewCardTitle] = useState<string>('');

  useEffect(() => {
    if (boardId && token) {
      axios
        .get(`http://localhost:5000/api/cards/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCards(res.data))
        .catch((err) =>
          console.error('Erreur lors de la récupération des cartes :', err),
        );
    }
  }, [boardId, token]);

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/cards',
        { title: newCardTitle, boardId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCards((prevCards) => [...prevCards, res.data]);
      setNewCardTitle('');
    } catch (error) {
      console.error('Erreur lors de la création de la carte :', error);
    }
  };

  // Fonction pour mettre à jour la carte dans l'état local après modification
  const handleUpdateCard = (updatedCard: Card) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card._id === updatedCard._id ? updatedCard : card,
      ),
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prevCards) => prevCards.filter((card) => card._id !== cardId));
  };

  return (
    <div>
      <h1>Détails du tableau</h1>
      <h2>Cartes :</h2>
      {cards.length > 0 ? (
        <ul>
          {cards.map((card) => (
            <li key={card._id}>
              <CardItem
                card={card}
                token={token!}
                onUpdate={handleUpdateCard}
                onDelete={handleDeleteCard}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune carte pour le moment.</p>
      )}

      {/* Formulaire pour ajouter une nouvelle carte */}
      <form onSubmit={handleCreateCard}>
        <input
          type='text'
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder='Titre de la carte'
          required
        />
        <button type='submit'>Ajouter une carte</button>
      </form>
    </div>
  );
}

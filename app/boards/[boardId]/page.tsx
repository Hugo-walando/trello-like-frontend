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
      <h1 className='mb-10 mt-10'>Liste des taches</h1>
      <h3 className='mb-4'>taches</h3>
      {cards.length > 0 ? (
        <ul className='w-400px flex flex-col items-center sm:grid sm:grid-cols-2 gap-4 '>
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
      <form onSubmit={handleCreateCard} className='mt-5'>
        <input
          type='text'
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder='Titre de la carte'
          required
          className='rounded-full w-[350px] bg-white shadow-sm px-5 py-3'
        />
        <button
          type='submit'
          className='bg-blue-500 shadow-lg shadow-blue-500/50 ml-4 px-4 py-2 rounded-md text-white'
        >
          Ajouter une carte
        </button>
      </form>
    </div>
  );
}

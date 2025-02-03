'use client';

import { useAuth } from '../context/authContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface Board {
  _id: string;
  title: string;
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState<string>('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchBoards = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/boards', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoards(res.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des tableaux :', error);
      }
    };

    fetchBoards();
  }, [token, router]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/boards',
        { title: newBoardTitle },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBoards((prevBoards) => [...prevBoards, res.data]);
      setNewBoardTitle('');
    } catch (error) {
      console.error('Erreur lors de la création du tableau :', error);
    }
  };

  if (!token) return <p>Redirection en cours...</p>;

  return (
    <div>
      <h1>Bienvenue {user?.username} !</h1>
      <h2>Vos tableaux :</h2>
      {boards.length > 0 ? (
        <ul>
          {boards.map((board) => (
            <li key={board._id} style={{ marginBottom: '1rem' }}>
              <Link href={`/boards/${board._id}`}>
                <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  {board.title}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun tableau pour le moment.</p>
      )}

      {/* Formulaire pour créer un nouveau tableau */}
      <form onSubmit={handleCreateBoard}>
        <input
          type='text'
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder='Titre du tableau'
          required
        />
        <button type='submit'>Créer un tableau</button>
      </form>
    </div>
  );
}

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
    <div className='w-600px mx-auto'>
      <h1 className='mb-10 mt-10'>Hey {user?.username} !</h1>
      <h3 className='mb-4'>Projets</h3>

      {boards.length > 0 ? (
        <ul className='w-400px flex flex-col items-center sm:grid sm:grid-cols-2 gap-4 '>
          {boards.map((board) => (
            <li key={board._id} style={{ marginBottom: '1rem' }}>
              <Link href={`/boards/${board._id}`}>
                <button className='font-bold text-2xl bg-white py-3 px-6 w-60 h-28 shadow-md rounded-lg'>
                  {board.title}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun projet pour le moment.</p>
      )}

      {/* Formulaire pour créer un nouveau tableau */}
      <form onSubmit={handleCreateBoard}>
        <input
          type='text'
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          placeholder='Titre du tableau'
          required
          className='rounded-full w-[350px] bg-white shadow-sm px-5 py-3'
        />
        <button
          className='bg-blue-500 shadow-lg shadow-blue-500/50 ml-4 px-4 py-2 rounded-md text-white'
          type='submit'
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}

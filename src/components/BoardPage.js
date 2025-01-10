import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import AddCardModal from '../components/AddCardModal';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  InputAdornment,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';

const API_URL = 'http://localhost:5000/api';

function BoardPage({ onLogout }) {
  const navigate = useNavigate();
  const [boards, setBoards] = useState({
    todo: [],
    inProgress: [],
    done: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCards();
  }, [navigate]);

  const fetchCards = async () => {
    try {
      const response = await fetch(`${API_URL}/cards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
      const data = await response.json();
      
      const boardsData = {
        'todo': data.filter(card => card.boardId === 'todo'),
        'inProgress': data.filter(card => card.boardId === 'inProgress'),
        'done': data.filter(card => card.boardId === 'done')
      };
      
      setBoards(boardsData);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const addCard = async (cardData) => {
    try {
      const response = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...cardData,
          boardId: selectedBoard
        })
      });
      
      if (response.ok) {
        await fetchCards();
        setOpenModal(false);
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      const response = await fetch(`${API_URL}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        await fetchCards();
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const updateCard = async (updatedCard) => {
    try {
      const response = await fetch(`${API_URL}/cards/${updatedCard._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedCard)
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      const data = await response.json();
      setBoards(prevBoards => {
        const newBoards = { ...prevBoards };
        Object.keys(newBoards).forEach(boardId => {
          newBoards[boardId] = newBoards[boardId].filter(
            card => card._id !== updatedCard._id
          );
        });
        newBoards[updatedCard.boardId] = [
          ...newBoards[updatedCard.boardId],
          data
        ];
        return newBoards;
      });
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDrop = async (cardId, sourceBoardId, targetBoardId) => {
    const card = boards[sourceBoardId].find(card => card._id === cardId);
    if (card) {
      await updateCard({ ...card, boardId: targetBoardId });
    }
  };

  const handleAddCard = (boardId) => {
    setSelectedBoard(boardId);
    setOpenModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#2c3e50'
          }}
        >
          My Trello Board
        </Typography>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mb: 4,
        width: '100%'
      }}>
        <TextField
          sx={{ width: '50%' }}
          variant="outlined"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 3,
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        width: '100%'
      }}>
        {Object.entries(boards).map(([boardId, cards]) => (
          <Board
            key={boardId}
            title={boardId}
            cards={cards.filter(card => 
              card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              card.description.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            onAddCard={() => handleAddCard(boardId)}
            onDeleteCard={deleteCard}
            onUpdateCard={updateCard}
            onDrop={handleDrop}
          />
        ))}
      </Box>

      <AddCardModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={addCard}
      />
    </Container>
  );
}

export default BoardPage;

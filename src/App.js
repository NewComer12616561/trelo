import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import AddCardModal from './components/AddCardModal';
import { Container, Typography, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [boards, setBoards] = useState({
    todo: [],
    inProgress: [],
    done: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch(`${API_URL}/cards`);
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
        method: 'DELETE'
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
      console.log('Updating card:', updatedCard);

      const response = await fetch(`${API_URL}/cards/${updatedCard._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCard)
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      const data = await response.json();
      console.log('Server response:', data);

      // Update the boards state
      setBoards(prevBoards => {
        const newBoards = { ...prevBoards };
        
        // Remove card from all boards
        Object.keys(newBoards).forEach(boardId => {
          newBoards[boardId] = newBoards[boardId].filter(
            card => card._id !== updatedCard._id
          );
        });
        
        // Add card to new board
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
      await updateCard(card);
    }
  };

  const handleAddCard = (boardId) => {
    setSelectedBoard(boardId);
    setOpenModal(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#2c3e50',
          mb: 4 
        }}
      >
        My Trello Board
      </Typography>
      
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

export default App;

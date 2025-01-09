import React, { useState } from 'react';
import Card from './Card';
import { Paper, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Board({ title, cards, onAddCard, onDeleteCard, onUpdateCard }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const cardId = e.dataTransfer.getData('cardId');
    const sourceBoardId = e.dataTransfer.getData('sourceBoardId');
    const cardData = JSON.parse(e.dataTransfer.getData('cardData'));
    
    if (sourceBoardId !== title) {
      await onUpdateCard({
        ...cardData,
        boardId: title
      });
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        width: '33%', 
        bgcolor: isDraggingOver ? '#e3f2fd' : '#f5f5f5',
        minHeight: '70vh',
        transition: 'all 0.2s ease',
        border: isDraggingOver ? '2px dashed #2196f3' : '2px solid transparent',
        display: 'flex',
        flexDirection: 'column'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          textTransform: 'capitalize',
          color: isDraggingOver ? '#1976d2' : 'inherit',
          transition: 'color 0.2s ease'
        }}
      >
        {title}
        <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
          ({cards.length} cards)
        </Typography>
      </Typography>
      
      <Button 
        startIcon={<AddIcon />}
        onClick={onAddCard}
        variant="contained"
        fullWidth
        sx={{ mb: 2 }}
      >
        Add Card
      </Button>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          flex: 1,
          minHeight: 100,
          p: 1,
          borderRadius: 1,
          bgcolor: isDraggingOver ? 'rgba(33, 150, 243, 0.08)' : 'transparent'
        }}
      >
        {cards.map(card => (
          <Card
            key={card._id}
            card={card}
            boardId={title}
            onDelete={() => onDeleteCard(card._id)}
            onUpdate={onUpdateCard}
          />
        ))}
        {cards.length === 0 && (
          <Typography 
            sx={{ 
              textAlign: 'center', 
              color: 'text.secondary',
              py: 4,
              border: '2px dashed #ccc',
              borderRadius: 1,
              bgcolor: 'background.paper'
            }}
          >
            Drop cards here
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

export default Board;

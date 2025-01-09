import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  IconButton, 
  TextField, 
  Button,
  MenuItem 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function Card({ card, boardId, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(card);
  const [isDragging, setIsDragging] = useState(false);

  const TITLE_LIMIT = 50;
  const DESCRIPTION_LIMIT = 200;
  const ASSIGNEE_LIMIT = 30;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('cardId', card._id);
    e.dataTransfer.setData('sourceBoardId', boardId);
    e.dataTransfer.setData('cardData', JSON.stringify(card));
    setIsDragging(true);

    const dragImage = e.target.cloneNode(true);
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.width = `${e.target.offsetWidth}px`;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(editData);
    setIsEditing(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  if (isEditing) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={editData.title || ''}
            onChange={(e) => setEditData({ 
              ...editData, 
              title: e.target.value.slice(0, TITLE_LIMIT) 
            })}
            margin="normal"
            required
            error={editData.title.length === TITLE_LIMIT}
            helperText={`${editData.title.length}/${TITLE_LIMIT} characters`}
          />
          <TextField
            fullWidth
            label="Description"
            value={editData.description || ''}
            onChange={(e) => setEditData({ 
              ...editData, 
              description: e.target.value.slice(0, DESCRIPTION_LIMIT) 
            })}
            margin="normal"
            multiline
            rows={3}
            error={editData.description.length === DESCRIPTION_LIMIT}
            helperText={`${editData.description.length}/${DESCRIPTION_LIMIT} characters`}
          />
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={editData.dueDate ? editData.dueDate.split('T')[0] : ''}
            onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Assignee"
            value={editData.assignee || ''}
            onChange={(e) => setEditData({ 
              ...editData, 
              assignee: e.target.value.slice(0, ASSIGNEE_LIMIT) 
            })}
            margin="normal"
            error={editData.assignee.length === ASSIGNEE_LIMIT}
            helperText={`${editData.assignee.length}/${ASSIGNEE_LIMIT} characters`}
          />
          <TextField
            fullWidth
            select
            label="Priority"
            value={editData.priority || 'Medium'}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
            margin="normal"
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!editData.title.trim()}
            >
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outlined">
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{ 
        p: 2, 
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease',
        '&:hover': { 
          boxShadow: 3,
          transform: 'translateY(-2px)'
        },
        '&:active': {
          cursor: 'grabbing'
        },
        position: 'relative',
        maxWidth: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '4px',
          height: '100%',
          backgroundColor: card.priority === 'High' ? '#ef5350' : 
                         card.priority === 'Low' ? '#66bb6a' : '#ffa726',
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px'
        }
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 80px)' // Account for buttons
          }}
          title={card.title} // Shows full title on hover
        >
          {truncateText(card.title, 30)}
        </Typography>
        <Box>
          <IconButton size="small" onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={onDelete}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {card.description && (
        <Typography 
          color="text.secondary" 
          sx={{ 
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.5em',
            maxHeight: '4.5em' // 3 lines
          }}
          title={card.description} // Shows full description on hover
        >
          {card.description}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {card.dueDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2">{formatDate(card.dueDate)}</Typography>
          </Box>
        )}
        {card.assignee && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            maxWidth: '150px'
          }}>
            <PersonIcon fontSize="small" />
            <Typography 
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              title={card.assignee} // Shows full assignee name on hover
            >
              {truncateText(card.assignee, 20)}
            </Typography>
          </Box>
        )}
        <Typography 
          variant="body2" 
          sx={{ 
            ml: 'auto',
            bgcolor: card.priority === 'High' ? '#ffebee' : 
                     card.priority === 'Low' ? '#e8f5e9' : '#fff3e0',
            color: card.priority === 'High' ? '#c62828' :
                   card.priority === 'Low' ? '#2e7d32' : '#ef6c00',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontWeight: 'medium'
          }}
        >
          {card.priority}
        </Typography>
      </Box>
    </Paper>
  );
}

export default Card;
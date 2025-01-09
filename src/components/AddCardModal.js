import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormHelperText
} from '@mui/material';

function AddCardModal({ open, onClose, onSubmit }) {
  const TITLE_LIMIT = 50;
  const DESCRIPTION_LIMIT = 200;
  const ASSIGNEE_LIMIT = 30;

  const [cardData, setCardData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    priority: 'Medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cardData);
    setCardData({
      title: '',
      description: '',
      dueDate: '',
      assignee: '',
      priority: 'Medium'
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Card</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={cardData.title}
            onChange={(e) => setCardData({ 
              ...cardData, 
              title: e.target.value.slice(0, TITLE_LIMIT) 
            })}
            margin="normal"
            required
            error={cardData.title.length === TITLE_LIMIT}
            helperText={`${cardData.title.length}/${TITLE_LIMIT} characters`}
          />
          <TextField
            fullWidth
            label="Description"
            value={cardData.description}
            onChange={(e) => setCardData({ 
              ...cardData, 
              description: e.target.value.slice(0, DESCRIPTION_LIMIT) 
            })}
            margin="normal"
            multiline
            rows={3}
            error={cardData.description.length === DESCRIPTION_LIMIT}
            helperText={`${cardData.description.length}/${DESCRIPTION_LIMIT} characters`}
          />
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={cardData.dueDate}
            onChange={(e) => setCardData({ ...cardData, dueDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Assignee"
            value={cardData.assignee}
            onChange={(e) => setCardData({ 
              ...cardData, 
              assignee: e.target.value.slice(0, ASSIGNEE_LIMIT) 
            })}
            margin="normal"
            error={cardData.assignee.length === ASSIGNEE_LIMIT}
            helperText={`${cardData.assignee.length}/${ASSIGNEE_LIMIT} characters`}
          />
          <TextField
            fullWidth
            select
            label="Priority"
            value={cardData.priority}
            onChange={(e) => setCardData({ ...cardData, priority: e.target.value })}
            margin="normal"
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!cardData.title.trim()}
          >
            Add Card
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddCardModal;
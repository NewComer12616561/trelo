const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const auth = require('../middleware/auth');

// Protect all routes with auth middleware
router.use(auth);

// Get all cards
router.get('/', async (req, res) => {
    try {
        const cards = await Card.find();
        console.log('Found cards:', cards);
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new card
router.post('/', async (req, res) => {
    const card = new Card(req.body);
    try {
        const newCard = await card.save();
        res.status(201).json(newCard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a card
router.put('/:id', async (req, res) => {
    try {
        console.log('Updating card with ID:', req.params.id);
        console.log('Update data:', req.body);

        const updatedCard = await Card.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                dueDate: req.body.dueDate,
                assignee: req.body.assignee,
                boardId: req.body.boardId
            },
            { new: true, runValidators: true }
        );

        if (!updatedCard) {
            console.log('Card not found');
            return res.status(404).json({ message: 'Card not found' });
        }

        console.log('Card updated successfully:', updatedCard);
        res.json(updatedCard);
    } catch (error) {
        console.error('Error updating card:', error);
        res.status(500).json({ message: 'Error updating card', error: error.message });
    }
});

// Delete a card
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCard = await Card.findByIdAndDelete(id);
        
        if (!deletedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }
        
        res.json({ message: 'Card deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
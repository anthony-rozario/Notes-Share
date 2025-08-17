// Example of note routes
import express from 'express';
const router = express.Router();
import NoteModel from '../models/Note.js'; // Assuming you have a Note model

// GET a note by ID

// Route to get a note by ID
router.get('/:id', async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await NoteModel.findById(noteId);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Failed to fetch note' });
    }
});

// Define other routes as necessary...
// Ensure you export the router


// PUT (update) a note
router.put('/:noteId', async (req, res) => {
  try {
    const note = await NoteModel.findByIdAndUpdate(req.params.noteId, req.body, { new: true });
    if (!note) return res.status(404).send('Note not found');
    res.json(note);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;

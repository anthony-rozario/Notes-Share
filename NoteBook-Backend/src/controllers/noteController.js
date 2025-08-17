const Note = require('../models/noteModel'); // Adjust the path to your note model

// Retrieve or create a note
const getOrCreateNote = async (req, res) => {
    const { noteId } = req.params;

    try {
        let note = await Note.findById(noteId);
        if (!note) {
            // If the note does not exist, create it
            note = new Note({ _id: noteId, content: '' }); // Initialize with empty content
            await note.save();
        }
        res.status(200).json(note); // Return the note
    } catch (error) {
        console.error('Error retrieving or creating note:', error);
        res.status(500).json({ message: 'Error retrieving or creating note' });
    }
};

// Update a note
const updateNote = async (req, res) => {
    const { noteId } = req.params;
    const { content } = req.body; // Assuming you're sending content in the request body

    try {
        const updatedNote = await Note.findByIdAndUpdate(noteId, { content }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(updatedNote); // Return the updated note
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Error updating note' });
    }
};

// Generate a new note ID
const createNewNote = async (req, res) => {
    const newNote = new Note({ content: '' }); // Or any default content you want
    try {
        await newNote.save();
        res.status(201).json(newNote); // Return the created note
    } catch (error) {
        console.error('Error creating new note:', error);
        res.status(500).json({ message: 'Error creating new note' });
    }
};

module.exports = { getOrCreateNote, updateNote, createNewNote };

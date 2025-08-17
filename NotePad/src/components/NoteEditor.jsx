import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

// Create socket connection
const socket = io('http://localhost:3000', { transports : ['websocket'] });

const NoteEditor = () => {
  const { noteId } = useParams(); // Get noteId from URL parameters
  const [content, setContent] = useState('');

  // Load the note content when the component mounts or noteId changes
  useEffect(() => {
    const loadNote = async () => {
      if (!noteId) {
        console.error("Note ID is undefined");
        return; // or handle the error appropriately
      }
      
      try {
        const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
          method: 'GET', // Use GET to load the note
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error loading note: ' + response.statusText);
        }
        const note = await response.json();
        setContent(note.content); // Set the loaded note content
      } catch (error) {
        console.error('Error loading note:', error);
      }
    };

    loadNote();

    // Listen for updates from other clients
    socket.on('noteUpdated', ({ noteId: updatedNoteId, content }) => {
      console.log(`Received note update: ${updatedNoteId}, Content: ${content}`); // Log reception
      if (updatedNoteId === noteId) {
        setContent(content);
      }
    });

    return () => {
      socket.off('noteUpdated'); // Cleanup on unmount
    };
  }, [noteId]);

  const handleChange = async (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Save the updated content to the database
    try {
      const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
        method: 'PUT', // Use PUT to update the note
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent }), // Send updated content
      });

      if (!response.ok) {
        throw new Error('Error saving note: ' + response.statusText);
      }

      console.log(`Note updated successfully: ${noteId}`);
      // Emit the new content to other clients
      socket.emit('editNote', noteId, newContent); // Emit new content to server
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <textarea 
      value={content} 
      onChange={handleChange} 
      className="bg-base-100 text-slate-900 dark:text-white px-2 pt-2 resize-none h-[100vh] w-full focus-within:outline-none overflow-y-auto"
    />
  );
};

export default NoteEditor;

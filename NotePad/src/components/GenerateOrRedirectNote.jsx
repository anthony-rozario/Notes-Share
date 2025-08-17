import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function GenerateOrRedirectNote() {
  const navigate = useNavigate();
  const { noteId } = useParams();

  useEffect(() => {
    if (!noteId) {
      const newNoteId = uuidv4();
      navigate(`/${newNoteId}`);
    } else {
      navigate(`/${noteId}`);
    }
  }, [noteId, navigate]);

  return null;  // No UI for this component
}

export default GenerateOrRedirectNote;

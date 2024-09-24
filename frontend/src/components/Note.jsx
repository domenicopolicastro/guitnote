import React from "react";
import { Link } from "react-router-dom"; 
import "../styles/Note.css";

function Note({ note, onDelete }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("it-IT");

    return (
        <div className="note-container">
            <p className="note-title">{note.title}</p>
            <p className="note-content">{note.content}</p>
            <p className="note-date">{formattedDate}</p>

            {/* Link per vedere e gestire le versioni del file */}
            <Link to={`/notes/${note.id}/files`} className="detail-button">
                Manage Files
            </Link>

            <button className="delete-button" onClick={() => onDelete(note.id)}>
                Delete
            </button>
        </div>
    );
}

export default Note;
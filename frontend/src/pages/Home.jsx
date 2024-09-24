import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        getNotes();
        getUserDetails();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const getUserDetails = () => {
        api
            .get("/api/user/")
            .then((res) => setUser(res.data))
            .catch((err) => console.log(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/${id}/delete/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();

        // Controllo se il titolo esiste già
        const noteWithSameTitle = notes.find(note => note.title === title);
        if (noteWithSameTitle) {
            alert("A note with this title already exists. Please choose a different title.");
            return;
        }

        const formData = { content, title };

        api
            .post("/api/notes/", formData)
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to make note.");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const handleLogout = () => {
        navigate("/logout");
    };

    return (
        <div>
            <div className="user-status">
                {user && <p>Logged in as: {user.username}</p>}
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
            <div>
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
            </div>
            <h2>Create a Note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <br />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default Home;
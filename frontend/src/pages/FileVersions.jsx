import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";  // Importa useNavigate per il pulsante "Indietro"
import api from "../api";
import "../styles/FileVersions.css";  // Importa il CSS per lo stile

function FileVersions() {
    const { id } = useParams();
    const [versions, setVersions] = useState([]);
    const [file, setFile] = useState(null);
    const [previousVersionId, setPreviousVersionId] = useState(null); 
    const [title, setTitle] = useState(""); // Stato per il titolo
    const [comment, setComment] = useState(""); // Stato per il commento
    const navigate = useNavigate();  // Istanziazione di useNavigate

    useEffect(() => {
        getFileVersions();
    }, []);

    const getFileVersions = () => {
        api
            .get(`/api/notes/${id}/files/`)
            .then((res) => setVersions(res.data))
            .catch((err) => alert(err));
    };

    const uploadNewVersion = (e) => {
        e.preventDefault();

        // Controlla se il titolo è già presente nelle versioni esistenti
        if (versions.some(version => version.title === title)) {
            alert("Title must be unique. This title already exists.");
            return;
        }

        if (versions.length > 0 && !previousVersionId) {
            alert("Please select a previous version.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);  // Aggiungi titolo
        formData.append("comment", comment);  // Aggiungi commento

        if (previousVersionId) {
            formData.append("previous_version", previousVersionId);
        }

        api
            .post(`/api/notes/${id}/files/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                if (res.status === 201) {
                    alert("File version uploaded!");
                    getFileVersions();
                } else {
                    alert("Failed to upload new version.");
                }
            })
            .catch((err) => alert(err));
    };

    const handleDownload = async (fileUrl) => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileUrl.split("/").pop());
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    };

    // Funzione per formattare la data con ora
    const formatDateTime = (dateTimeString) => {
        const options = {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateTimeString).toLocaleString("it-IT", options);
    };

    return (
        <div className="file-versions-container">
            {/* Pulsante Indietro */}
            <button className="back-button" onClick={() => navigate(-1)}>
                Indietro
            </button>

            <h2>Manage File Versions</h2>
            <ul>
                {versions.length === 0 ? (
                    <p>No versions available for this note.</p>
                ) : (
                    versions.map((version) => (
                        <li key={version.id} className="version-item">
                            <p><strong>Version:</strong> {version.title || "No title"}</p> {/* Mostra il titolo della versione */}
                            <p><strong>Comment:</strong> {version.comment || "No comment"}</p> {/* Mostra il commento della versione */}
                            <p><strong>Uploaded on:</strong> {formatDateTime(version.created_at)}</p> {/* Mostra la data e l'ora */}
                            <p>
                                <strong>Previous Version:</strong>{" "}
                                {version.previous_version ? (
                                    version.previous_version_data.title
                                ) : (
                                    "None (Root)"
                                )}
                            </p>
                            <button className="download-button" onClick={() => handleDownload(version.file)}>
                                Download {version.file.split("/").pop()}
                            </button>
                        </li>
                    ))
                )}
            </ul>

            <h3>Upload New Version</h3>
            <form onSubmit={uploadNewVersion}>
                <label htmlFor="file">Select file:</label>
                <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <br />

                {/* Input per il titolo */}
                <label htmlFor="title">File Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <br />

                {/* Input per il commento */}
                <label htmlFor="comment">Comment:</label>
                <textarea
                    id="comment"
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <br />

                {versions.length > 0 && (
                    <div>
                        <label htmlFor="previous_version">Select previous version (required):</label>
                        <select
                            id="previous_version"
                            value={previousVersionId || ""}
                            onChange={(e) => setPreviousVersionId(e.target.value)}
                            required
                        >
                            <option value="">Select previous version</option>
                            {versions.map((version) => (
                                <option key={version.id} value={version.id}>
                                    {version.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <br />
                <input type="submit" value="Upload" className="upload-button"/>
            </form>
        </div>
    );
}

export default FileVersions;
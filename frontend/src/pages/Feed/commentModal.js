import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MdComment } from 'react-icons/md'; // Importe o ícone de comentário
import "./comments.css";

const CommentModal = ({ imageUrl, onClose, user }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao obter comentários");
      }
      const data = await response.json();
      setComments(data.comments);
      setLoading(false);
      localStorage.setItem(`comments-${imageUrl}`, JSON.stringify(data.comments));
      localStorage.setItem(`commentsLoaded-${imageUrl}`, "true");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const isCommentsLoaded = localStorage.getItem(`commentsLoaded-${imageUrl}`);
    const storedComments = localStorage.getItem(`comments-${imageUrl}`);
    if (isCommentsLoaded && storedComments) {
      setComments(JSON.parse(storedComments));
      setLoading(false);
    } else {
      fetchComments();
    }
  }, [imageUrl]);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmitComment = async () => {
    try {
      const response = await fetch("https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          imageUrl,
          text: commentText,
        }),
      });
      if (!response.ok) {
        throw new Error("Erro ao adicionar comentário");
      }
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="comment-modal">
      <div className="comment-modal-content">
        <span className="close-comment-modal" onClick={onClose}>
          &times;
        </span>
        <div className="comment-image-container">
          {loading ? (
            <div className="loading-shimmer" style={{ height: "62rem" }}></div>
          ) : (
            <img
              src={imageUrl}
              alt="Imagem da postagem"
              className="comment-image"
            />
          )}
        </div>
        <div className="comment-input-container">
          <h2 className="comment-title">Comentários</h2>
          <div className="comment-list">
            <ul>
              {loading ? (
                <li className="loading-shimmer" style={{ height: "600px", marginBottom: "20px" }}></li>
              ) : comments.length === 0 ? ( // Verifique se não há nenhum comentário
                <li className="no-comments-message">
                  <span>Deixe um comentário.</span>
                </li>
              ) : (
                comments.map((comment, index) => (
                  <li key={index}>
                    <div className="comment-user-info">
                      <img
                        src={comment.userId.profileImageUrl}
                        alt="Profile"
                        className="profile-image-feed"
                      />
                      <div className="comment-content">
                        <div className="username-comment">
                          <span className="username-feed-publication">
                            {comment.userId.username}
                          </span>
                          <span className="comment-text">
                            {comment.text}
                          </span>
                        </div>
                        <span className="comment-time">
                          {formatDistanceToNow(new Date(comment.postedAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          {loading ? (
            <div className="loading-shimmer" style={{ height: "62rem", marginTop: "20px" }}></div>
          ) : (
            <div className="comment-input-wrapper">
              <input
                value={commentText}
                onChange={handleCommentChange}
                placeholder="Digite seu comentário..."
                className="comment-textarea"
              />
              <button
                onClick={handleSubmitComment}
                className="submit-comment-button"
              >
                Publicar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentModal;

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/use-auth";
import "./feedPage.css"; // Importando o arquivo de estilos
import { AiFillFire, AiOutlineFire } from "react-icons/ai"; // Importe o ícone de fogo
import "../perfil/PublicationDetailsModal/style.css";
import SidebarMenu from "../perfil/SidebarMenu/";
import { AiOutlineUser } from "react-icons/ai"; // Importando o ícone de usuário padrão
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; // Importe os ícones de salvar (cheio e vazio)
import { MdComment } from "react-icons/md";
import CommentModal from "./commentModal";

const FeedPage = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // Estado para armazenar o ID do dono do post selecionado
  const [isLiked, setIsLiked] = useState(); // Estado para indicar se a imagem foi curtida pelo usuário
  const [likedUsers, setLikedUsers] = useState([]); // Estado para armazenar os usuários que curtiram o post
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar se o modal está aberto
  const [modalUsers, setModalUsers] = useState([]); // Estado para armazenar os usuários para exibir no modal
  const [loading, setLoading] = useState(true);

  const [scrollPosition, setScrollPosition] = useState(0); // Estado para armazenar a posição de rolagem

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchFeedAndCheckSaved = async () => {
      setLoading(true); // Define loading como true antes de carregar o feed

      if (userId) {
        try {
          const response = await fetch(
            `https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/feed/${userId}`
          );
          if (!response.ok) {
            throw new Error("Erro ao carregar o feed");
          }
          const data = await response.json();
          // Mapear os posts e definir isLoading como true inicialmente
          const updatedFeed = data.map((post) => ({
            ...post,
            isLoading: true,
          }));
          setFeed(updatedFeed);

          // Verificar e atualizar o estado de salvamento de cada post
          await Promise.all(
            updatedFeed.map(async (post) => {
              await checkSaved(post, post.userId._id); // Corrigido para passar o postOwnerId
            })
          );

          setLoading(false); // Define loading como false após carregar o feed com sucesso
        } catch (err) {
          setError("Erro ao carregar o feed");
          setLoading(false); // Define loading como false em caso de erro
        }
      }
    };
    fetchFeedAndCheckSaved();
  }, [userId]);

  const likePost = async (postId, ownerUserId, imageUrl, likerId) => {
    try {
      checkLike();
      const response = await fetch(
        `https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/feed/${ownerUserId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl, likerId }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao curtir a postagem");
      }
      // Atualize o feed após curtir
      const updatedFeed = feed.map((post) => {
        if (post._id === postId) {
          return { ...post, isLiked: true }; // Marque a postagem como curtida
        }
        return post;
      });
      setFeed(updatedFeed);
      setIsLiked(true); // Atualize o estado isLiked para true
    } catch (err) {
      console.error(err);
    }
  };

  const unlikePost = async (postId, ownerUserId, imageUrl, likerId) => {
    try {
      checkLike();
      const response = await fetch(
        `https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/feed/${ownerUserId}/unlike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl, likerId }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao descurtir a postagem");
      }
      // Atualize o feed após descurtir
      const updatedFeed = feed.map((post) => {
        if (post._id === postId) {
          return { ...post, isLiked: false }; // Marque a postagem como não curtida
        }
        return post;
      });
      setFeed(updatedFeed);
      setIsLiked(false); // Atualize o estado isLiked para false
    } catch (err) {
      console.error(err);
    }
  };

  const [checkedLike, setCheckedLike] = useState(false);
  useEffect(() => {
    if (!checkedLike && feed.length > 0) {
      checkLike();
      setCheckedLike(true);
    }
  }, [checkedLike, feed]);

  const checkLike = async () => {
    try {
      const updatedFeed = await Promise.all(
        feed.map(async (post) => {
          const response = await fetch(
            `https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/feed/${user.id}/checkLikes`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageUrl: post.url }),
            }
          );
          if (!response.ok) {
            throw new Error("Erro ao verificar status de curtida");
          }
          const data = await response.json();
          return { ...post, isLiked: data.isLikedByUser };
        })
      );
      setFeed(updatedFeed);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewLikes = async (postId) => {
    try {
      const response = await fetch(
        "https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/likedUsers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: postId }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao obter usuários que curtiram o post");
      }
      const data = await response.json();
      setModalUsers(data.likedUsersNames); // Atualiza o estado com a lista de usuários
      openModal();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = () => {
    setModalOpen(true); // Abre o modal
    document.body.style.position = "fixed";
    // Armazenar a posição de rolagem atual
    setScrollPosition(window.pageYOffset);
  };

  const closeModal = () => {
    setModalOpen(false); // Fecha o modal
    document.body.style.position = "static";
    // Restaurar a posição de rolagem
    window.scrollTo(0, scrollPosition);
  };

  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostImageUrl, setSelectedPostImageUrl] = useState("");

  const openCommentModal = (imageUrl) => {
    setScrollPosition(window.pageYOffset); // Armazena a posição de rolagem atual
    setSelectedPostImageUrl(imageUrl);
    setCommentModalOpen(true);
    document.body.style.position = "fixed";
  };

  const closeCommentModal = () => {
    setCommentModalOpen(false);
    document.body.style.position = "static";
    window.scrollTo(0, scrollPosition); // Restaura a posição de rolagem
  };

  const handleSave = async (postId, postOwnerId, post) => {
    try {
      const response = await fetch(
        `https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/savePost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            postOwnerId: postOwnerId,
            imageUrl: post,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao salvar a postagem");
      }

      // Atualize o estado local do post salvo
      setFeed((prevFeed) =>
        prevFeed.map((prevPost) =>
          prevPost._id === postId ? { ...prevPost, isSaved: true } : prevPost
        )
      );

      // Pode ser útil retornar algo daqui, se necessário
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaved = async (post, postOwnerId, imageUrl, postId) => {
    try {
      const response = await fetch(
        `https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/saved`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            postOwnerId: postOwnerId,
            imageUrl: post.url,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao excluir a postagem dos salvos");
      }

      // Atualize o estado local apenas para a postagem que foi removida dos salvos
      setFeed((prevFeed) =>
        prevFeed.map((prevPost) =>
          prevPost.url === imageUrl ? { ...prevPost, isSaved: false } : prevPost
        )
      );

      // Pode ser útil retornar algo daqui, se necessário
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchFeedAndCheckSaved = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/feed/${userId}`
          );
          if (!response.ok) {
            throw new Error("Erro ao carregar o feed");
          }
          const data = await response.json();
          // Mapear os posts e definir isLoading como true inicialmente
          const updatedFeed = data.map((post) => ({
            ...post,
            isLoading: true,
          }));
          setFeed(updatedFeed);

          // Verificar e atualizar o estado de salvamento de cada post
          await Promise.all(
            updatedFeed.map(async (post) => {
              await checkSaved(post, post.userId._id); // Corrigido para passar o postOwnerId
            })
          );
        } catch (err) {
          setError("Erro ao carregar o feed");
        }
      }
    };
    fetchFeedAndCheckSaved();
  }, [userId]);

  // Função para verificar se a postagem foi salva e atualizar o estado local
  const checkSaved = async (post, postOwnerId) => {
    try {
      const response = await fetch(
        "https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/SavedPost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            postOwnerId: postOwnerId,
            imageUrl: post.url,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao verificar se a postagem foi salva");
      }
      const data = await response.json();
      setFeed((prevFeed) =>
        prevFeed.map((prevPost) =>
          prevPost._id === post._id
            ? { ...prevPost, isSaved: data.isSaved }
            : prevPost
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="feed-page-container">
      <div className="feed-page">
        <h1 className="welcome-explore">Bem-vindo ao Explorar.</h1>
        <SidebarMenu /> {/* Menu */}
        {loading ? (
          // Renderizar esqueleto de carregamento enquanto os dados estão sendo buscados
          <>
            {[...Array(10)].map((_, index) => (
              <div key={index} className="post shimmer">
                <div className="post-header shimmer"></div>
                <div className="shimmer post-image"></div>
                <div className="post-info shimmer">
                  <div className="contain-like-feed shimmer"></div>
                  <button className="view-likes-button shimmer"></button>
                  <div className="shimmer post-date-feed"></div>
                </div>
              </div>
            ))}
          </>
        ) : (
          feed.map((post) => (
            <div key={post._id} className="post ">
              <div className="post-header">
                {post.userId.profileImageUrl ? (
                  <a href={`/profile/${post.userId._id}`}>
                    <img
                      src={post.userId.profileImageUrl}
                      alt={`${post.userId.firstName} ${post.userId.lastName}`}
                      className="profile-image-feed"
                      onLoad={() => setLoading(false)}
                    />
                  </a>
                ) : (
                  <a href={`/profile/${post.userId._id}`}>
                    <AiOutlineUser className="profile-icon-profile" />
                  </a>
                )}
                <a href={`/profile/${post.userId._id}`}>
                  <p
                    className="username-feed"
                    onClick={() => setSelectedUserId(post.userId._id)}
                  >
                    {`${post.userId.username}`}
                  </p>
                </a>
              </div>
              <img
                src={post.url}
                alt="Imagem da galeria"
                className="post-image"
                onLoad={() => setLoading(false)} // Define loading como false após a imagem ser carregada
              />
              <div className="post-info">
                <div className="contain-like-feed">
                  <button
                    onClick={() => {
                      if (post.isLiked) {
                        unlikePost(
                          post._id,
                          post.userId._id,
                          post.url,
                          user.id
                        );
                      } else {
                        likePost(post._id, post.userId._id, post.url, user.id);
                      }
                    }}
                  >
                    {post.isLiked ? (
                      <>
                        <AiFillFire className="like filled" />
                      </>
                    ) : (
                      <>
                        <AiOutlineFire className="like-feed" />
                      </>
                    )}
                  </button>
                  <div className="post-actions">
                    <button onClick={() => openCommentModal(post.url, user.id)}>
                      <MdComment className="comment-icon" />
                    </button>
                  </div>
                </div>

                <button
                  className="view-likes-button"
                  onClick={() => handleViewLikes(post.url)}
                >
                  Ver quem curtiu
                </button>
                {post.isSaved ? (
                  <FaBookmark
                    className="save-icon saved"
                    onClick={() =>
                      handleSaved(post, post.userId._id, post.url, post._id)
                    }
                  />
                ) : (
                  <FaRegBookmark
                    className="save-icon"
                    onClick={() =>
                      handleSave(post._id, post.userId._id, post.url)
                    }
                  />
                )}
                <p className="post-date-feed">
                  Publicado em: {new Date(post.postedAt).toLocaleString()}
                </p>
              </div>
              {modalOpen && (
                <div className="feed-modal">
                  <div className="modal-content-feed">
                    <span className="close-feed-modal" onClick={closeModal}>
                      &times;
                    </span>

                    {modalUsers.length > 0 ? (
                      <ul className="feed-modal-list">
                        {" "}
                        <h2 className="feed-modal-title">
                          Usuários que curtiram o post:
                        </h2>
                        {modalUsers.map((user) => (
                          <li className="feed-modal-item" key={user.userId}>
                            {post.userId.profileImageUrl ? (
                              <a href={`/profile/${user.userId._id}`}>
                                <img
                                  src={user.profileImageUrl}
                                  alt="Imagem da galeria"
                                  className="rounded-image-message-feed"
                                />
                              </a>
                            ) : (
                              <a href={`/profile/${user.userId._id}`}>
                                <AiOutlineUser className="profile-icon-profile" />
                              </a>
                            )}
                            <a href={`/profile/${user.userId._id}`}>
                              {user.username}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-likes">
                        Nenhum usuário curtiu esta postagem ainda.
                      </p>
                    )}
                  </div>
                </div>
              )}{" "}
              {commentModalOpen && (
                <CommentModal
                  imageUrl={selectedPostImageUrl}
                  onClose={closeCommentModal}
                  user={user}
                />
              )}
            </div>
          ))
        )}
      </div>
      <h1 className="end-explore">Você chegou no fim.</h1>
    </main>
  );
};

export default FeedPage;

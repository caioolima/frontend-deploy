import React, { useEffect, useState } from "react";
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
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar se o modal está aberto
  const [modalUsers, setModalUsers] = useState([]); // Estado para armazenar os usuários para exibir no modal
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0); // Estado para armazenar a posição de rolagem
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostImageUrl, setSelectedPostImageUrl] = useState("");
  const [imageLoadStatus, setImageLoadStatus] = useState({});

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchFeedAndCheckStatuses = async () => {
      if (userId) {
        try {
          setLoading(true); // Define loading como true antes de carregar o feed

          // Buscar o feed
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
            isSaved: false, // Inicializar como não salvo
            isLiked: false, // Inicializar como não curtido
          }));
          setFeed(updatedFeed);

          // Verificar o status de curtida e salvamento
          const updatedFeedWithStatuses = await Promise.all(
            updatedFeed.map(async (post) => {
              // Verificar se a postagem foi salva
              const savedResponse = await fetch(
                "https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/SavedPost",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userId: user.id,
                    postOwnerId: post.userId._id,
                    imageUrl: post.url,
                  }),
                }
              );
              if (!savedResponse.ok) {
                throw new Error("Erro ao verificar se a postagem foi salva");
              }
              const savedData = await savedResponse.json();

              // Verificar se a postagem foi curtida
              const likedResponse = await fetch(
                `https://connecter-server-033a278d1512.herokuapp.com/feedRoutes/feed/${user.id}/checkLikes`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ imageUrl: post.url }),
                }
              );
              if (!likedResponse.ok) {
                throw new Error("Erro ao verificar status de curtida");
              }
              const likedData = await likedResponse.json();

              return {
                ...post,
                isSaved: savedData.isSaved,
                isLiked: likedData.isLikedByUser,
                isLoading: false, // Define isLoading como false após a verificação
              };
            })
          );
          setFeed(updatedFeedWithStatuses);

          setLoading(false); // Define loading como false após carregar o feed com sucesso
        } catch (err) {
          setError("Erro ao carregar o feed");
          setLoading(false); // Define loading como false em caso de erro
        }
      }
    };

    fetchFeedAndCheckStatuses();
  }, [userId]);

  const likePost = async (postId, ownerUserId, imageUrl, likerId) => {
    try {
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
      setFeed((prevFeed) =>
        prevFeed.map((post) =>
          post._id === postId ? { ...post, isLiked: true } : post
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unlikePost = async (postId, ownerUserId, imageUrl, likerId) => {
    try {
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
      setFeed((prevFeed) =>
        prevFeed.map((post) =>
          post._id === postId ? { ...post, isLiked: false } : post
        )
      );
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
  };

  const closeModal = () => {
    setModalOpen(false); // Fecha o modal
    document.body.style.position = "static";
  };

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

  const handleImageLoad = (postId) => {
    setImageLoadStatus((prevStatus) => ({
      ...prevStatus,
      [postId]: true,
    }));
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
            imageUrl: imageUrl,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao remover o salvamento da postagem");
      }
      // Atualize o estado local após remover o salvamento
      setFeed((prevFeed) =>
        prevFeed.map((prevPost) =>
          prevPost._id === postId ? { ...prevPost, isSaved: false } : prevPost
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="feed-page-container">
      <div className="feed-page">
        <h1 className="welcome-explore">Bem-vindo ao Explorar.</h1>
        <SidebarMenu /> {/* Menu */}
        {loading ? (
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
            <div key={post._id} className="post">
              <div className="post-header">
                {post.userId.profileImageUrl ? (
                  <a href={`/profile/${post.userId._id}`}>
                    <img
                      src={post.userId.profileImageUrl}
                      alt={`${post.userId.firstName} ${post.userId.lastName}`}
                      className="profile-image-feed"
                      onLoad={() =>
                        setImageLoadStatus((prev) => ({
                          ...prev,
                          [post._id]: true,
                        }))
                      }
                    />
                  </a>
                ) : (
                  <a href={`/profile/${post.userId._id}`}>
                    <AiOutlineUser className="profile-icon-profile" />
                  </a>
                )}
                <a href={`/profile/${post.userId._id}`}>
                  <p className="username-feed">{`${post.userId.username}`}</p>
                </a>
              </div>

              {/* Renderiza a imagem do post e oculta a legenda até que a imagem seja carregada */}
              {imageLoadStatus[post._id] ? (
                <>
                  <img
                    src={post.url}
                    alt="Imagem da galeria"
                    className="post-image"
                    onLoad={() => handleImageLoad(post._id)} // Atualiza o estado de carregamento da imagem
                  />
                  <div
                    className={`post-background-caption ${
                      post.caption ? "post-background-color-caption" : ""
                    }`}
                  >
                    <div className="post-caption-container">
                      <p className="post-caption-highlight">{post.caption}</p>
                    </div>
                  </div>

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
                            likePost(
                              post._id,
                              post.userId._id,
                              post.url,
                              user.id
                            );
                          }
                        }}
                      >
                        {post.isLiked ? (
                          <AiFillFire className="like filled" />
                        ) : (
                          <AiOutlineFire className="like-feed" />
                        )}
                      </button>
                      <div className="post-actions">
                        <button onClick={() => openCommentModal(post.url)}>
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
                </>
              ) : (
                <div className="shimmer post-image"></div> // Placeholder para a imagem
              )}

              {modalOpen && (
                <div className="feed-modal">
                  <div className="modal-content-feed">
                    <span className="close-feed-modal" onClick={closeModal}>
                      &times;
                    </span>
                    {modalUsers.length > 0 ? (
                      <ul className="feed-modal-list">
                        <h2 className="feed-modal-title">
                          Usuários que curtiram o post:
                        </h2>
                        {modalUsers.map((user) => (
                          <li className="feed-modal-item" key={user.userId}>
                            {user.profileImageUrl ? (
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
              )}
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
    </main>
  );
};

export default FeedPage;

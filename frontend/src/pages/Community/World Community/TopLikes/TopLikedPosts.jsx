import React, { useRef, useState, useEffect } from "react";
import styles from "./TopLikedPosts.module.css"; // Importando estilos do CSS Module
import { AiOutlineUser } from "react-icons/ai"; // Importando o ícone de usuário padrão

const TopLikedPosts = ({ topLikedPosts, t }) => {
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topLikedPosts.length > 0) {
      setLoading(false);
    }
  }, [topLikedPosts]);

  const handleNext = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide < topLikedPosts.length - 1 ? prevSlide + 1 : prevSlide
    );
  };

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide > 0 ? prevSlide - 1 : prevSlide));
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: currentSlide * carouselRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  return (
    <div>
      <h2 className={styles.topLikedTitle}>{t("topLikedPosts")}</h2>
      <hr className={styles.hrTop} />
      {loading ? (
        <p className={styles.loadingMessage}>{t("loading")}</p>
      ) : topLikedPosts.length > 0 ? (
        <div className={styles.postWrapper}>
          <div className={styles.carousel} ref={carouselRef}>
            {topLikedPosts.map((post, index) => (
              <div key={post.userId._id} className={styles.postItem}>
                <a href={`/profile/${post.userId._id}`} className={styles.postLink}>
                  <img
                    src={post.url}
                    alt="Top Liked Post"
                    className={styles.postImage}
                  />
                  <div className={styles.postDetails}>
                    {post.userId.profileImageUrl ? (
                      <img
                        src={post.userId.profileImageUrl}
                        alt="Profile"
                        className={styles.profileImage}
                      />
                    ) : (
                      <a href={`/profile/${post.userId._id}`}>
                        <AiOutlineUser className={styles.profileImagenone} />
                      </a>
                    )}
                    <p className={styles.postUser}>{post.username}</p>
                    <p className={styles.postLikes}>
                      {t("numberOfLikes")}: {post.likeCount}
                    </p>
                    <button className={styles.postButton}>
                      {t("viewProfile")}
                    </button>
                  </div>
                </a>
              </div>
            ))}
          </div>
          {topLikedPosts.length > 1 && (
            <>
              <button
                className={`${styles.carouselButton} ${styles.prev}`}
                onClick={handlePrev}
              >
                {"<"}
              </button>
              <button
                className={`${styles.carouselButton} ${styles.next}`}
                onClick={handleNext}
              >
                {">"}
              </button>
            </>
          )}
        </div>
      ) : (
        <p className={styles.noPostsMessage}>{t("noPostsAvailable")}</p>
      )}
    </div>
  );
};

export default TopLikedPosts;

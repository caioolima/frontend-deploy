import React, { useRef, useState, useEffect } from "react";

const TopLikedPosts = ({ topLikedPosts, t }) => {
  const carouselRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleNext = () => {
    if (carouselRef.current) {
      const maxIndex =
        Math.floor(
          carouselRef.current.scrollWidth / carouselRef.current.clientWidth
        ) - 1;
      setCarouselIndex((prevIndex) =>
        prevIndex < maxIndex ? prevIndex + 1 : prevIndex
      );
    }
  };

  const handlePrev = () => {
    setCarouselIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselIndex * carouselRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  }, [carouselIndex]);

  return (
    <div>
      <h2 className="top-liked-title">{t("topLikedPosts")}</h2>
      <hr className="hr-top" />
      <div className="post-wrapper">
        <div className="carousel" ref={carouselRef}>
          {topLikedPosts.length > 0 ? (
            topLikedPosts.map((post) => (
              <div key={post.userId._id} className="post-item-post">
                <a href={`/profile/${post.userId._id}`}>
                  <img
                    src={post.url}
                    alt="Top Liked Post"
                    className="post-image-likes"
                  />
                  <div className="post-name">
                    <img
                      src={post.userId.profileImageUrl}
                      alt="Profile"
                      className="profile-image"
                    />
                    <p className="post-user-like">{post.username}</p>{" "}
                    <p className="post-like-user">
                      {t("numberOfLikes")}: {post.likeCount}
                    </p> <button className="post-button-post">
                    {t("viewProfile")}
                  </button>
                  </div>

                 
                </a>
              </div>
            ))
          ) : (
            <p className="noLikedPosts">{t("noLikedPosts")}</p>
          )}
        </div>
        <button className="carousel-button prev" onClick={handlePrev}>
          {t("<")}
        </button>
        <button className="carousel-button next" onClick={handleNext}>
          {t(">")}
        </button>
      </div>
    </div>
  );
};

export default TopLikedPosts;

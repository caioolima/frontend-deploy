import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./UserCommunitiesCard.module.css"; // Arquivo CSS Modules para estilização

const UserCommunitiesCard = ({
  comunidadesUsuario,
  flagMappings,
  numeroMembros,
  t,
}) => {
  const [loading, setLoading] = useState(true);
  const [sliderLoaded, setSliderLoaded] = useState(false); // Estado para controlar carregamento do Slider

  // Função para seta personalizada anterior
  const CustomPrevArrow = ({ onClick }) => (
    <div className={`${styles.customPrevButton} ${styles.sliderArrow}`} onClick={onClick}>
      {"\u2190"}
    </div>
  );

  // Função para seta personalizada seguinte
  const CustomNextArrow = ({ onClick }) => (
    <div className={`${styles.customNextButton} ${styles.sliderArrow}`} onClick={onClick}>
      {"\u2192"}
    </div>
  );

  // Configurações do Slider com as setas personalizadas
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
    prevArrow: sliderLoaded && <CustomPrevArrow />, // Renderiza seta anterior apenas quando sliderLoaded for true
    nextArrow: sliderLoaded && <CustomNextArrow />, // Renderiza seta seguinte apenas quando sliderLoaded for true
  };

  useEffect(() => {
    // Simulação de carregamento de dados
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Altere este valor para o tempo real de carregamento dos dados
  }, []);

  useEffect(() => {
    // Define sliderLoaded como true após o carregamento inicial
    if (!loading) {
      setSliderLoaded(true);
    }
  }, [loading]);

  return (
    <div className={styles.userCommunitiesCard}>
      <h2>{t("Your Communities")}</h2>
      <hr className={styles.hrTop} />
      {loading ? (
        <p className={styles.loadingMessage}>{t("loading")}</p>
      ) : comunidadesUsuario.length > 0 ? (
        <Slider {...settings}>
          {comunidadesUsuario.map((comunidade) => (
            <div key={comunidade._id} className={styles.cardCommunity}>
              <div
                className={styles.imageCountry}
                style={{
                  backgroundImage: `url(${
                    flagMappings[comunidade.country.toLowerCase()] ||
                    comunidade.image
                  })`,
                }}
              ></div>
              <span>{comunidade.country}</span>
              <p>
                {numeroMembros[comunidade._id] !== undefined
                  ? numeroMembros[comunidade._id] === 1
                    ? t("member", { count: numeroMembros[comunidade._id] })
                    : t("members", { count: numeroMembros[comunidade._id] })
                  : t("loading")}
              </p>{" "}
              <Link
                to={`/community/${encodeURIComponent(
                  comunidade.country
                )}/${comunidade._id}`}
              >
                <button className={styles.signButtonSign}>{t("join")}</button>
              </Link>
            </div>
          ))}
        </Slider>
      ) : (
        <p className={styles.noCommunitiesMessage}>{t("noCommunities")}</p>
      )}
    </div>
  );
};

export default UserCommunitiesCard;

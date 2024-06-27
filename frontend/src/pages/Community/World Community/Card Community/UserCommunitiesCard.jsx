import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./OtherCommunityCard.module.css"; // Importar classes CSS do OtherCommunityCard
import customStyles from "../FirstWorld.module.css"; // Importar classes CSS do FirstWorldCountries
import { defaultSliderSettings } from "../sliderConfig"; // Importar configurações do slider

const UserCommunitiesCard = ({
  comunidadesUsuario,
  flagMappings,
  numeroMembros,
  t,
}) => {
  const [loading, setLoading] = useState(true);

  // Função para seta personalizada anterior
  const CustomPrevArrow = ({ onClick }) => (
    <div className={`${customStyles.customArrow} ${customStyles.prev}`} onClick={onClick}>
      {"\u2190"}
    </div>
  );

  // Função para seta personalizada seguinte
  const CustomNextArrow = ({ onClick }) => (
    <div className={`${customStyles.customArrow} ${customStyles.next}`} onClick={onClick}>
      {"\u2192"}
    </div>
  );

  const sliderSettings = {
    ...defaultSliderSettings,
    infinite: false,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Simula o tempo de carregamento dos dados
  }, []);

  return (
    <div className={customStyles.customSlider}>
      <h2 className={customStyles.CommunityTitle}>{t("Your Communities")}</h2>
      <hr className={customStyles.hrTop} />
      {loading ? (
        <p className={styles.loadingMessage}>{t("loading")}</p>
      ) : comunidadesUsuario.length > 0 ? (
        <Slider {...sliderSettings}>
          {comunidadesUsuario.map((comunidade) => (
            <div key={comunidade._id} className={styles.card}>
              <div
                className={styles.carousel}
                style={{
                  backgroundImage: `url(${
                    flagMappings[comunidade.country.toLowerCase()] ||
                    comunidade.image
                  })`,
                }}
              >
                <div className={styles.overlay}>
                  <span className={styles.countryName}>
                    {t(`${comunidade.country}`)}
                  </span>
                </div>
              </div>
              <div className={styles.cardContent}>
                {numeroMembros[comunidade._id] !== undefined ? (
                  <p className={styles.memberCount}>
                    {t("members", { count: numeroMembros[comunidade._id] })}
                  </p>
                ) : (
                  <p className={styles.memberCount}>{t("noCommunitiesUser")}</p>
                )}
                <Link
                  to={`/community/${encodeURIComponent(
                    comunidade.country
                  )}/${comunidade._id}`}
                >
                  <div className={styles.buttonContainer}>
                    <button className={styles.joinButton}>{t("join")}</button>
                  </div>
                </Link>
              </div>
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

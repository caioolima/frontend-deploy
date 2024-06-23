import React from 'react';
import { Link } from 'react-router-dom';

const OtherCommunityCard = ({ comunidade, numeroMembros, flagMappings, t}) => {
  const flagUrl = flagMappings[comunidade.country.toLowerCase()] || comunidade.image;

  // Verifica se a comunidade não é da Alemanha, Brasil ou Japão
  if (!["alemanha", "brasil", "japão","Itália","China"].includes(comunidade.country.toLowerCase())) {
    return (
      <section key={comunidade._id} className="card-community">
        <div
          className="image-country"
          style={{
            backgroundImage: `url(${flagUrl})`,
          }}
        ></div>
        <span>{t(`${comunidade.country}`)}</span>
        <p>
          {numeroMembros[comunidade._id] !== undefined
            ? numeroMembros[comunidade._id] === 1
              ? t("member", { count: numeroMembros[comunidade._id] })
              : t("members", { count: numeroMembros[comunidade._id] })
            : t("loading")}
        </p>
        <Link
          to={`/community/${encodeURIComponent(comunidade.country)}/${comunidade._id}`}
        >
          <button className="sign-button-sign">{t("join")}</button>
        </Link>
      </section>
    );
  } else {
    // Se for da Alemanha, Brasil ou Japão, não renderiza nada
    return null;
  }
};

export default OtherCommunityCard;

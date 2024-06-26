import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CommunityCard = ({ comunidade, numeroMembros, flagMappings, t, className }) => {
  const flagUrl = flagMappings[comunidade.country.toLowerCase()] || comunidade.image;

  return (
    <section key={comunidade._id} className={`card-community ${className}`}>
      <div className="image-country" style={{ backgroundImage: `url(${flagUrl})` }}></div>
      <span>{t(`${comunidade.country}`)}</span>
      <p>
        {numeroMembros[comunidade._id] !== undefined
          ? numeroMembros[comunidade._id] === 1
            ? t("member", { count: numeroMembros[comunidade._id] })
            : t("members", { count: numeroMembros[comunidade._id] })
          : t("loading")}
      </p>
      <Link to={`/community/${encodeURIComponent(comunidade.country)}/${comunidade._id}`}>
        <button className="sign-button-sign">{t("join")}</button>
      </Link>
    </section>
  );
};

export default CommunityCard;

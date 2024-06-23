import React from "react";
import { Link } from "react-router-dom";

const UserCommunitiesCard = ({ comunidadesUsuario, flagMappings, numeroMembros, t }) => {
  return (
    <div className="user-communities-card">
      <h2>{t("Your Communities")}</h2>
      <hr />
      <div className="communities-list">
        {comunidadesUsuario.map((comunidade) => {
          const flagUrl = flagMappings[comunidade.country.toLowerCase()] || comunidade.image;
          return (
            <div key={comunidade._id} className="card-community">
              <div
                className="image-country"
                style={{
                  backgroundImage: `url(${flagUrl})`,
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
                to={`/community/${encodeURIComponent(comunidade.country)}/${
                  comunidade._id
                }`}
              >
                <button className="sign-button-sign">{t("join")}</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserCommunitiesCard;

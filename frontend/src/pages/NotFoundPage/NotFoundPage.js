import React from "react";
import { useTranslation } from "react-i18next"; // Importar hook de tradução
import { Link } from "react-router-dom";

/* Estilos */
import "./NotFoundPage.css"; // Importe o arquivo de estilo CSS

function NotFoundPage() {
  const { t } = useTranslation(); // Hook de tradução

  return (
    <div>
      <div className="logo_term">
        <Link to="/home">{t("connecterLife")}</Link>
      </div>
      <hr />
      <div className="not-found-page">
        <div className="not-found-content">
          <h1>{t("not_found_title")}</h1> {/* Título traduzido */}
          <p>{t("not_found_message")}</p> {/* Mensagem traduzida */}
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;

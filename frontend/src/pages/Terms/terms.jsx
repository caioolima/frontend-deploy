import React from "react";
import { Link } from "react-router-dom"; // Importe Link para criar links
import imagemTermosServico from "../../assets/imagemTermosServico.jpg";
import imagemPoliticaPrivacidade from "../../assets/imagemPoliticaPrivacidade.jpg";
import imagemRegrasComunidade from "../../assets/imagemRegrasComunidade.jpg";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer/footer.jsx";
import "../Terms/terms.css"; // Supondo que seus estilos estejam em um arquivo chamado terms.css

function Terms() {
  const { t } = useTranslation();
  return (
    <div className="container-terms-container">
      <div className="logo-term">
        <Link to="/home">ConnecterLife</Link>
      </div>
      <hr />
      <div className="container">
        <p className="main-paragraph">{t("main_heading")}</p>
        <h1 className="main-heading">{t("sub_heading")}</h1>

        <h2 className="section-heading">{t("section_heading")}</h2>

        <div className="image-container">
          <div className="image-with-text">
            <Link to="/service">
              <img
                src={imagemTermosServico}
                alt="Termos de Serviço"
                className="term-image"
              />
              <p className="p">{t("heading")}</p>
              <p className="subp">{t("subheading")}</p>
            </Link>
          </div>

          <div className="image-with-text">
            <Link to="/privacy">
              <img
                src={imagemPoliticaPrivacidade}
                alt="Política de Privacidade"
                className="privacy-image"
              />
              <p className="p">{t("privacypolicy")}</p>
              <p className="subp">{t("informationcollection")}</p>
            </Link>
          </div>

          <div className="image-with-text">
            <img
              src={imagemRegrasComunidade}
              alt="Regras da Comunidade"
              className="community-image"
            />
            <p className="p">{t("communityrules")}</p>
            <p className="subp">{t("rulesandinstructions")}</p>
          </div>
        </div>
      </div>
      <div className="footer-reset-terms">
        <Footer />
      </div>
    </div>
  );
}


export default Terms;

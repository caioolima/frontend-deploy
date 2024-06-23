import React from "react";
import { Link } from "react-router-dom";
import "../Terms/service.css"; // Supondo que seus estilos estejam em um arquivo chamado termosDeServico.css
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer/footer.jsx";

function TermosDeServico() {
  const { t } = useTranslation();
  const userDataLoaded = true; // ou qualquer outra maneira de verificar se os dados do usuário foram carregados

  return (
    <>
      {userDataLoaded && (
        <div>
          <div className="logo_term">
            <Link to="/home">ConnecterLife</Link>
          </div>
          <hr />
          <div className="highlight">
            <p className="paragraph">{t("terms_of_service")}</p>

            <h1 className="description-text">
              <p>{t("description-text")}</p>
            </h1>
            {/* Seção 1 */}
            <div className="section">
              <h2>1. {t("servicesoffered")}</h2>
              <p>{t("mission")}</p>
            </div>

            {/* Seção 2 */}
            <div className="section">
              <h2>2. {t("tecnologies")}</h2>
              <p>{t("offerservices")}</p>
            </div>

            {/* Seção 3 */}
            <div className="section">
              <h2>3. {t("permissions")}</h2>
              <p>{t("sharingcontent")}</p>
            </div>

            {/* Seção 4 */}
            <div className="section">
              <h2>4. {t("reportingchannel")}</h2>
              <p>{t("userreport")}</p>
            </div>

            {/* Seção 5 */}
            <div className="section">
              <h2>5. {t("accountdeletion")}</h2>
              <p>{t("personaldeletion")}</p>
            </div>

            {/* Rodapé */}
            <p className="acknowledgment">{t("revisedterms")}</p>
            <p className="acknowledgment">{t("favoritecommunity")}</p>
          </div>
          <div className="footer-reset">
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}

export default TermosDeServico;

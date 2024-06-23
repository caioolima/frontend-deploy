import { t } from "i18next";
import "./styles.css";

export default function Articles() {
  return (
    <section className="container-overflow">
      <div className="images-field-top">
        <div className="cardContainerImageField">
          <div className="imagefieldContainer a1">
            <div className="textContainer">
              <span>{t("bestPlaces")}</span>
              <span>{t("toGoBackpacking")}</span>
            </div>
            <div className="black-block">
              <p>{t("discover")}</p>
              <button className="button-article">{t("seeNow")}</button>
            </div>
          </div>
        </div>
        <div className="cardContainerImageField">
          <div className="imagefieldContainer a2">
            <div className="textContainer">
              <span className="text-top-intro">{t("introduction")}</span>
              <span>
                {t("toTheLife")}{t("continuosLife")}
              </span>

              <span>{t("ofABackpacker")}</span>
            </div>
            <div className="black-block">
              <p>{t("comeAndDiscover")}</p>
              <button className="button-article">{t("seeNow")}</button>
            </div>
          </div>
        </div>
        <div className="cardContainerImageField">
          <div className="imagefieldContainer a3">
            <div className="textContainer">
              <span>{t("bestPlacesToGoBackpacking")}</span>
            </div>
            <div className="black-block">
              <p>{t("discoverTheBestWays")}</p>
              <button className="button-article">{t("seeNow")}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

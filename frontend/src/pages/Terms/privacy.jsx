import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Terms/privacy.css";
import Footer from "../../components/Footer/footer.jsx";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div>
      <div className="logo_term">
        <Link to="/home">{t("connecterLife")}</Link>
      </div>
      <hr />

      <div className="privacy-container">
        <div className="privacy-policy-container">
          <h1>{t("policyTitle")}</h1>

          <p className="date">{t("effectiveDate")}</p>

          <p>{t("introText")}</p>

          <button className="privacy-question" onClick={toggleAnswer}>
            {t("question1")}{" "}
            <span className={`arrow ${showAnswer ? "up" : "down"}`}>➔</span>
          </button>

          {showAnswer && <p className="privacy-answer">{t("answer")}</p>}

          <h2 className="privacy-section">{t("sectionOne")}</h2>
          <p className="privacy-content">{t("sectionOneContent")}</p>

          <h2 className="privacy-section">{t("sectionTwo")}</h2>
          <p className="privacy-content">{t("sectionTwoContent")}</p>

          <h2 className="privacy-section">{t("sectionThree")}</h2>
          <p className="privacy-content">{t("sectionThreeContent")}</p>

          <h2 className="privacy-section">{t("sectionFour")}</h2>
          <p className="privacy-content">{t("sectionFourContent")}</p>

          <h2 className="privacy-section">{t("sectionFive")}</h2>
          <p className="privacy-content">{t("sectionFiveContent")}</p>

          <h2 className="privacy-section">{t("sectionSix")}</h2>
          <p className="privacy-content">{t("sectionSixContent")}</p>

          <h2 className="privacy-section">{t("sectionSeven")}</h2>
          <p className="privacy-content">{t("sectionSevenContent")}</p>

          <h2 className="privacy-section">{t("sectionEight")}</h2>
          <p className="privacy-content">{t("sectionEightContent")}</p>

          <h2 className="privacy-section">{t("sectionNine")}</h2>
          <p className="privacy-content">{t("sectionNineContent")}</p>

          <p className="privacy-content">{t("contactEmail")}</p>
          <p className="privacy-content">{t("supportEmail")}</p>

          <h2 className="privacy-section">{t("brazilPrivacyNotice")}</h2>
          <p className="privacy-content">{t("brazilPrivacyNoticeContent")}</p>

          <p className="privacy-content">{t("dataController")}</p>
        </div>
      </div>
      <div className="footer-reset">
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;

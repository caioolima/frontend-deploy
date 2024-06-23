import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./NewPassword.css"; // Importe o arquivo de estilo
import Footer from "../../components/Footer/footer.jsx";

const NewPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage(t("passwords_do_not_match"));
      return;
    }

    try {
      const response = await fetch(
        `https://connecter-server-033a278d1512.herokuapp.com/auth/resetPassword/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        navigate("/home"); // Redireciona para a página de login após redefinir a senha
      }
    } catch (error) {
      setMessage(t("error_resetting_password"));
    }
  };
  document.body.style.position = "fixed";
  return (
    <div className="container-reset">
      <h1 className="title-reset">{t("reset_title_password")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-container-reset">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("new_password_placeholder")}
            required
          />
        </div>
        <div className="input-container-reset">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("confirm_password_placeholder")}
            required
          />
        </div>
        <div className="button-container-reset">
          <button type="submit">{t("reset_password")}</button>
        </div>
      </form>
      {message && <p className="message-reset">{message}</p>}
      <div className="footer-reset">
        <Footer />
      </div>
    </div>
  );
};

export default NewPassword;

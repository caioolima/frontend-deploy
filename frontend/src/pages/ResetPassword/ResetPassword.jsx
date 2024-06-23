import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./resets_password.css";
import Footer from "../../components/Footer/footer.jsx";

const ResetPassword = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validCode, setValidCode] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Estado para verificar se as senhas coincidem

  useEffect(() => {
    setMessage("");
  }, [email, code]);

  const handleErrors = async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(t(data.error) || t("unknown_error"));
    }
    return data;
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setSendingEmail(true);

    try {
      const response = await fetch(
        "https://connecter-server-033a278d1512.herokuapp.com/auth/requestPasswordReset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await handleErrors(response);
      setValidCode(true);
      setMessage(t("email_sent_successfully"));
    } catch (error) {
      setMessage(t("user_not_found"));
    } finally {
      setSendingEmail(false);
    }
  };

  const verifyCode = async () => {
    setVerifyingCode(true);

    try {
      const response = await fetch(`https://connecter-server-033a278d1512.herokuapp.com/auth/verifyCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: code.join("") }),
      });

      const data = await handleErrors(response);
      if (data.success) {
        setShowPasswordFields(true);
        setMessage("");
      } else {
        setMessage(t("unknown_error"));
      }
    } catch (error) {
      setMessage(t("code_invalid"));
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResettingPassword(true);

    try {
      const response = await fetch(
        `https://connecter-server-033a278d1512.herokuapp.com/auth/resetPassword/${code.join("")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await handleErrors(response);
      setMessage(t("password_changed"));
      setValidCode(false);

      setEmail("");
      setCode(Array(6).fill(""));
      setPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
      navigate("/home");
    } catch (error) {
      setMessage(t("error_resetting_password"));
    } finally {
      setResettingPassword(false);
    }
  };

  const handleCodeChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "") {
      if (index > 0) {
        document.getElementById(`code-input-${index - 1}`).focus();
      }
    } else if (e.key.length === 1 && e.key.match(/[0-9]/)) {
      handleCodeChange(index, e.key);
      if (index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  // Função para verificar se as senhas coincidem
  const checkPasswordsMatch = () => {
    setPasswordsMatch(password === confirmPassword);
  };
  // Efeito para verificar se as senhas coincidem sempre que houver mudança nos campos de senha
  useEffect(() => {
    checkPasswordsMatch();
  }, [password, confirmPassword]);
  return (
    <div>
      <div className="logo_term">
        <Link to="/home">Connecter Life</Link>
      </div>
      <hr />
      <div className="container-form">
        {!validCode && (
          <>
            <h1 className="title">{t("reset_password_title")}</h1>
            <p className="description">{t("reset_password_description")}</p>
          </>
        )}

        {!validCode && (
          <form onSubmit={resetPassword}>
            <input
              className="email-input"
              type="email"
              placeholder={t("email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button id="submit-button" type="submit" disabled={sendingEmail}>
              {sendingEmail ? t("sending_email") : t("send_recovery_email")}
            </button>
            {message && <p className="message">{message}</p>}
          </form>
        )}

        {validCode && !showPasswordFields && (
          <form onSubmit={handleResetPassword} className="code-form">
            <p className="code-instruction">{t("enter_received_code")}</p>
            <div className="code-inputs">
              {code.map((value, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  className="code-input"
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                />
              ))}
            </div>
            <button
              className="verify-button"
              type="button"
              onClick={verifyCode}
              disabled={verifyingCode}
            >
              {verifyingCode ? t("verifying_code") : t("verify_code")}
            </button>
            {message && <p className="message">{message}</p>}
          </form>
        )}

        {showPasswordFields && (
          <form onSubmit={handleResetPassword} className="password-form">
            <p className="password-instruction">{t("enter_new_password")}</p>
            <input
              className="password-input"
              type="password"
              placeholder={t("new_password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="password-input"
              type="password"
              placeholder={t("confirm_password_placeholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              className="verify-button"
              type="submit"
              disabled={resettingPassword || !passwordsMatch} // Desabilitar o botão se as senhas não coincidirem ou se estiver redefinindo a senha
            >
              {resettingPassword
                ? t("resetting_password")
                : t("reset_password")}
            </button>{" "}
            {!passwordsMatch && (
              <p className="message">{t("passwords_do_not_match")}</p>
            )}
          </form>
        )}
      </div>
      <div className="footer-reset">
        <Footer />
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router-dom";
import "../Form/form.css";
import axios from "axios";
import { useAuth } from "../../hooks/use-auth";

Modal.setAppElement("#root");

const initialState = {
  username: "",
  firstName: "",
  lastName: "",
  phone: "", // Remova o campo phone e adicione country
  country: "BR", // Defina o país inicial (Brasil, neste exemplo)
  email: "",
  password: "",
  confirmPassword: "",
  dob: "",
  gender: "masculino",
};

function LoginForm() {
  const { t } = useTranslation();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [formFields, setFormFields] = useState(initialState); // Defina um estado para os campos do formulário
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const { signIn } = useAuth();

  const eyeClosedIcon = "\u{1F441}\u{FE0F}";
  const eyeOpenIcon = "\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}";

  const [loginFormEmail, setLoginFormEmail] = useState("");
  const [loginFormPassword, setLoginFormPassword] = useState("");

  const [registrationFormEmail, setRegistrationFormEmail] = useState("");
  const [registrationFormPassword, setRegistrationFormPassword] = useState("");

  const handleLoginEmailChange = (event) => {
    setLoginFormEmail(event.target.value);
    setLoginErrorMessage(""); // Limpar a mensagem de erro ao digitar no campo de e-mail
  };

  const handleLoginPasswordChange = (event) => {
    setLoginFormPassword(event.target.value);
    setLoginErrorMessage(""); // Limpar a mensagem de erro ao digitar no campo de senha
  };

  const handleRegistrationEmailChange = (event) => {
    setRegistrationFormEmail(event.target.value);
  };

  const handleRegistrationPasswordChange = (event) => {
    setRegistrationFormPassword(event.target.value);
  };

  // Função para redefinir os campos do formulário para os valores iniciais
  const resetFormFields = () => {
    setFormFields(initialState);
  };

  const [shouldCloseModal, setShouldCloseModal] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    setShowConfirmPassword(false); // Definir showConfirmPassword como false ao abrir o modal
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} with value: ${value}`);

    if (typeof value === "object" && value.phone) {
      setFormFields({
        ...formFields,
        phone: value.phone,
        country: value.country || formFields.country,
      });
    } else {
      setFormFields({ ...formFields, [field]: value });
    }

    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setRegistrationFormEmail("");
    setRegistrationFormPassword("");
    setFormFields({ ...formFields, confirmPassword: "" }); // Limpar o campo de confirmação de senha
    setShowConfirmPassword(false); // Atualizar o estado do olho para fechado ao fechar o modal
    setShowPassword2(false); // Atualizar o estado do olho para fechado ao fechar o modal
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 480;
      const modalWidth = isMobile
        ? "100%"
        : window.innerWidth <= 600
        ? "88%"
        : "70%";
      const modalHeight = isMobile
        ? "100%"
        : window.innerWidth >= 480
        ? "88%"
        : "100%";

      setModalStyle({
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        borderRadius: "12px",
        maxWidth: "90%", // Define a largura máxima como uma porcentagem
        maxHeight: "90%", // Define a altura máxima como uma porcentagem
        overflow: "auto", // Permite rolagem se o conteúdo exceder o tamanho do modal
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Verifique se shouldCloseModal está definido antes de utilizá-lo
    if (shouldCloseModal !== undefined && shouldCloseModal) {
      setIsOpen(false);
      document.body.style.overflow = "auto";
      setShouldCloseModal(false);
    }
  }, [shouldCloseModal]);

  const [modalStyle, setModalStyle] = useState({
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    padding: "20px",
    overflow: "auto",
  });

  const handleForgotPasswordClick = () => {
    navigate("/reset");
  };

  const validateAge = () => {
    const today = new Date();
    const dobDate = new Date(formFields.dob);
    let age = today.getFullYear() - dobDate.getFullYear();

    if (age < 18) {
      return t("age_restriction_error");
    }

    return null;
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  // No JSX, você pode definir o tipo de entrada com base no estado showPassword2
  <input
    type={showPassword2 ? "text" : "password"}
    className={`entrada ${formErrors.password && "input-error"}`}
    id="password"
    placeholder={t("password")}
    value={registrationFormPassword}
    onChange={handleRegistrationPasswordChange}
    required
  />;

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordInputType = showPassword ? "text" : "password";

  const handleRegisterButtonClick = async () => {
    setRegistrationMessage("");
    setFormErrors({});
    setShouldCloseModal(false);
    const errors = {};

    const validateEmail = () => {
      const validEmailDomains = ["outlook.com", "gmail.com", "hotmail.com"];
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      const ageError = !formFields.dob
        ? t("dob_required_error")
        : validateAge();
      if (ageError) {
        errors.dob = ageError;
      }

      if (!emailRegex.test(registrationFormEmail)) {
        return t("invalid_email_error");
      }

      const [, emailDomain] = registrationFormEmail.split("@");

      if (!validEmailDomains.includes(emailDomain.toLowerCase())) {
        return t("valid_email_domains_error");
      }

      return null;
    };

    errors.username =
      formFields.username.length < 3 ? t("username_length_error") : null;
    errors.firstName =
      formFields.firstName.length < 3 ? t("first_name_length_error") : null;
    errors.lastName =
      formFields.lastName.length < 3 ? t("last_name_length_error") : null;

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    errors.password = !registrationFormPassword
      ? t("password_required_error")
      : !passwordRegex.test(registrationFormPassword)
      ? t("password_complexity_error")
      : null;

    errors.confirmPassword = !formFields.confirmPassword
      ? t("confirm_password_required_error")
      : registrationFormPassword !== formFields.confirmPassword
      ? t("password_mismatch_error")
      : null;

    errors.phone = !formFields.phone
      ? t("phone_required_error")
      : formFields.phone.length < 3
      ? t("phone_length_error")
      : null;

    const emailError = validateEmail();
    if (emailError) {
      errors.email = emailError;
    }

    if (Object.values(errors).some((error) => error)) {
      setFormErrors(errors);
      return;
    }

    try {
      if (formFields.username !== initialState.username) {
        const userAvailability = await checkFieldAvailability(
          "username",
          formFields.username
        );
        if (!userAvailability.available) {
          setRegistrationMessage(t("username_not_available_error"));
          return;
        }
      }

      if (formFields.phone !== initialState.phone) {
        const phoneAvailability = await checkFieldAvailability(
          "phone",
          formFields.phone
        );
        if (!phoneAvailability.available) {
          setRegistrationMessage(t("phone_not_available_error"));
          return;
        }
      }

      if (registrationFormEmail !== initialState.email) {
        const emailAvailability = await checkFieldAvailability(
          "email",
          registrationFormEmail
        );
        if (!emailAvailability.available) {
          setRegistrationMessage(t("email_not_available_error"));
          return;
        }
      }

      const response = await axios.post(
        "https://connecter-server-033a278d1512.herokuapp.com/auth/register",
        {
          username: formFields.username,
          firstName: formFields.firstName,
          lastName: formFields.lastName,
          phone: formFields.phone,
          email: registrationFormEmail,
          password: registrationFormPassword,
          confirmPassword: formFields.confirmPassword,
          dob: formFields.dob,
          gender: formFields.gender,
        }
      );

      if (response.data.success) {
        console.log("Cadastro bem-sucedido!");
        setRegistrationMessage(t("registration_success_message"));

        // Limpar os campos de email e senha
        setRegistrationFormEmail("");
        setRegistrationFormPassword("");

        // Aguarda 2 segundos antes de limpar a mensagem
        setTimeout(() => {
          setRegistrationMessage("");
        }, 3000); // 2000 milissegundos = 2 segundos

        // Aguarda mais 2 segundos antes de fechar o modal
        setTimeout(() => {
          setShouldCloseModal(true);
          resetFormFields(); // Atualize o estado para indicar que o modal deve ser fechado
        }, 4000); // 4000 milissegundos = 4 segundos (2 segundos para a mensagem + 2 segundos para fechar o modal)

        return;
      } else {
        setRegistrationMessage(t("registration_error_message"));
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setRegistrationMessage(t("registration_error_message"));
    }
  };
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const handleLoginButtonClick = async () => {
    setRegistrationMessage("");
    setFormErrors({});
    setLoginErrorMessage("");

    try {
      if (!loginFormEmail || !loginFormPassword) {
        throw new Error(t("required_fields_error"));
      }

      const response = await signIn({
        email: loginFormEmail,
        password: loginFormPassword,
      });

      navigate(`/profile/${response.userId}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setLoginErrorMessage(error.response.data.error);
      } else if (error.message) {
        // Se um erro customizado foi lançado (por exemplo, campos obrigatórios não preenchidos)
        setLoginErrorMessage(error.message);
      } else {
        console.error("Erro durante o login:", error);
        setLoginErrorMessage(t("internal_server_error"));
      }
    }
  };

  // Função para verificar a disponibilidade de um campo específico
  const checkFieldAvailability = async (fieldName, value, t) => {
    try {
      const response = await axios.post(
        `https://connecter-server-033a278d1512.herokuapp.com/auth/checkAvailability`,
        {
          fieldName,
          value,
        }
      );

      return response.data; // Deve conter uma propriedade "available" indicando se está disponível ou não
    } catch (error) {
      console.error(t(`Error checking availability of ${fieldName}:`), error);
      return { available: false }; // Em caso de erro, considerar como não disponível
    }
  };
  return (
    <section className="form-side">
      <div
        className={`form ${
          loginMessage || registrationMessage ? "error-visible" : ""
        }`}
      >
        <input
          id="email-login"
          type="text"
          className={`entrada ${formErrors.email && "input-error"}`}
          placeholder={t("enter_email")}
          value={loginFormEmail}
          onChange={(e) => {
            handleLoginEmailChange(e);
            setLoginMessage("");
          }}
          required
        />

        <div class="password-input-container">
          <input
            type={passwordInputType}
            className={`entrada ${formErrors.password && "input-error"}`}
            id="password-login"
            placeholder={t("enter_password")}
            value={loginFormPassword}
            onChange={(e) => {
              handleLoginPasswordChange(e);
              setLoginMessage("");
            }}
            required
          />
          <button
            className={`toggle-password-button ${
              formErrors.password && "error-visible"
            }`}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? eyeClosedIcon : eyeOpenIcon}
          </button>
        </div>
        <button
          id="loginButton"
          value="Sign In"
          className="entrada pink"
          onClick={handleLoginButtonClick}
        >
          {t("login")}
        </button>
        {loginErrorMessage && (
          <p className="login-message">{loginErrorMessage}</p>
        )}

        <span
          onClick={handleForgotPasswordClick}
          className="forgot-password-link"
        >
          {t("forgot_password")}
        </span>
        <div className="line"></div>
        <button
          id="create-account-button"
          type="button"
          className="white-btn"
          onClick={handleOpenModal}
        >
          {t("create_account")}
        </button>
      </div>
      <div className="help">
        <p>
          {t("need_help")}
          <a href="/#"> {t("click_here")}.</a>
        </p>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        style={{ content: modalStyle }}
      >
        <div className="popup">
          <div
            className={`popup-content ${
              Object.values(formErrors).some((error) => error)
                ? "error-visible"
                : ""
            }`}
          >
            <div className="close-button" onClick={handleCloseModal}>
              x
            </div>
            <h2>{t("register_now")}</h2>
            <p>{t("free_and_fast")}</p>
            <form>
              <input
                type="text"
                className={`entrada ${formErrors.username && "input-error"}`}
                id="username"
                placeholder={t("username")}
                value={formFields.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
              {formErrors.username && (
                <p className="error-message">{formErrors.username}</p>
              )}

              <div className="flex-container">
                <div className="flex-item">
                  <input
                    type="text"
                    className={`entrada ${
                      formErrors.firstName && "input-error"
                    }`}
                    id="firstName"
                    placeholder={t("first_name")}
                    value={formFields.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                  {formErrors.firstName && (
                    <p className="error-message">{formErrors.firstName}</p>
                  )}
                </div>
                <div className="flex-item">
                  <input
                    type="text"
                    className={`entrada ${
                      formErrors.lastName && "input-error"
                    }`}
                    id="lastName"
                    placeholder={t("last_name")}
                    value={formFields.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                  {formErrors.lastName && (
                    <p className="error-message">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <PhoneInput
                placeholder={t("phone")}
                value={formFields.phone}
                onChange={(value) => handleInputChange("phone", value)}
              />
              {formErrors.phone && (
                <p className="error-message">{formErrors.phone}</p>
              )}

              <input
                type="email"
                className={`entrada ${formErrors.email && "input-error"}`}
                id="email"
                placeholder={t("email")}
                value={registrationFormEmail}
                onChange={(e) => {
                  handleRegistrationEmailChange(e);
                  setFormErrors({ ...formErrors, email: "" }); // Limpar a mensagem de erro ao digitar no campo de e-mail
                }}
                required
              />
              {formErrors.email && (
                <p
                  className={`error-message ${
                    formErrors.email && "input-error"
                  }`}
                >
                  {formErrors.email}
                </p>
              )}

              <div className="password-input-container">
                <input
                  type={showPassword2 ? "text" : "password"}
                  className={`entrada ${formErrors.password && "input-error"}`}
                  id="password"
                  placeholder={t("password")}
                  value={registrationFormPassword}
                  onChange={(e) => {
                    handleRegistrationPasswordChange(e);
                    setFormErrors({ ...formErrors, password: "" }); // Limpar a mensagem de erro ao digitar no campo de senha
                  }}
                  required
                />

                {formErrors.password && (
                  <p className="error-message">{formErrors.password}</p>
                )}
                <button
                  className="toggle-password-button-two"
                  onClick={togglePasswordVisibility2}
                >
                  {showPassword2 ? eyeClosedIcon : eyeOpenIcon}
                </button>
              </div>

              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`entrada ${
                    formErrors.confirmPassword && "input-error"
                  }`}
                  id="confirmPassword"
                  placeholder={t("confirm_password")}
                  value={formFields.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                />
                <button
                  className="toggle-password-button-three"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? eyeClosedIcon : eyeOpenIcon}
                </button>
              </div>

              {formErrors.confirmPassword && (
                <p className="error-message">{formErrors.confirmPassword}</p>
              )}

              <label htmlFor="dob" className="with-placeholder">
                {t("dob_label")}
              </label>
              <input
                type="date"
                id="dob"
                max="2005-01-01"
                required
                onChange={(e) => handleInputChange("dob", e.target.value)}
              />

              {formErrors.dob && (
                <p className="error-message">{formErrors.dob}</p>
              )}

              <label htmlFor="gender" className="with-placeholder">
                {t("select_gender_label")}
              </label>
              <select
                id="gender"
                name="gender"
                value={formFields.gender}
                required
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option value="masculino">{t("male")}</option>
                <option value="feminino">{t("female")}</option>
                <option value="outro">{t("other")}</option>
              </select>

              <button
                className="signuping"
                type="button"
                onClick={handleRegisterButtonClick}
              >
                {t("register_button")}
              </button>
              {registrationMessage && (
                <p className="registration-message">{registrationMessage}</p>
              )}
            </form>
          </div>
        </div>
      </Modal>
    </section>
  );
}

export default LoginForm;

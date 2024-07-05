import React from 'react'
import Modal from "react-modal";
import PhoneInput from "react-phone-number-input";
import style from '../form.module.css'

import "react-phone-number-input/style.css";
const Form_Side = (
  {
    t,
    loginMessage,
    loginFormEmail,
    loginFormPassword,
    loginErrorMessage,
    setFormErrors,
    registrationMessage,
    registrationFormEmail,
    registrationFormPassword,
    formErrors,
    formFields,
    passwordInputType,
    setLoginMessage,
    handleLoginEmailChange,
    handleLoginPasswordChange,
    handleLoginButtonClick,
    handleForgotPasswordClick,
    handleOpenModal,
    handleCloseModal,
    handleInputChange,
    handleRegistrationEmailChange,
    handleRegistrationPasswordChange,
    handleRegisterButtonClick,
    togglePasswordVisibility,
    togglePasswordVisibility2,
    toggleConfirmPasswordVisibility,
    showPassword,
    showPassword2,
    showConfirmPassword,
    eyeClosedIcon,
    eyeOpenIcon,
    modalIsOpen,
    modalStyle,
  }) => {

    Modal.setAppElement("#root");

  return (
    <section className={style["form-side"]}>
      <div
        className={style.form || style[loginMessage || registrationMessage ? "error-visible" : ""] 
        }
      >
        <input
          id="email-login"
          type="text"
          className={style.entrada || style[formErrors.email && "input-error"]}
          placeholder={t("enter_email")}
          value={loginFormEmail}
          onChange={(e) => {
            handleLoginEmailChange(e);
            setLoginMessage("");
          }}
          required
        />

        <div class={style["password-input-container"]}>
          <input
            type={passwordInputType}
            className={style.entrada || style[formErrors.password && "input-error"]}
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
            className={style["toggle-password-button"] || style[formErrors.password && "error-visible"]}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? eyeClosedIcon : eyeOpenIcon}
          </button>
        </div>


        <button
          id="loginButton"
          value="Sign In"
          className={style.entrada && style.pink}
          onClick={handleLoginButtonClick}
        >
          {t("login")}
        </button>
        {loginErrorMessage && (
          <p className={style["login-message"]}>{loginErrorMessage}</p>
        )}

        <span
          onClick={handleForgotPasswordClick}
          className={style["forgot-password-link"]}
        >
          {t("forgot_password")}
        </span>
        <div className={style["line"]}></div>
        <button
          id="create-account-button"
          type="button"
          className={style["white-btn"]}
          onClick={handleOpenModal}
        >
          {t("create_account")}
        </button>
      </div>
      <div className={style["help"]}>
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
        <div className={style["popup"]}>
          <div
            className={
              style["popup-content"] || 
              style[Object.values(formErrors).some((error) => error)
              ? "error-visible"
              : ""]}
          >
            <div className={style["close-button"]} onClick={handleCloseModal}>
              x
            </div>
            <h2>{t("register_now")}</h2>
            <p>{t("free_and_fast")}</p>
            <form>
              <input
                type="text"
                className={style.entrada || style[formErrors.username && "input-error"]}
                id="username"
                placeholder={t("username")}
                value={formFields.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
              {formErrors.username && (
                <p className={style["error-message"]}>{formErrors.username}</p>
              )}

              <div className={style["flex-container"]}>
                <div className={style["flex-item"]}>
                  <input
                    type="text"
                    className={style.entrada || style[
                      formErrors.firstName && "input-error"
                    ]}
                    id="firstName"
                    placeholder={t("first_name")}
                    value={formFields.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                  {formErrors.firstName && (
                    <p className={style["error-message"]}>{formErrors.firstName}</p>
                  )}
                </div>
                <div className={style["flex-item"]}>
                  <input
                    type="text"
                    className={style.entrada || style[
                      formErrors.lastName && "input-error"
                    ]}
                    id="lastName"
                    placeholder={t("last_name")}
                    value={formFields.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                  {formErrors.lastName && (
                    <p className={style["error-message"]}>{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <PhoneInput
                placeholder={t("phone")}
                value={formFields.phone}
                onChange={(value) => handleInputChange("phone", value)}
              />
              {formErrors.phone && (
                <p className={style["error-message"]}>{formErrors.phone}</p>
              )}

              <input
                type="email"
                className={style.entrada || style[formErrors.email && "input-error"]}
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
                  className={style["error-message"] || style[
                    formErrors.email && "input-error"
                  ]}
                >
                  {formErrors.email}
                </p>
              )}

              <div className={style["password-input-container"]}>
                <input
                  type={showPassword2 ? "text" : "password"}
                  className={style.entrada || style[formErrors.password && "input-error"]}
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
                  <p className={style["error-message"]}>{formErrors.password}</p>
                )}
                <button
                  className={style["toggle-password-button-two"]}
                  onClick={togglePasswordVisibility2}
                >
                  {showPassword2 ? eyeClosedIcon : eyeOpenIcon}
                </button>
              </div>

              <div className={style["password-input-container"]}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={style.entrada || style[
                    formErrors.confirmPassword && "input-error"
                  ]}
                  id="confirmPassword"
                  placeholder={t("confirm_password")}
                  value={formFields.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                />
                <button
                  className={style["toggle-password-button-three"]}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? eyeClosedIcon : eyeOpenIcon}
                </button>
              </div>

              {formErrors.confirmPassword && (
                <p className={style["error-message"]}>{formErrors.confirmPassword}</p>
              )}

              <label htmlFor="dob" className={style["with-placeholder"]}>
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
                <p className={style["error-message"]}>{formErrors.dob}</p>
              )}

              <label htmlFor="gender" className={style["with-placeholder"]}>
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
                className={style["signuping"]}
                type="button"
                onClick={handleRegisterButtonClick}
              >
                {t("register_button")}
              </button>
              {registrationMessage && (
                <p className={style["registration-message"]}>{registrationMessage}</p>
              )}
            </form>
          </div>
        </div>
      </Modal>
    </section>
  )
}

export default Form_Side
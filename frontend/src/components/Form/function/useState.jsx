import React, { useState} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/use-auth";


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

const modalStyleObj = {
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
}
  
const UseState = () => {
    const { t } = useTranslation();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState("");
    const [loginMessage, setLoginMessage] = useState("");
    const [formFields, setFormFields] = useState(initialState); 
    // [formFields-setFormFields] Defina um estado para os campos do formulário
    const [formErrors, setFormErrors] = useState({});
    const [loginFormEmail, setLoginFormEmail] = useState("");
    const [loginFormPassword, setLoginFormPassword] = useState("");
    const [registrationFormEmail, setRegistrationFormEmail] = useState("");
    const [registrationFormPassword, setRegistrationFormPassword] = useState("");
    const [shouldCloseModal, setShouldCloseModal] = useState(false);
    const [modalStyle, setModalStyle] = useState(modalStyleObj);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState("");

    const navigate = useNavigate();
    const { signIn } = useAuth();

    const eyeClosedIcon = "\u{1F441}\u{FE0F}";
    const eyeOpenIcon = "\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F}";





  return {
    t, initialState,
    modalIsOpen, setIsOpen,
    registrationMessage, setRegistrationMessage,
    loginMessage, setLoginMessage,
    formFields, setFormFields,
    formErrors, setFormErrors,
    loginFormEmail, setLoginFormEmail,
    loginFormPassword, setLoginFormPassword,
    registrationFormEmail, setRegistrationFormEmail,
    registrationFormPassword, setRegistrationFormPassword,
    shouldCloseModal, setShouldCloseModal,
    modalStyle, setModalStyle,
    showPassword, setShowPassword,
    showPassword2, setShowPassword2,
    showConfirmPassword, setShowConfirmPassword,
    loginErrorMessage, setLoginErrorMessage,
    navigate,
    signIn,
    eyeClosedIcon,
    eyeOpenIcon
  }
}

export default UseState
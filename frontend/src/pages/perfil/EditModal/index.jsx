import React, { useState } from "react";
import styles from "./style.module.css";
import TextField from "@mui/material/TextField";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useMyContext } from "../../../contexts/profile-provider";
import useModalEdit from "../hooks/useModalEdit.jsx";

const EditModal = () => {
  const {
    newUsername,
    setNewUsername,
    usernameError,
    newBiography,
    setNewBiography,
    isTextFieldFocused,
    setIsTextFieldFocused,
    modalFullName,
    setModalFullName,
    modalDateOfBirth,
    phoneNumber,
    countryCode,
    phoneError,
    setEditMode,
  } = useMyContext();

  const {
    handleSaveEdit,
    handleChangePhoneNumber,
    handleCloseModal,
    handleDeleteBiography,
  } = useModalEdit();

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const openConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(true);
  };

  const closeConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(false);
  };

  const handleSaveEdits = () => {
    if (newBiography === "") {
      openConfirmDeleteModal();
    } else {
      handleSaveEdit();
    }
  };

  const handleChange = (e) => {
    setNewBiography(e.target.value);
    e.target.style.height = "auto"; // Reseta a altura para calcular a altura necessária
    e.target.style.height = `${e.target.scrollHeight}px`; // Define a altura com base no conteúdo
  };

  document.body.style.overflow = "hidden";

  return (
    <div className={styles["modal-edit"]}>
      <div className={styles["modal-content-edit"]}>
        <button
          className={styles["modal-close-edit-button"]}
          onClick={() => {
            setEditMode(false);
            handleCloseModal();
          }}
        >
          X
        </button>

        <div className={styles["text-edit"]}>
          <label>Nome de usuário:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className={styles["edit-input"]}
          />
          {usernameError && (
            <p className={styles["error_message"]}>{usernameError}</p>
          )}
        </div>
        <div className={styles.bio_text_edit}>
          <label htmlFor="biography">Biografia:</label>
          <textarea
            id="biography"
            rows={4}
            value={newBiography}
            onChange={handleChange}
            className={styles["edit-input"]}
            style={{ marginTop: "10px" }}
          />
        </div>

        <div className={styles["text-edit"]}>
          <label>Nome Completo:</label>
          <input
            type="text"
            value={modalFullName}
            onChange={(e) => setModalFullName(e.target.value)}
            className={styles["edit-input"]}
            disabled
          />
        </div>
        <div className={styles["text-edit"]}>
          <label>Data de Nascimento:</label>
          <p className={styles["black-text"]}>
            {new Date(modalDateOfBirth).toLocaleDateString()}
          </p>
        </div>
        <div className={styles["text-edit"]}>
          <label>Número de Telefone:</label>
          <PhoneInput
            placeholder="Número de Telefone"
            value={phoneNumber}
            onChange={handleChangePhoneNumber}
            inputClassName={`${styles["phone-input"]} ${
              phoneError ? styles["error_message"] : ""
            }`}
          />
          {phoneError && (
            <p className={styles["error_message"]}>{phoneError}</p>
          )}
        </div>

        <div className={styles["save-button-container"]}>
          <button
            className={`${styles["save-button"]} ${
              !newUsername ? styles["disabled"] : ""
            }`}
            onClick={handleSaveEdits}
            disabled={!newUsername}
          >
            Salvar
          </button>
        </div>

        {/* Modal de confirmação de exclusão de biografia */}
        {showConfirmDeleteModal && (
          <div className={styles["confirm-delete-modal"]}>
            <p>Você realmente deseja excluir sua biografia?</p>
            <button onClick={handleDeleteBiography}>Sim</button>
            <button
              onClick={closeConfirmDeleteModal}
              className={styles["cancel-button-bio"]}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditModal;

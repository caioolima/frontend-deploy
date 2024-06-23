import { useState } from "react";
import "./style.css";
import TextField from "@mui/material/TextField";
import PhoneInput from "react-phone-number-input";
import { useMyContext } from "../../../contexts/profile-provider";
import useModalEdit from "../hooks/useModalEdit.jsx";

const EditModal = () => {
  // context com todos os estados do userProfile requisitados do profile-provider.jsx
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

  // hook com todas as funções do modal requisitadas do useModalEdit.jsx
  const {
    handleSaveEdit,
    handleChangePhoneNumber,
    handleCloseModal,
    handleDeleteBiography,
  } = useModalEdit();

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  // Função para abrir o modal de confirmação de exclusão de biografia
  const openConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(true);
  };

  // Função para fechar o modal de confirmação de exclusão de biografia
  const closeConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(false);
  };
  // Função para salvar as edições
  const handleSaveEdits = () => {
    // Verifica se a biografia está vazia e exibe o modal de confirmação de exclusão se estiver
    if (newBiography === "") {
      openConfirmDeleteModal();
    } else {
      handleSaveEdit(); // Salva as edições
    }
  };
  document.body.style.overflow = "hidden";
  return (
    <div className="modal-edit">
      <div className="modal-content-edit">
        <button
          className="modal-close-edit-button"
          onClick={() => {
            setEditMode(false);
            handleCloseModal();
          }}
        >
          Fechar
        </button>

        <div className="text-edit">
          <label>Nome de usuário:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="edit-input"
          />
          {usernameError && <p className="error_message">{usernameError}</p>}
        </div>

        <div className="bio_text_edit">
          <label htmlFor="biography">Biografia:</label>
          <TextField
            id="biography"
            multiline
            rows={4}
            value={newBiography}
            onChange={(e) => setNewBiography(e.target.value)}
            onFocus={() => setIsTextFieldFocused(true)}
            onBlur={() => setIsTextFieldFocused(false)}
            className={isTextFieldFocused ? "focused-textfield" : ""}
            style={{ marginTop: "10px" }}
          />
        </div>

        <div className="text-edit">
          <label>Nome Completo:</label>
          <input
            type="text"
            value={modalFullName} // Use o estado correspondente aqui
            onChange={(e) => setModalFullName(e.target.value)}
            className="edit-input"
            disabled
          />
        </div>
        <div className="text-edit">
          <label>Data de Nascimento:</label>
          <p className="black-text">
            {new Date(modalDateOfBirth).toLocaleDateString()}
          </p>
        </div>
        <div className="text-edit">
          <label>Número de Telefone:</label>
          <PhoneInput
            placeholder="Número de Telefone"
            value={phoneNumber}
            onChange={handleChangePhoneNumber} // Aqui está a alteração
            defaultCountry={countryCode}
          />
          {phoneError && <p className="error_message">{phoneError}</p>}
        </div>

        <button
          className={`save-button ${!newUsername ? "disabled" : ""}`}
          onClick={handleSaveEdits}
          disabled={!newUsername}
        >
          Salvar
        </button>

        {/* Modal de confirmação de exclusão de biografia */}
        {showConfirmDeleteModal && (
          <div className="confirm-delete-modal">
            <p>Você realmente deseja excluir sua biografia?</p>
            <button onClick={handleDeleteBiography}>Sim</button>
            <button onClick={closeConfirmDeleteModal} className="cancel-button-bio">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditModal;

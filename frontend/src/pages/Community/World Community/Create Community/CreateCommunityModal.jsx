import React, { useState, useEffect } from "react";
import { useMyContext } from "../../../../contexts/profile-provider.jsx";
import { useTranslation } from "react-i18next";
import styles from "./ModalCreate.module.css"; // Importe os estilos CSS modules para o modal
import { useAuth } from "../../../../hooks/use-auth.js";
import { storage } from "../../../../components/Firebase/storage.js"; // Importe a instância do Firebase Storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FaPlus } from "react-icons/fa"; // Importe o ícone de mais

const CreateCommunityModal = () => {
  const { t } = useTranslation();
  const { isCreateCommunityModalOpen, setIsCreateCommunityModalOpen } =
    useMyContext();
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleNomeChange = (e) => setNome(e.target.value);
  const handleImagemChange = (e) => setImagem(e.target.files[0]);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  const handleCloseModal = () => {
    setIsCreateCommunityModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("Usuário não autenticado.");
      return;
    }

    setIsLoading(true);

    let imageUrl = null;

    if (imagem) {
      const storageRef = ref(storage, `imagens/${imagem.name}`);
      try {
        await uploadBytesResumable(storageRef, imagem);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error.message);
        setIsLoading(false);
        return;
      }
    }

    const formData = {
      country: nome,
      image: imageUrl,
      userId: userId,
    };

    try {
      const response = await fetch(
        "https://connecter-server-033a278d1512.herokuapp.com/communities/comunidade/criar/" +
          nome,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        console.log("Comunidade criada com sucesso.");
        handleCloseModal();
        window.location.reload();
      } else {
        console.error("Erro ao criar comunidade:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao criar comunidade:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isCreateCommunityModalOpen) return null;

  return (
    <div className={styles.modalOverlayCreate}>
      <div className={styles.modalContentCreate}>
        <h2>{t("create_community_title")}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            {t("community_name")}
            <input
              type="text"
              value={nome}
              onChange={handleNomeChange}
              required
            />
          </label>
          <label>{t("community_image")}</label>
          <label htmlFor="fileInput" className={styles.fileInputLabel}>
            <FaPlus className={styles.fileInputIcon} />
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={handleImagemChange}
            accept="image/*"
            className={styles.fileInput}
          />
          <div className={styles.modalButtonsCreate}>
            <button type="button" onClick={handleCloseModal}>
              {t("cancel")}
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? t("creating") : t("create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;

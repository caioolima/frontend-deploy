import "./styles/style.css";
import { useMyContext } from "../../../contexts/profile-provider";
import useUploadModal from "../hooks/useUploadModal";
import ButtonClosed from "./ButtonClosed.jsx";
import ButtonPublish from "./ButtonPublish.jsx";
import Loading from "./Loading.jsx";
import { useTranslation } from "react-i18next";

const UploadPhotoModal = () => {
  const { t } = useTranslation(); // Usando o hook useTranslation para tradução
  const { selectedImage, uploadInProgress } = useMyContext();

  const { handleImageUpload } = useUploadModal();

  return (
    <main className="modal active">
      <article className="publish-modal">
        <ButtonClosed />
        {selectedImage && (
          <section className="chosen-image-field">
            <div className="image-wrapper">
              <img
                src={selectedImage}
                alt={t("Selected")}
                className="chosen-image"
              />
            </div>
            <ButtonPublish />
          </section>
        )}
        {/* Exibir barra de progresso se o upload estiver em andamento */}
        {uploadInProgress && <Loading />}

        {/* Botão para anexar imagem */}
        {!selectedImage && !uploadInProgress && (
          <section className="custom-file-upload">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {t("Add photo")}
            </label>
          </section>
        )}
      </article>
    </main>
  );
};

export default UploadPhotoModal;

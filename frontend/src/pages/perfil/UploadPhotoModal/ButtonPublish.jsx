import useUploadModal from "../hooks/useUploadModal";
import { useTranslation } from "react-i18next"; // Importe o hook useTranslation

const ButtonPublish = () => {
    const { t } = useTranslation(); // Usa o hook useTranslation para tradução
    const { changeImage2 } = useUploadModal();
    
    return (
        <>
            <button className="publish-button" onClick={changeImage2}>
                {t("Publish")}
            </button>
        </>
    );
};

export default ButtonPublish;

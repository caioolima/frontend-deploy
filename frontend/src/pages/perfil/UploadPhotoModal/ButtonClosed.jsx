import useEventsModals from "../hooks/useEventsModals";
import styles from "./styles/UploadPhotoModal.module.css"
const ButtonClosed = () => {
    const { handleClosePhotoModal } = useEventsModals();

    return (
        <>
            <button
                className={styles.closeButtonPublish}
                onClick={handleClosePhotoModal}>
                &times;
            </button>
        </>
    );
};

export default ButtonClosed;

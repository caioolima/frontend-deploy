import useEventsModals from "../hooks/useEventsModals";

const ButtonClosed = () => {
    const { handleClosePhotoModal } = useEventsModals();

    return (
        <>
            <button
                className="close-button-publish"
                onClick={handleClosePhotoModal}>
                &times;
            </button>
        </>
    );
};

export default ButtonClosed;

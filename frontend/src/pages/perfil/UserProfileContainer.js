import { useEffect, useState } from "react";
import "./UserProfile.css";
import { useParams, Navigate } from "react-router-dom";
import { useMyContext } from "../../contexts/profile-provider";

/* Components */
import SidebarMenu from "./SidebarMenu/index";
import EditModal from "./EditModal/index";
import ChangePhotoModal from "./ChangePhotoModal/index";
import UploadPhotoModal from "./UploadPhotoModal/index";
import Galeria from "./Galeria/index";
import InfoProfile from "./InfoProfile/index";
import PublicationDetailsModal from "./PublicationDetailsModal/index";
import { useAuth } from "../../hooks/use-auth";
import Footer from "../../components/Footer/footer.jsx";

/* Functions */
import useGetdata from "./hooks/useGetdata";

const UserProfileContainer = () => {
  /* Estados necessários */
  const {
    showModal,
    isEditMode,
    showPhotoModal,
    selectedPublicationModalOpen,
    userDataLoaded,
  } = useMyContext();

  /* Função que obtem todos os dados do servidor */
  const { getDataUser } = useGetdata();
  const [userId, setUserId] = useState(useParams().userId);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const { user } = useAuth();
  /* Se a aplicação renderizar, busque os dados no servidor */
  useEffect(() => {
    getDataUser();
  }, [getDataUser]);

  useEffect(() => {
    if (!userId) return;

    const checkValidity = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setProfileNotFound(true);
        }

        const response = await fetch(`https://connecter-server-033a278d1512.herokuapp.com/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setProfileNotFound(true);
          return;
        }

        const userData = await response.json();

        if (!userData) {
          setProfileNotFound(true);
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar a validade do ID do usuário:", error);
        setProfileNotFound(true);
      }
    };

    checkValidity();
  }, [userId, getDataUser]);

  if (profileNotFound) {
    // Se o perfil não for encontrado, podemos renderizar alguma mensagem ou redirecionar o usuário
    return user ? (
      <Navigate to={`/profile/${user.id}`} />
    ) : (
      <Navigate to="/erro" />
    );
  }

  return (
    <>
      {/* Modal que exibe publicações */}
      {selectedPublicationModalOpen && <PublicationDetailsModal />}

      {/* Todo o conteúdo do profile */}
      <main className="profile">
        {userDataLoaded && (
          <section className="profile-container">
            <InfoProfile /> {/* Campo de perfil do usuário */}
            <Galeria /> {/* Galeria de imagens */}
            <SidebarMenu /> {/* Menu */}
            {isEditMode && <EditModal />} {/* Modal de edição do perfil */}
            {showModal && <ChangePhotoModal />}{" "}
            {/* Modal de mudar a foto perfil */}
            {showPhotoModal && <UploadPhotoModal />}{" "}
            {/* Modal de publicar foto na galeria */}
          </section>
        )}
        {userDataLoaded && (
          <div className="footer-reset">
            <Footer userId={userId} />
          </div>
        )}
      </main>
    </>
  );
};

export default UserProfileContainer;

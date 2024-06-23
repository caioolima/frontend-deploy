import { useMyContext } from "../../../contexts/profile-provider"
import { useParams } from "react-router-dom";

const useProfileEdit = () => {
    const {
        newUsername, newBiography,
        setBiography, setUsername,
        setUsernameError, setEditMode,
        setNewPhone, setSelectedImage, 
        setShowModal
    } = useMyContext();
    
    const { userId } = useParams();
    
    // ↓ Função que salva os dados editados no EditModal
    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = `https://connecter-server-033a278d1512.herokuapp.com/users/${userId}/edit`;

            // Verifique se o campo de usuário está vazio
            if (!newUsername) {
                setUsernameError("Por favor, insira um nome de usuário.");
                return; // Retorna para evitar a requisição se o campo estiver vazio
            }

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ newUsername, newBiography }) // Apenas envie o novo nome de usuário e a nova biografia
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setBiography(newBiography);
                    setUsername(newUsername);
                    setEditMode(false);
                    setUsernameError(""); // Limpa o erro se a atualização for bem-sucedida
                    console.log("Perfil atualizado com sucesso!");
                } else {
                    // Se houver um erro, define a mensagem de erro fornecida pelo servidor
                    setUsernameError(data.message);
                }
            } else if (response.status === 400) {
                // Se o status da resposta for 400 (Bad Request), definir a mensagem de erro como "Usuário não disponível"
                setUsernameError("Usuário não disponível");
            } else {
                // Se a resposta do servidor não for bem-sucedida e não for um erro de Bad Request, definir a mensagem de erro com base no status da resposta
                setUsernameError(
                    `Erro ${response.status}: ${response.statusText}`
                );
            }
        } catch (error) {
            console.error("Erro ao atualizar o perfil:", error);
        }
    };
    
     // Função para excluir a biografia do usuário
     const handleDeleteBiography = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = `https://connecter-server-033a278d1512.herokuapp.com/users/${userId}/biography`;

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setBiography(""); // Limpa a biografia no contexto
                    setEditMode(false); // Sai do modo de edição
                    setShowModal(false); // Fecha o modal de edição
                    console.log("Biografia excluída com sucesso!");
                } else {
                    // Se houver um erro, exibe a mensagem de erro fornecida pelo servidor
                    console.error("Erro ao excluir a biografia:", data.message);
                }
            } else {
                // Se a resposta do servidor não for bem-sucedida, exibe o status da resposta
                console.error(`Erro ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao excluir a biografia:", error);
        }
    };
    // Função para atualizar o novo número de telefone
    const handleChangePhoneNumber = newPhoneNumber => {
        setNewPhone(newPhoneNumber); // Atualiza o estado com o novo número de telefone
    };
    
    const handleCloseModal = () => {
        // Limpar o estado selectedImage
        setSelectedImage(null);
        document.body.style.overflow = "auto";
        // Fechar o modal
        setShowModal(false);
    };
    
    return { 
        setUsernameError, handleSaveEdit, 
        handleChangePhoneNumber, handleCloseModal,handleDeleteBiography
    };
}

export default useProfileEdit;
const MessageInput = ({
    unreadMessages,
    lastMessageSeenIndex, 
    messages, 
    handleUnreadMessageClick, 
    messageInput, 
    handleKeyPress, 
    AiOutlineCamera, 
    setShowMediaModal, 
    sendMessage,
    setMessageInput}) => {
  
    return (
    <div className="message-input">
        {unreadMessages > 0 && lastMessageSeenIndex !== messages.length - 1 && (
          <p className="unread-messages" onClick={handleUnreadMessageClick}>
            {unreadMessages} mensagens não lidas
          </p>
        )}

        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyPress} // Adicione o evento de teclado aqui
          placeholder="Digite sua mensagem"
        />
        {/* Ícone de câmera para abrir o modal */}
        <AiOutlineCamera
          className="camera-icon"
          onClick={() => setShowMediaModal(true)}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
  )
}

export default MessageInput
const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:4200",
  },
});

// Lista dos Usuários conectados.
let users = [];

// Recebe uma conexão do cliente.
io.on("connection", (socket) => {
  console.log('[Socket.io]: Novo usuário conectado!');

  // Adiciona o Usuário na lista e emite o getUsers() para atualizar a lista no cliente.
  socket.on("addUser", (userId) => {
    console.log('[Socket.io]: Incluindo usuário na lista... ID: ' + userId);
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // Remove o Usuário da lista e emite o getUsers() para atualizar a lista no cliente.
  socket.on("disconnect", () => {
    console.log('[Socket.io]: Um usuário desconectou!');
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  // Recebe uma mensagem e envia ao destinatário.
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    user ? io.to(user.socketId).emit("getMessage", { senderId, text }) : console.log('[Socket.io]: Erro ao enviar mensagem!');
  });
});

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

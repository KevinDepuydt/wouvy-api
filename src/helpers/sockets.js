import User from '../models/user';

/**
 * broadcast online users in a workflow
 */
export const broadcastWorkflowOnlineUsers = (io, room) => {
  io.in(room).clients((err, clients) => {
    // get users ids
    const roomUsersIds = clients.map(id => io.sockets.connected[id].handshake.query.user);
    // broadcast to room
    io.to(room).emit('online-users', roomUsersIds);
  });
};

/**
 * Update user last connection date
 * and broadcast to workflow users if the socket was in a workflow room
 */
export const handleUserDisconnection = (socket, io, room) => {
  const id = socket.handshake.query.user;
  User.findByIdAndUpdate(id, { $set: { lastActivity: Date.now() } }, { new: true })
    .then((updatedUser) => {
      if (room !== null) {
        io.to(`${room}/members`).emit('member-updated', updatedUser);
      }
    })
    .catch(console.error);
};

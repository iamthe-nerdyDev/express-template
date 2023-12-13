import Socket, { IEmit } from "../classes/socket.class";

export const broadcastEvent = (data: IEmit) => {
  const socketInstance = new Socket();

  socketInstance.emit(data);

  socketInstance.close();
};

import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import ChatRoom from "./ChatRoom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const MainScreen = () => {
  const [chatRoom, setChatRoom] = useState("");
  const [me, setMe] = useState("");
  useEffect(() => {
    socket.on("me", (id) => {
      setMe(id);
      console.log("socket.on(me) ran");
    });
  }, []);

  return chatRoom !== "" ? (
    <ChatRoom chatRoom={chatRoom} me={me} socket={socket} />
  ) : (
    <div>
      <div>
        <h1>Video Chat</h1>
        <div>
          <button primary onClick={() => setChatRoom("host")}>
            Create a Room
          </button>
          <button onClick={() => setChatRoom("guest")}>Join a Room</button>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;


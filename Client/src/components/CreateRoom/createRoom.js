import React , { useState, useEffect } from "react";
import {Button} from "reactstrap";
import ChatRoom from "../../screens/ChatRoom";
import { io } from "socket.io-client";
import "../CreateRoom/createroom.css";

function CreateRoom () {
    const [roomId, setRoomId] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [roomDetails, setRoomDetails] = useState('')

    const [chatRoom, setChatRoom] = useState("");
    const [me, setMe] = useState("");
    
    const socket = io("http://localhost:5000/createroom");

    useEffect(() => {
      socket.on("me", (id) => {
        setMe(id);
        console.log("socket.on(me) ran");
      });
    }, []);

    const handleInputId = (e) => {
        setRoomId(e.target.value);
    }

    const handleInputPassword = (e) => {
        setRoomPassword(e.target.value);
    }
    const handleSubmit = () => {
        const data = [];
        data.push(roomId,roomPassword);
        setRoomDetails(data);
        setChatRoom("host");
        let item = {roomId,roomPassword};
        const url = "http://localhost:5000/createroom";
        fetch(url,{
          method: 'POST',
          body: JSON.item,
          headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
          }
    })
    }

    return (
          chatRoom !== "" ? (
          <ChatRoom chatRoom={chatRoom} me={me} socket={socket} />
        ) : (
        <div className="testing">
            <input type="text" placeholder="enter RoomId" value={roomId} onChange={handleInputId} className="input_create_Room" />
            <input type="password" placeholder="enter RoomPassword" value={roomPassword} onChange={handleInputPassword} className="input_create_Room"/> 
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
        )
    )
}
export default CreateRoom;
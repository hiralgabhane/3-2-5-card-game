// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from 'react-router-dom'
// // import {io} from "socket.io-client";

// // const socket = io("http://localhost:4000");

// // function Lobby() {
// //     const [name, setName] = useState("");
// //     const [players, setPlayers] = useState([]);
// //     const [joined, setJoined] = useState(false);
// //     const [error, setError] = useState("");
// //     const navigate = useNavigate();

// //     useEffect(() =>{
// //         socket.on("updatePlayers", (playerList) => {
// //             setPlayers(playerList);
// //         });

// //         socket.on("gameReady", () => {
// //             navigate("/game");
// //         });
        
// //         socket.on("lobbyFull", (message) => {
// //             setError(message);
// //         });

// //         return () => socket.disconnect();
// //     }, [navigate]);

// //     const handleJoin = () => {
// //         if(name.trim()!== ""){
// //             socket.emit("joinLobby", name);
// //             setJoined(true);
// //         }
// //     };

// //     return(
// //         <div className="lobby">
// //             <h1> Lobby </h1>
// //             {!joined ? (
// //                 <>
// //                 <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/>
// //                 <button onClick={handleJoin}> enter game </button>
// //                 </>
// //             ): (<p> Waiting for more players..</p> )}
// //             {error && <p> {error} </p>}

// //             <h2> Connected Players: </h2>
// //             <ul>
// //                 {players.map((player,index) => (
// //                     <li key={player.id}> {index+1}.{player.name} </li>
// //                 ))}
// //             </ul>
// //             {players.length === 3 && <p>Game is starting soon...</p>}
// //         </div>
// //     );
// // };

// // export default Lobby;


    
// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import { io } from "socket.io-client";

// const socket = io("http://localhost:4000", {
//     transports: ["websocket", "polling"] // Ensure stable connection
// });

// function Lobby() {
//     const [name, setName] = useState("");
//     const [players, setPlayers] = useState([]);
//     const [joined, setJoined] = useState(false);
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         socket.on("updatePlayers", (playerList) => {
//             try {
//                 // Ensure JSON data
//                 if (typeof playerList === "string") {
//                     setPlayers(JSON.parse(playerList)); 
//                 } else {
//                     setPlayers(playerList);
//                 }
//             } catch (err) {
//                 console.error("Invalid JSON received:", playerList);
//             }
//         });

//         socket.on("gameReady", () => {
//             navigate("/gameroom");
//         });

//         socket.on("lobbyFull", (message) => {
//             setError(typeof message === "string" ? message : message.error);
//         });

//         return () => {
//             socket.off("updatePlayers");
//             socket.off("gameReady");
//             socket.off("lobbyFull");
//         };
//     }, [navigate]);

//     const handleJoin = () => {
//         if (name.trim() !== "") {
//             socket.emit("joinLobby", name);
//             setJoined(true);
//         }
//     };

//     return (
//         <div className="lobby">
//             <h1>Lobby</h1>
//             {!joined ? (
//                 <>
//                     <input 
//                         type="text" 
//                         placeholder="Enter name" 
//                         value={name} 
//                         onChange={(e) => setName(e.target.value)} 
//                     />
//                     <button onClick={handleJoin}>Enter Game</button>
//                 </>
//             ) : (
//                 <p>Waiting for more players...</p>
//             )}
//             {error && <p style={{ color: "red" }}>{error}</p>}

//             <h2>Connected Players:</h2>
//             <ul>
//                 {players.map((player, index) => (
//                     <li key={player.id}>{index + 1}. {player.name}</li>
//                 ))}
//             </ul>

//             {players.length === 3 && <p>Game is starting soon...</p>}
//         </div>
//     );
// }

// export default Lobby;
// src/pages/Lobby.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { transports: ["websocket"] });

function Lobby() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("updatePlayers", (playerList) => {
      setPlayers(playerList);
    });

    socket.on("roomCreated", ({ roomId, playerNumber }) => {
      localStorage.setItem("player", JSON.stringify({ playerName: name, playerNumber }));
      setRoomId(roomId);
    });

    socket.on("joinedRoom", ({ roomId, playerNumber }) => {
      localStorage.setItem("player", JSON.stringify({ playerName: name, playerNumber }));
      setRoomId(roomId);
    });

    socket.on("gameReady", ({ roomId }) => {
      navigate(`/gameroom/${roomId}`);
    });

    socket.on("lobbyFull", (data) => {
      setError(data.error);
    });

    return () => {
      socket.off("updatePlayers");
      socket.off("roomCreated");
      socket.off("joinedRoom");
      socket.off("gameReady");
      socket.off("lobbyFull");
    };
  }, [name, navigate]);

  const handleCreateRoom = () => {
    if (name.trim() !== "") {
      socket.emit("createRoom", { playerName: name });
    }
  };

  const handleJoinRoom = () => {
    if (name.trim() !== "" && roomId.trim() !== "") {
      socket.emit("joinRoom", { roomId, playerName: name });
    }
  };

  return (
    <div className="lobby">
      <h1>Lobby</h1>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Game Room</button>
      <br />
      <input
        type="text"
        placeholder="Enter room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Game Room</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Connected Players:</h2>
      <ul>
        {players.map((player, index) => (
          <li key={player.sid || index}>
            {index + 1}. {player.playerName}
          </li>
        ))}
      </ul>

      {players.length === 3 && <p>Game is starting...</p>}
    </div>
  );
}

export default Lobby;

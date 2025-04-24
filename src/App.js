

// import { useEffect } from "react";
// import { io } from "socket.io-client";
// import React from "react";
// import "./App.css";
// import Navbar from "./components/index.js";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages";
// import Lobby from "./pages/lobby.js";
// import GameRoom from "./pages/gameroom";
// import SignUp from "./pages/signup.js";
// import SignIn from "./pages/signin.js";

// const socket = io("http://localhost:4000", {
//   transports: ["websocket"],
//   withCredentials: true,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// function App() {
//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("Connected to Flask WebSocket!");
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected from Flask server");
//     });

//     // handling incoming messages
//     // socket.on("message", (data) => {
//     //   try {
//     //     console.log("Raw received data:", data);
//     //     const parsedData = typeof data === "string" ? JSON.parse(data) : data;
//     //     console.log("Parsed message:", parsedData);
//     //   } catch (error) {
//     //     console.error("Error parsing message:", error);
//     //   }
//     // });
    
//     socket.on("message", (data) => {
//       console.log("Raw received data:", data);
//       if (typeof data === "string") {
//           try {
//               const parsedData = JSON.parse(data);
//               console.log("Parsed message:", parsedData);
//           } catch (error) {
//               console.error("Error parsing JSON:", error);
//           }
//       } else {
//           console.warn("Received non-string data:", data);
//       }
//   });

//     return () => {
//       if (socket.connected) {
//         socket.disconnect();
//         console.log("Socket disconnected");
//       }
//     };
//   }, []);

//   return (
//     <BrowserRouter>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/lobby" element={<Lobby />} />
//         <Route path="/gameroom/:roomId" element= {<GameRoom/>} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/signin" element={<SignIn />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;






import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import React from "react";
import "./App.css";
import Navbar from "./components/index.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages";
import Lobby from "./pages/lobby.js";
import GameRoom from "./pages/gameroom";
import SignUp from "./pages/signup.js";
import SignIn from "./pages/signin.js";

// Create a context for socket access
export const SocketContext = createContext(null);

function App() {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    // Create socket inside component to avoid issues with hot reloading
    const newSocket = io("http://localhost:4000", {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10, // Increased from 5
      reconnectionDelay: 1000,
      timeout: 10000 // Add timeout
    });
    
    setSocket(newSocket);
    
    newSocket.on("connect", () => {
      console.log("Connected to Flask WebSocket!", newSocket.id);
      
      // Reestablish room connection if needed
      const storedPlayer = JSON.parse(localStorage.getItem("player"));
      const currentPath = window.location.pathname;
      
      if (storedPlayer && currentPath.includes("/gameroom/")) {
        const roomId = currentPath.split("/gameroom/")[1].split("/")[0];
        console.log("Automatically rejoining room:", roomId);
        newSocket.emit("joinRoom", {
          roomId,
          playerName: storedPlayer.playerName,
          playerId: storedPlayer.id
        });
      }
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from Flask server");
    });
    
    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
    
    newSocket.on("message", (data) => {
      console.log("Raw received data:", data);
      if (typeof data === "string") {
        try {
          const parsedData = JSON.parse(data);
          console.log("Parsed message:", parsedData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else {
        console.warn("Received non-string data:", data);
      }
    });

    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);

  if (!socket) return <div>Connecting to server...</div>;

  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/gameroom/:roomId" element={<GameRoom />} />
          <Route path="/gameroom/:roomId/player/:playerId" element={<GameRoom />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;

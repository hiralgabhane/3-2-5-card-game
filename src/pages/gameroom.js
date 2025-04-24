// // src/pages/GameRoom.js
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import Card from '../components/Card';
// // import { createDeck, shuffleDeck } from '../utils/gameUtils';
// import "./gameroom.css";

// const socket = io("http://localhost:4000", {transports: ["websocket"]});
// function GameRoom() {
//     const { roomId } = useParams();
//     const [playerCards, setPlayerCards] = useState([[], [], []]); 
//     const [players, setPlayers] = useState([]);
//     const handleCardClick = (Card) => {
//         console.log("card clicked", Card);
//     }

//     useEffect(() => {
//         if(!roomId) return;

//         const playerName = localStorage.getItem("playerName") || `Player-${Math.floor(Math.random() * 1000)}`;
//         socket.emit("joinRoom", {roomId, playerName});
//         // socket.on("gameReady", (data) =>{
//         //     const deck = data.deck;
//         //     setPlayerCards([
//         //         deck.slice(0,5), 
//         //         deck.slice(5,10), 
//         //         deck.slice(10,15) 
//         //     ]);
//         // });
//         socket.on("gameReady", (data) => {
//             setPlayerCards(data.allHands); // ✅ Use `hand` instead of `deck`
//         });

//         socket.on("updatePlayers", (playerList) => {
//             console.log("Updated Players:", playerList); 
//             setPlayers([...playerList]);
//         });



//         return () => {
//             socket.emit("leaveRoom", {roomId});
//             socket.off("gameReady");
//             socket.off("updatePlayers");
//         };
        
//     }, [roomId]);

//     return (
//         <div className="game-room">
//             <h1>Game Room {roomId}</h1>
//             <h2> Players: </h2>
//             <ul>
//                 {players.map((player) => (
//                     <li key={player.id}> {player.name}({player.id}) </li>
//                 ))}
//             </ul>
            
//             <div className="game-container">
//                 {playerCards.map((player, index) => (
//                     <div className="player-hands"> 
//                         <h2> Your Hands </h2> 
//                         <div className="player-hand">
//                             {playerCards[0]?.map((card, cardIndex) => (
//                                 <Card 
//                                     key={`${card.rank}${card.suit}-${cardIndex}`} 
//                                     card={card} 
//                                     onCardClick={() => handleCardClick(card)}
//                                 /> 
//                             ))} 
//                         </div>
//                     </div> 
//                 ))} 
//             </div>
//         </div>
//     );
// }

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import Card from "../components/Card";
// import "./gameroom.css";

// const socket = io("http://localhost:4000", { transports: ["websocket"] });

// function GameRoom() {
//   const { roomId } = useParams();
//   const [players, setPlayers] = useState([]);
//   const [hand, setHand] = useState([]);
//   const [yourNumber, setYourNumber] = useState(0);

//   useEffect(() => {
//     const storedPlayer = JSON.parse(localStorage.getItem("player"));
//     if (!storedPlayer) return;

//     socket.emit("joinRoom", {
//       roomId,
//       playerName: storedPlayer.playerName
//     });

//     socket.on("gameReady", ({ hand, players, yourNumber }) => {
//       setHand(hand);
//       setPlayers(players);
//       setYourNumber(yourNumber);
//     });

//     socket.on("updatePlayers", (playerList) => {
//       setPlayers(playerList);
//     });

//     return () => {
//       socket.emit("leaveRoom", { roomId });
//       socket.off("gameReady");
//       socket.off("updatePlayers");
//     };
//   }, [roomId]);

//   const handleCardClick = (card) => {
//     console.log("Playing card:", card);
//     // Add game logic here
//   };

//   return (
//     <div className="game-room">
//       <h1>Game Room: {roomId}</h1>

//       <div className="players-list">
//         <h2>Players:</h2>
//         <ul>
//           {players.map((player) => (
//             <li key={player.sid}>
//               {player.playerNumber === yourNumber ? (
//                 <strong>You (Player {player.playerNumber}): {player.playerName}</strong>
//               ) : (
//                 `Player ${player.playerNumber}: ${player.playerName}`
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="hand-container">
//         <h2>Your Hand (Player {yourNumber})</h2>
//         <div className="card-grid">
//           {hand.map((card, index) => (
//             <Card
//               key={`${card.rank}-${card.suit}-${index}`}
//               card={card}
//               onCardClick={() => handleCardClick(card)}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="opponents-container">
//         {players
//           .filter(p => p.playerNumber !== yourNumber)
//           .map(p => (
//             <div key={p.sid} className="opponent-hand">
//               <h3>Player {p.playerNumber}'s Hand</h3>
//               <div className="card-back-grid">
//                 {Array(10).fill(0).map((_, i) => (
//                   <div key={i} className="card card-back" />
//                 ))}
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

// export default GameRoom;



// GameRoom.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Card from "../components/Card";
import "./gameroom.css";

const socket = io("http://localhost:4000", { transports: ["websocket"] });

function GameRoom() {
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState([]);
  const [yourNumber, setYourNumber] = useState(0);

  useEffect(() => {
    const storedPlayer = JSON.parse(localStorage.getItem("player"));

    // Send joinRoom event with stored player data
    socket.emit("joinRoom", {
      roomId,
      playerName: storedPlayer?.playerName,
    });

    // Listen for gameReady event
    socket.on("gameReady", ({ hand, players, yourNumber }) => {
      setHand(hand);
      setPlayers(players);
      setYourNumber(yourNumber);
    });

    socket.on("updatePlayers", (playerList) => {
      setPlayers(playerList);
    });

    // Clean up
    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("gameReady");
      socket.off("updatePlayers");
    };
  }, [roomId]);

  const handleCardClick = (card) => {
    console.log("Playing card:", card);
    // Logic to play the card
  };

  return (
    <div className="game-room">
      <h1>Game Room: {roomId}</h1>

      {/* Players List */}
      <div className="players-list">
        <h2>Players:</h2>
        <ul>
          {players.map((player) => {
            const storedPlayer = JSON.parse(localStorage.getItem("player"));
            const isYou = player.playerName === storedPlayer?.playerName;

            return (
              <li key={player.sid}>
                {isYou ? (
                  <strong>
                    You (Player {player.playerNumber}): {player.playerName}
                  </strong>
                ) : (
                  `Player ${player.playerNumber}: ${player.playerName}`
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Your Hand */}
      <div className="hand-container">
        <h2>Your Hand</h2>
        <div className="card-grid">
          {hand.map((card, index) => (
            <Card
              key={`${card.rank}-${card.suit}-${index}`}
              card={card}
              onCardClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      </div>

      {/* Opponent's */}
      <div className="opponents-container">
        {players
          .filter((p) => p.playerNumber !== yourNumber)
          .map((p) => (
            <div key={p.sid} className="opponent-hand">
              <h3>Player {p.playerNumber}'s Hand</h3>
              <div className="card-back-grid">
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="card card-back"></div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default GameRoom;

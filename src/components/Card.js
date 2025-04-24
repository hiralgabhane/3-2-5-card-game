// import React from "react";
// import "./Card.css";

// function Card({card, onCardClick}) {
    
//     return (
//         <div className="card" onClick={onCardClick}>
//             {card.rank}{card.suit}
//         </div>
//     );
// };

// export default Card;

// Card.js

// import React from "react";
// import "./Card.css";

// function Card({ card, onCardClick }) {
//   const isFaceDown = card.rank === "🂠";

//   return (
//     <div className="card" onClick={onCardClick}>
//       {isFaceDown ? (
//         <div className="card-back">🂠</div>
//       ) : (
//         <div className="card-front">
//           <div className="card-rank">{card.rank}</div>
//           <div className="card-suit">{card.suit}</div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Card;

import React from "react";
import "./Card.css";

function Card({ card, onCardClick }) {
  const getColor = () => {
    return card.suit === '♥' || card.suit === '♦' ? 'red' : 'black';
  };

  return (
    <div 
      className="card" 
      onClick={onCardClick}
      style={{ color: getColor() }}
      data-suit={card.suit}
    >
      <div className="card-rank">{card.rank}</div>
      <div className="card-suit">{card.suit}</div>
    </div>
  );
}

export default Card;

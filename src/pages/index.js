import React from "react";
import { Link } from 'react-router-dom'

const Home = () => {
    return(
        <div>
             <Link to="/lobby">
                <button type="button"> go to lobby </button>
            </Link>
        </div>
    );
};

export default Home;

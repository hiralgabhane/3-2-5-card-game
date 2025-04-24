import React from "react";
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css";

//createRoot lets you create a root to display React components inside a browser DOM node.
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

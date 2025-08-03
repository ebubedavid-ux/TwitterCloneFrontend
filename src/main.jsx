import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { TweetProvider } from "./context/TweetContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    
      <UserProvider>
        <TweetProvider>
          <App />
        </TweetProvider>
      </UserProvider>
    
  </React.StrictMode>
);

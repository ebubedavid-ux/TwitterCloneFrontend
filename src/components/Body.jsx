// FILE: src/components/Body.jsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Feed from "./Feed";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";
import Register from "./Register"; 
import CreatePost from "./CreatePost";
import TweetDetail from "./TweetDetail";
import Bookmark from "./Bookmark";
import MobileSearch from "./MobileSearch"; 


const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path: "/",
          element: <Feed />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/profile/update/:id",
          element: <UpdateProfile />,
        },
        {
          path: "/create-post",  
          element: <CreatePost />,
        },
        {
          path: "/tweet/:id",
          element: <TweetDetail />,
        },
         {
          path: "/bookmark", 
          element: <Bookmark />,
        },
         { path: "/search", element: <MobileSearch /> },

      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
  path: "/register",
  element: <Register />,
},

  ]);
  return <RouterProvider router={appRouter} />;
};

export default Body;
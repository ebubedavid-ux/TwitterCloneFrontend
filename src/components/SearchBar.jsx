import React, { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);

    if (q.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`${USER_API_END_POINT}/search?q=${q}`, {
        withCredentials: true,
      });
      setResults(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="">
      <div className="relative w-full">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        value={query}
        
        onChange={handleSearch}
        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
    </div>

      {results.length > 0 && (
        <ul className="bg-white shadow-lg rounded mt-2 max-h-60 overflow-y-auto">
          {results.map((user) => (
             <li
              key={user._id}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
             onClick={() => {
                navigate(`/profile/${user._id}`);
                setQuery("");
                setResults([]);
              }}

            >
              <Avatar
                src={user.profilePhoto || ""}
                name={user.name}
                size="35"
                round
              />
              <div>
                <p className="font-semibold text-sm text-black">{user.name}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

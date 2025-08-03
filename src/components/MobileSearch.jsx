
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { IoArrowBack } from "react-icons/io5";

const MobileSearch = () => {
  const navigate = useNavigate();

  // Optional: if someone opens this page on desktop, send them home
  useEffect(() => {
    if (window.innerWidth >= 768) navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="md:hidden w-full max-w-[600px] mx-auto px-4">
      
      <div className="sticky top-0 bg-white z-50 py-3 flex items-center gap-3 ">
       
        <div className="flex-1">
          <SearchBar autoFocus />
        </div>
      </div>

      {/* Extra space so results aren't hidden behind bottom nav */}
      <div className="pb-24" />
    </div>
  );
};

export default MobileSearch;

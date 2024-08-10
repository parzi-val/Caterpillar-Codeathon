import React from "react";
import HamBurger from "./Hamburger";
import { FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa";

interface HamBurgerDropDownProps {
  value: boolean;
  handleClick: () => void;
}

const HamBurgerDropDown: React.FC<HamBurgerDropDownProps> = ({ value, handleClick }) => {
  return (
    <div className="relative">
      <HamBurger value={value} handleClick={handleClick} />
      <div className="absolute top-[120px]">
        <div
          className={`absolute w-0 h-0 top-[-15px] left-[20px] border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-[#f0f4f7] transition-opacity duration-300 ease-in-out ${value ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`rounded-lg border ${value ? "border-[#e1e5e9]" : "border-0"} w-[200px] bg-[#f0f4f7] overflow-hidden transition-all duration-300 ease-in-out ${value ? "max-h-[200px]" : "max-h-0"}`}
        >
          <div className="text-black mx-[10px] my-[10px] font-semibold text-lg hover:text-[#D38A1F] cursor-pointer">
            <FaUserCircle className="inline-block mr-[10px]" />
            Profile
          </div>
          <div className="text-black mx-[10px] my-[10px] font-semibold text-lg hover:text-[#D38A1F] cursor-pointer">
            <FaCog className="inline-block mr-[10px]" />
            Setting
          </div>
          <div className="text-black mx-[10px] my-[10px] font-semibold text-lg hover:text-[#D38A1F] cursor-pointer">
            <FaSignOutAlt className="inline-block mr-[10px]" />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

export default HamBurgerDropDown;

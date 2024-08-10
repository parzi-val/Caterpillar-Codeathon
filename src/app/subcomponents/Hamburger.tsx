import React from "react";

interface HamburgerProps {
  value: boolean;
  handleClick: () => void;
}

const Hamburger: React.FC<HamburgerProps> = ({ value, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="w-[50px] h-[50px] flex justify-center items-center relative overflow-hidden cursor-pointer"
    >
      <span
        className={`absolute w-[60px] h-[8px] bg-[#1e1a15] rounded-[4px] transition-transform duration-500 ${
          value ? "transform translate-y-0 rotate-45" : "transform -translate-y-[20px]"
        }`}
      />
      <span
        className={`absolute w-[60px] h-[8px] bg-[#1e1a15] rounded-[4px] transition-transform duration-500 ${
          value ? "transform translate-x-[80px]" : "transform translate-x-0"
        }`}
      />
      <span
        className={`absolute w-[60px] h-[8px] bg-[#1e1a15] rounded-[4px] transition-transform duration-500 ${
          value ? "transform translate-y-0 rotate-[315deg]" : "transform translate-y-[20px]"
        } transition-delay-150`}
      />
    </div>
  );
};

export default Hamburger;

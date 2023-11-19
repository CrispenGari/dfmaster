import React from "react";
import { GrRefresh } from "react-icons/gr";
import { MdCloseFullscreen } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
const Controls = () => {
  return (
    <div className="dfmaster-controls">
      <div className="dfmaster-controls-button">
        <GrRefresh />
      </div>
      <div className="dfmaster-controls-button">
        <MdCloseFullscreen />
      </div>
      <div className="dfmaster-controls-button">
        <IoCloseOutline />
      </div>
    </div>
  );
};

export default Controls;

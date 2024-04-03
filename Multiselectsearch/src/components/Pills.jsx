import React from "react";

const Pills = ({ image, text, onClick }) => {
  return (
    <div className="flex items-center bg-slate-900 text-white px-2 py-1 gap-2 rounded-md">
      <img className="h-4" src={image} alt="text" />
      <p>{text}</p>
      <button onClick={onClick}>❌</button>
    </div>
  );
};

export default Pills;

import React from "react";
import hometab from "../images/hometab.svg";

function HomeTab() {
  return (
    <div className=" w-screen pt-32 flex items-center justify-end flex-col">
      <div className="relative overflow-hidden px-20">
        <img src={hometab} className=" w-96 h-auto mx-auto" alt="title image" />
      </div>
      <div className="pt-6 text-center">
        <p className="text-lg leading-normal font-bold mb-1 dark:text-white">
          WELCOME!!
        </p>
        <p className="text-gray-500 leading-relaxed font-light dark:text-gray-400">
          Kratos tracking report
        </p>
      </div>
    </div>
  );
}

export default HomeTab;

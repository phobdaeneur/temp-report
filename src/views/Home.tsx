import React, { useState, useContext, Fragment, useRef } from "react";
import TempReport from "../components/TempReport";
import ReportOil from "../components/ReportOil";
import HomeTab from "../components/HomeTab";
import useSWR from "swr"; // swr [Stale While Revalidate] 1. ทำการดึง data จาก cache มาให้เราก่อน (stale) 2. จากนั้นก็ ยิง request ไปที่ API (revalidate) 3. นำข้อมูลจาก API ที่ได้มาอัพเดทกับข้อมูลเดิม
import Select, { SingleValue } from "react-select";
import UserIcon from "../images/UserIcon.svg";
import axios, { AxiosRequestConfig } from "axios";
import { StoreContext } from "../store";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { ThemeContext } from "../themeContext";
import { Tab } from "@headlessui/react";
import temp from "../images/temp.svg";
import oil from "../images/oil.svg";

export interface IFleet {
  fleet_id: string;
  fleet_desc: string;
}

export interface ISelect {
  label: string;
  value: string;
}

const fetcher = async (url: string, config: AxiosRequestConfig) => {
  try {
    const r = await axios.get(url, config);
    return r.data;
  } catch (error) {
    console.log(error);
  }
};

function Home() {
  const { user } = useContext(StoreContext);
  const [selectFleet, setSelectFleet] = useState<ISelect | null>(null);
  const { loggedOut } = useContext(StoreContext);
  const navigate = useNavigate();
  const { setTheme, theme } = useContext(ThemeContext);

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
  };

  /**
   * Retrive Fleets
   */
  const { data: fleetData, error } = useSWR(
    [
      `https://geotrackerbackend.kratostracking.com:5000/api/fleets/${user?.username}`,
      config,
    ],
    fetcher
  );

  // Select dropdown fleet
  const handleselectFleet = (newFleet: SingleValue<ISelect>) => {
    // console.log(newFleet);
    setSelectFleet(newFleet);
  };

  // Fleet data in dropdown
  const options = fleetData
    ? fleetData.map((item: IFleet, i: number) => {
        return { value: item.fleet_id, label: item.fleet_desc };
      })
    : undefined;

  // Logout function button
  const handleLogout = (): void => {
    loggedOut();
    navigate("/login");
  };

  React.useEffect(() => {
    "Loding.....";
  }, []);

  const [selected, setSelected] = useState("temp");
  return (
    <div className="bg-white dark:bg-black bg-cover dark:h-screen dark:w-full">
      {/* header  */}
      <header className=" border-slate-900/10 flex items-center flex-col z-40 top-0 w-full h-24 bg-white lg:fixed lg:w-full lg:top-0 lg:z-30 px-5 dark:bg-black">
        <div className="flex flex-row items-center w-full justify-between">
          <div className="md:flex flex-row items-center hidden">
            <img className="flex-start brightness-125" src={logo} width="150" />
          </div>

          <div className="flex flex-row items-center justify-center">
            {/* Deopdown fleet */}
            <Select
              onChange={handleselectFleet}
              placeholder={"กรุณาเลือกกลุ่มยานยนต์"}
              className="w-48 md:w-96 "
              options={options}
              value={selectFleet}
              isClearable
            />
            {/* Mode display  */}
            {theme === "dark" ? (
              <button onClick={() => setTheme("light")} className="ml-3">
                <span>
                  <svg
                    id="theme-toggle-light-icon"
                    className="w-8 h-8 text-slate-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>
            ) : (
              <button onClick={() => setTheme("dark")} className="ml-3">
                <span>
                  <svg
                    id="theme-toggle-dark-icon"
                    className="w-8 h-8 text-slate-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                  </svg>
                </span>
              </button>
            )}
            {/* Username  */}
            <div className="flex items-center px-4 -mx-2">
              <div className="relative overflow-hidden ">
                <img
                  src={UserIcon}
                  className="max-w-full h-12 mx-auto rounded-full "
                  alt="title image"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h4 className="mx-2 font-medium text-gray-600 border-b-4 dark:text-gray-300">
                  {user?.username}
                </h4>
                <hr className="border-black dark:border-gray-600" />
                <button
                  onClick={handleLogout}
                  className="font-medium text-[#B94A4A]"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="w-full bg-white pt-24 dark:bg-black">
        <Tab.Group>
          <div className="w-full bg-white px-10 rounded border-b dark:bg-black dark:text-white dark:border-gray-500 fixed z-20">
            <Tab.List>
              <div className="flex flex-row justify-start items-center gap-10 ">
                <Tab value="temp" onClick={() => setSelected("temp")}>
                  {selected === "temp" ? (
                    <div className="text-lg hover:text-gray-400 dark:hover:text-gray-600 flex flex-row justify-center">
                      <div className=" text-white rounded-full w-8">
                        <img src={temp} className="h-6 mx-auto " />
                      </div>
                      <label className=" border-b-2 border-purple-500">
                        รายงานอุณหภูมิ
                      </label>
                    </div>
                  ) : (
                    <div className="text-lg hover:text-gray-400 dark:hover:text-gray-600 flex flex-row justify-center">
                      <div className=" text-white rounded-full w-8">
                        <img src={temp} className="h-6 mx-auto " />
                      </div>
                      <label>รายงานอุณหภูมิ</label>
                    </div>
                  )}
                </Tab>

                <Tab value="oil" onClick={() => setSelected("oil")}>
                  {selected === "oil" ? (
                    <div className="text-lg hover:text-gray-400 dark:hover:text-gray-600 flex flex-row justify-center">
                      <div className=" text-white rounded-full w-8">
                        <img src={oil} className="h-6 mx-auto " />
                      </div>
                      <label className=" border-b-2 border-[#628A71]">
                        รายงานน้ำมัน
                      </label>
                    </div>
                  ) : (
                    <div className="text-lg hover:text-gray-400 dark:hover:text-gray-600 flex flex-row justify-center">
                      <div className=" text-white rounded-full w-8">
                        <img src={oil} className="h-6 mx-auto " />
                      </div>
                      <label>รายงานน้ำมัน</label>
                    </div>
                  )}
                </Tab>
              </div>
            </Tab.List>
          </div>

          <Tab.Panels>
            <Tab.Panel>
              <TempReport selectFleet={selectFleet} />
            </Tab.Panel>

            <Tab.Panel>
              <ReportOil selectFleet={selectFleet} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      {/*  */}
    </div>
  );
}

export default Home;

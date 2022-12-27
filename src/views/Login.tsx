import React, { useState, useContext } from "react";
import logo from "../images/logo.png";
import { login } from "../service/auth";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../store";
import loginIcon from "../images/loginIcon.svg";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Cookies } from "react-cookie";

export interface ILogin {
  username: string | null;
  password: string | null;
}

type ErrMsg = {
  status: number;
  data: string;
};

type ErrType = {
  response: ErrMsg;
};

function Login() {
  const MySwal = withReactContent(Swal);
  const { user, loggedIn } = useContext(StoreContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<ILogin>({
    username: null,
    password: null,
  });

  const ErrorSwal = (status: number, text: string) => {
    MySwal.fire({
      icon: "error",
      text: text,
      confirmButtonColor: "#3085d6",
    });
  };

  const handleType: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCredentials((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const authUser = await login(credentials);
      // set global state
      loggedIn(authUser);

      navigate("/");
    } catch (err) {
      let E = err as ErrType;
      if (E.response.status === 0) {
        // if req doesn't reach the server, status error = 0
        ErrorSwal(
          E.response.status,
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณและลองอีกครั้ง :("
        );
      } else {
        ErrorSwal(E.response.status, E.response.data);
      }
    }
  };
  const cookies = new Cookies();
  const submit = (): void => {
    cookies.set("tempReport", "true");
    // console.log(cookies.get("tempReport"));
    setCookies(cookies.get("tempReport"));
  };

  const [cookie, setCookies] = useState(cookies);

  return (
    <div className="font-mono relative py-24 md:py-48 bgLogin h-screen">
      <div className="container mx-auto">
        <div className="flex justify-center ">
          <div className="w-full xl:w-3/4 lg:w-11/12 flex flex-col-reverse md:flex-row drop-shadow-2xl shadow-2xl shadow-[#FFAF88]">
            {/* Login from */}
            <div className="w-full lg:w-1/2 bg-white ">
              <h3 className="pt-4 text-2xl text-center">Welcome Back!</h3>
              <form
                onSubmit={handleSubmit}
                className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
              >
                <label className="block mb-2 text-sm font-bold text-gray-700">
                  Username
                </label>
                <input
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="username"
                  onChange={handleType}
                  type="text"
                  placeholder="Username"
                />

                <label className="block mb-2 mt-4 text-sm font-bold text-gray-700">
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="password"
                  onChange={handleType}
                  type="password"
                  placeholder="Password"
                />

                <button
                  className="w-full px-4 py-2 mt-4 font-bold text-white bg-[#A75D1C] rounded-full hover:bg-[#FFB877] focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Sign in
                </button>

                <hr className="mb-6 border-t" />
                <div className="space-y-4 text-gray-600 text-center sm:-mb-8">
                  <p className="text-xs">
                    By proceeding, you agree to our{" "}
                    <a href="#" className="underline">
                      Terms of Use
                    </a>{" "}
                    and confirm you have read our{" "}
                    <a href="#" className="underline">
                      Privacy and Cookie Statement
                    </a>
                    .
                  </p>
                </div>
              </form>
            </div>
            {/* Login from */}

            {/* Right logo */}
            <div className="h-full w-full lg:w-1/2 bg-[#FFEDE1] block px-5 ">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col justify-end">
                  <img src={logo} className="w-32 pt-4 " />
                  <h3 className="pt-2 text-2xl text-left">Kratos tracking</h3>
                </div>

                <img src={loginIcon} className="lg:w-80 pt-4 px-5 w-64" />
              </div>

              <h3 className="pt-2 text-lg text-left">
                Sign in to Kratos tracking vehicle report to examine your
                vehicle report
              </h3>

              <h3 className="pt-4 md:pt-12 lg:pt-16 text-sm flex justify-end item-end">
                968 อาคาร อื้อจือเหลียง ชั้น5
              </h3>
              <h3 className="text-sm flex justify-end items-end ">
                ถนนพระราม 4 แขวง สีลม เขต บางรัก กรุงเทพฯ 10500
              </h3>
            </div>
            {/* Right logo */}
          </div>
        </div>
      </div>

      {/* Modal */}
      {cookies.get("tempReport") !== "true" ? (
        <>
          <div className=" bg-white flex justify-between items-center px-10 w-screen h-40 overflow-x-hidden overflow-y-auto fixed bottom-0 z-50 outline-none focus:outline-none">
            <div className="flex flex-col gap-2 w-5/6">
              <label className="indent-8 text-2xl font-bold">
                การเก็บเเละใช้คุกกี้
              </label>
              <label className="indent-8 font-mono ">
                เว็บไซต์นี้ใช้คุกกี้ เพื่อมอบประสบการณ์การใช้งานที่ดีให้กับท่าน
                และเพื่อพัฒนาคุณภาพการให้บริการเว็บไซต์ที่ตรงต่อความต้องการของท่านมากยิ่งขึ้น
                ท่านสามารถทราบรายละเอียดเกี่ยวกับคุกกี้ได้ที่
              </label>
              <label className="indent-8 font-mono">
                This Website uses cookies to provide you with the best
                experience and to improve the website services in order to
                better serve your requirements. You can find the details about
                cookies use on Cookies Policy.
              </label>
            </div>
            <div className="flex flex-row items-center justify-center gap-4">
              <button
                onClick={submit}
                className=" w-24 h-10 rounded-xl bg-[#20741a] text-sm font-medium text-white hover:text-white select-none hover:bg-[#20741a]/50"
              >
                Accept
              </button>
              <button className=" w-24 h-10 rounded-xl bg-[#ff5946] text-sm font-medium text-white hover:text-white select-none hover:bg-[#ff5946]/50">
                Regect
              </button>
            </div>
          </div>
          <div className="opacity-80 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}

export default Login;

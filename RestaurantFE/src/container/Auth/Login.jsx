import * as React from "react";
import { Link as LinkRouter, useNavigate } from "react-router-dom";
import logo from "../../favicon.ico";
import gallery04 from "../../assets/gallery04.png";

import AuthAPI from "../../API/AuthAPI";
import Swal from "sweetalert2";

export default function Login() {
  const [savePass, setSavePass] = React.useState(false);
  const [validAPI, setValidAPI] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [token, setToken] = React.useState("");
  const navigation = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      login: email,
      password: password,
    };
    const res = await AuthAPI.login(data);
    console.log(res);
    if (!res.status) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Chào mừng ${res.username} đã quay trở lại!`,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500,
      }).then(() => {
        setValidAPI("");
        if (savePass) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("name", res.username);
          localStorage.setItem("role", res.role);
          setToken(res.token);
        }
        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("name", res.username);
        sessionStorage.setItem("role", res.role);
        localStorage.setItem("token", res.token);
        localStorage.setItem("name", res.username);
        localStorage.setItem("role", res.role);
        setToken(res.token);
        if (res.role === "ROLE_ADMIN") {
          navigation("/admin");
        } else {
          navigation("/");
        }
      });
    } else if (res.status === 403) {
      setValidAPI("Tài khoản hoặc mật khẩu không đúng");
    } else {
      setValidAPI("Lỗi hệ thống, vui lòng liên hệ quản trị viên");
    }
    console.log(res);
  };
  React.useEffect(() => {
    if (!!sessionStorage.getItem("token") || !!localStorage.getItem("token")) {
      navigation("/");
    }
  }, [token]);

  return (
    <>
      <div className="pt-[60px]">
        <div className=" pt-[70px] mb-[-70px] h-screen">
          <div className="w-[90%] lg:w-[80%] xl:w-[60%] h-[100%] md:h-[550px] rounded-sm md:shadow-lg shadow-gray-300 bg-white text-black mx-auto md:grid md:grid-cols-4">
            <div className="md:col-span-3  text-center pt-[5px]">
              <div className="w-[100%] sm:w-[80%] md:w-[60%] mx-auto mt-14 pb-[130px] md:px-10">
                <p className="font-bold text-xl">Chào mừng trở lại</p>
                <span className="inline-block mt-[20px] w-[40px] relative h-[40px] bg-gray-300 rounded-full">
                  <img
                    src={logo}
                    className="w-[70%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                    alt="logo"
                  />
                </span>
                <form onSubmit={handleSubmit} className="mt-8">
                  {validAPI && (
                    <p className="text-red-500 text-[12px] text-left mb-[15px]">
                      {validAPI}
                    </p>
                  )}
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="text"
                      id="email"
                      label="Email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      // required
                      autoFocus
                    />
                    <label
                      htmlFor="floating_email"
                      className="absolute left-0 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Email address <span className="text-red-400">*</span>
                    </label>
                  </div>
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="password"
                      name="Mật khẩu"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="floating_email"
                      className="absolute left-0 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Password <span className="text-red-400">*</span>
                    </label>
                  </div>
                  <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        aria-describedby="terms"
                        type="checkbox"
                        className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="terms"
                        className="font-medium text-gray-900 dark:text-gray-300"
                      >
                        Nhớ mật khẩu
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="text-white  mt-[10px] w-full bg-[#d4b07a] hover:bg-[#ca9442] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    ĐĂNG NHẬP
                  </button>
                </form>
                <p className="md:hidden mt-[35px] text-gray-600">
                  Bạn chưa có tài khoản:{" "}
                  <LinkRouter
                    to="/register"
                    className="text-blue-400 underline hover:text-blue-600"
                  >
                    Đăng ký
                  </LinkRouter>
                </p>
              </div>
            </div>
            <div className="hidden md:block col-span-1 relative h-full overflow-hidden ">
              <div className="overflow-hidden   after:content-[''] after:absolute after:inline-block after:w-full after:h-full after:bg-black after:top-0 after:opacity-[40%]">
                <img
                  src={gallery04}
                  className=" max-w-[250%] lg:max-w-[180%] xl:max-w-[170%] translate-x-[-20%]"
                  alt=""
                />
                <div className="w-full absolute top-[10%] px-[20px] text-white z-10 text-center">
                  <span className="block font-bold text-2xl">Đăng ký mới?</span>
                  <span className="block mt-[10px] text-[15px]">
                    Đăng ký và khám phá nhiều điều tuyệt vời!
                  </span>
                </div>
                <LinkRouter
                  to="/register"
                  className="absolute text-[14px] text-white z-10 border-2 border-white hover:font-medium hover:text-gray-600  hover:bg-white   rounded-[20px] px-[15px] py-[5px] bottom-[20%] left-[50%] translate-x-[-50%]"
                >
                  ĐĂNG KÝ
                </LinkRouter>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

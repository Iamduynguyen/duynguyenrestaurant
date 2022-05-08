import * as React from "react";
import { Link as LinkRouter, useNavigate } from "react-router-dom";
import logo from "../../favicon.ico";
import gallery03 from "../../assets/gallery03.png";
import AuthAPI from "../../API/AuthAPI";
import Swal from "sweetalert2/dist/sweetalert2.all";

export default function Register() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [token, setToken] = React.useState("");
  const [validAPI, setValidAPI] = React.useState("");
  const navigation = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      login: email,
      password: password,
    };
    const res = await AuthAPI.register(data);
    if (res.id !== undefined) {
      Swal.fire("Đăng ký thành công!", "Nhấn OK để đăng nhập", "success").then(
        async () => {
          const resLogin = await AuthAPI.login(data);
          if (!resLogin.status) {
            sessionStorage.setItem("token", resLogin.token);
            sessionStorage.setItem("name", resLogin.username);
            sessionStorage.setItem("role", resLogin.role);
            setToken(resLogin.token);
            if (res.role === "ROLE_ADMIN") {
              navigation("/admin");
            } else {
              navigation("/");
            }
          }
        }
      );
    } else if (res.status === 403) {
      setValidAPI("Tài khoản hoặc mật khẩu không đúng");
    } else {
      setValidAPI("Lỗi hệ thống, vui lòng liên hệ quản trị viên");
    }
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
          <div className="w-[90%] lg:w-[80%] xl:w-[60%] h-[100%] md:h-[550px] overflow-hidden rounded-sm md:shadow-lg shadow-gray-300 bg-white text-black mx-auto md:grid md:grid-cols-4">
            <div className="hidden md:block col-span-1 relative h-full overflow-hidden ">
              <div className="overflow-hidden   after:content-[''] after:absolute after:inline-block after:w-full after:h-full after:bg-black after:top-0 after:opacity-[40%]">
                <img
                  src={gallery03}
                  className="max-w-[250%] lg:max-w-[180%] xl:max-w-[170%] translate-x-[-20%]"
                  alt=""
                />
                <div className="w-full absolute top-[10%] px-[20px] text-white z-10 text-center">
                  <span className="block font-bold text-2xl">
                    Đăng nhập ngay!
                  </span>
                  <span className="block mt-[10px] text-[15px]">
                    Nhiều khuyến mãi lớn và hàng ngàn phần quà đang đợi bạn!
                  </span>
                </div>
                <LinkRouter
                  to="/login"
                  className="absolute text-[14px] text-white z-10 border-2 border-white hover:font-medium hover:text-gray-600  hover:bg-white   rounded-[20px] px-[10px] py-[5px] bottom-[20%] left-[50%] translate-x-[-50%]"
                >
                  ĐĂNG NHẬP
                </LinkRouter>
              </div>
            </div>
            <div className="col-span-3 text-center">
              <div className="w-[100%] sm:w-[80%] md:w-[70%] mx-auto mt-14 pb-[130px] md:px-10">
                <p className="font-bold text-xl">Đăng ký tài khoản</p>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div class="relative z-0 mb-6 w-full group">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        onChange={(e) => setFirstName(e.target.value)}
                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                        autoFocus
                      />
                      <label
                        for="floating_email"
                        class="absolute left-0 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Họ và tên đệm <span className="text-red-400">*</span>
                      </label>
                    </div>
                    <div class="relative z-0 mb-6 w-full group">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        onChange={(e) => setLastName(e.target.value)}
                        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        for="floating_email"
                        class="absolute left-0 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Tên <span className="text-red-400">*</span>
                      </label>
                    </div>
                  </div>
                  <div class="relative z-0 mb-6 w-full group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      for="floating_email"
                      class="absolute left-0 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Email address<span className="text-red-400"> *</span>
                    </label>
                  </div>
                  <div class="relative z-0 mb-6 w-full group">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      for="floating_email"
                      class="absolute left-0 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Password <span className="text-red-400"> *</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    class="text-white  mt-[20px] w-full bg-[#d4b07a] hover:bg-[#ca9442] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    ĐĂNG KÝ
                  </button>
                </form>
                <p className="md:hidden mt-[35px] text-gray-600">
                  Bạn đã có tài khoản:{" "}
                  <LinkRouter
                    to="/login"
                    className="text-blue-400 underline hover:text-blue-600"
                  >
                    Đăng nhập
                  </LinkRouter>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

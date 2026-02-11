import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { userContext } from "../_app";
import { useTranslation } from "react-i18next";

function SignIn(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const { t } = useTranslation();

  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });

  const [focusedField, setFocusedField] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    const data = {
      username: userDetail.email.toLowerCase(),
      password: userDetail.password,
    };

    props.loader(true);

    Api("post", "login", data, router).then(
      (res) => {
        props.loader(false);

        if (res?.status) {
          localStorage.setItem("userDetail", JSON.stringify(res.data));
          localStorage.setItem("token", res.data.token);
          setUser(res.data);
          router.push("/");

          setUserDetail({ email: "", password: "" });

          props.toaster({
            type: "success",
            message: "You are successfully logged in",
          });
        } else {
          props.toaster({
            type: "error",
            message: res?.data?.message || "Login failed",
          });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.message || "Something went wrong",
        });
      },
    );
  };

  return (
    <div
      className="min-h-[700px] flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/image12.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden md:min-h-[600px]">
        <div className="relative hidden md:flex flex-col justify-start bg-[#111111] p-8 flex-1">
          <div className="bg-white inline-flex self-start  px-3 py-1.5 rounded-[4px]">
            <span className="text-[#111111] font-black text-lg tracking-widest">
              KRYT
            </span>
          </div>

          <h2 className="text-white text-center md:text-4xl mb-6 mt-4">
            {t("Defy the Past")}
            <br />
            {t("Step into the")}
            <br />
            {t("Future")}
          </h2>

          <div className="absolute bottom-0 -right-14">
            <img src="/headPhone.png" alt="Headphone" className="h-[430px]" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white md:px-4 px-6 py-14 flex-[1.75]">
          <h1 className="text-2xl font-bold text-[#111111] mb-10">
            {t("Welcome Back!")}
          </h1>

          <form onSubmit={submit} className="w-full max-w-md">
            <div className="mb-5 ">
              <input
                type="email"
                required
                value={userDetail.email}
                placeholder={t("Email")}
                onChange={(e) =>
                  setUserDetail({ ...userDetail, email: e.target.value })
                }
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={`w-full bg-transparent text-black outline-none py-2 border-b-2 ${
                  focusedField === "email" ? "border-[#111]" : "border-gray-200"
                }`}
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder={t("Password")}
                  value={userDetail.password}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, password: e.target.value })
                  }
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full bg-transparent text-black outline-none py-2 pr-7 border-b-2 ${
                    focusedField === "password"
                      ? "border-[#111]"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <IoEyeOutline className="text-black"/> : <IoEyeOffOutline className="text-black"/>}
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-4 mb-8">
              <button
                // type="button"
                onClick={() => router.push("/auth/forgotPassword")}
                className="text-sm font-semibold text-[#111] hover:underline"
              >
                {t("Forget Password")}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#111] text-white py-3.5 rounded-lg hover:bg-[#2a2a2a]"
            >
              {t("Login")}
            </button>

            <p className="text-center text-sm text-gray-400 mt-7">
              {t("Don't have an account?")}{" "}
              <span
                className="font-bold text-[#111] cursor-pointer hover:underline"
                onClick={() => router.push("/auth/signUp")}
              >
                {t("Register Now")}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

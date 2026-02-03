import React, { useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

function SignUp(props) {
  const router = useRouter();
  const { t } = useTranslation();

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    type: "",
    phoneNumber: "",
    password: "",
  });

  const [eyeIcon, setEyeIcon] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    props.loader(true);

    const data = {
      email: userDetail.email.toLowerCase(),
      username: userDetail.name,
      password: userDetail.password,
      number: userDetail.phoneNumber,
      type: userDetail.type,
    };

    Api("post", "signUp", data, router).then(
      (res) => {
        props.loader(false);
        if (res?.success) {
          router.push("/auth/signIn");
          setUserDetail({
            name: "",
            email: "",
            type: "",
            phoneNumber: "",
            password: "",
          });
          props.toaster({ type: "success", message: "Register successfully" });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
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
      }}
    >
      <div className="flex w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden min-h-[600px]">
        {/* LEFT */}
        <div className="relative flex flex-col bg-[#111111] p-8 flex-1">
          <div className="bg-white inline-flex self-start px-3 py-1.5 rounded">
            <span className="font-black tracking-widest text-black">KRYT</span>
          </div>
          <h2 className="text-white text-center md:text-4xl mb-6 mt-4">
            {t("Defy the Past")}
            <br />
            {t("Step into the")}
            <br />
            {t("Future")}
          </h2>

          <div className="absolute bottom-0 -right-14">
            <img src="/headPhone.png" className="h-[430px]" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white px-4 py-14 flex-[1.75]">
          <h1 className="text-2xl font-bold mb-10 text-black">
            {t("Create Account")}
          </h1>

          <form className="w-full max-w-md" onSubmit={submit}>
            <select
              value={userDetail.type}
              onChange={(e) =>
                setUserDetail({ ...userDetail, type: e.target.value })
              }
              onFocus={() => setFocusedField("type")}
              onBlur={() => setFocusedField(null)}
              required
              className={`w-full bg-transparent mb-5 text-gray-500 outline-none py-2 pr-7 border-b-2
              ${focusedField === "type" ? "border-black" : "border-gray-300"}`}
            >
              <option value="">{t("Select User Type")}</option>
              <option value="USER">{t("User")}</option>
              <option value="SELLER">{t("Seller")}</option>
            </select>

            {/* NAME */}
            <input
              type="text"
              placeholder={t("Name")}
              required
              value={userDetail.name}
              onChange={(e) =>
                setUserDetail({ ...userDetail, name: e.target.value })
              }
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              className={`w-full py-2 mb-5 text-gray-500 border-b-2 outline-none
              ${focusedField === "name" ? "border-black" : "border-gray-300"}`}
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder={t("Email")}
              required
              value={userDetail.email}
              onChange={(e) =>
                setUserDetail({ ...userDetail, email: e.target.value })
              }
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`w-full bg-transparent mb-5  text-gray-500 outline-none py-2 pr-7 border-b-2
              ${focusedField === "email" ? "border-black" : "border-gray-300"}`}
            />

            <input
              type="number"
              placeholder={t("Phone Number")}
              required
              value={userDetail.phoneNumber}
              onChange={(e) =>
                setUserDetail({ ...userDetail, phoneNumber: e.target.value })
              }
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              className={`w-full bg-transparent  text-gray-500 mb-5 outline-none py-2 pr-7 border-b-2
              ${focusedField === "phone" ? "border-black" : "border-gray-300"}`}
            />

            <div className="relative mb-10">
              <input
                type={eyeIcon ? "text" : "password"}
                placeholder="********"
                required
                value={userDetail.password}
                onChange={(e) =>
                  setUserDetail({ ...userDetail, password: e.target.value })
                }
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={`w-full bg-transparent  text-gray-500 outline-none py-2 pr-7 border-b-2
                ${focusedField === "password" ? "border-black" : "border-gray-300"}`}
              />
              <div
                className="absolute top-3 right-4 cursor-pointer"
                onClick={() => setEyeIcon(!eyeIcon)}
              >
                {eyeIcon ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </div>
            </div>

            <button
              type="submit"
              className="bg-custom-red h-[45px] w-full rounded-lg text-white font-bold mb-5"
            >
              {t("Sign up")}
            </button>

            <div className="flex justify-center items-center mt-10">
              <p className="text-gray-400">
                {t("Already have an account")}{" "}
                <span
                  className="font-bold cursor-pointer text-black"
                  onClick={() => router.push("/auth/signIn")}
                >
                  {t("Sign in")}
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

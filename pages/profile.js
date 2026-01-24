import React, { useContext, useEffect, useRef, useState } from "react";
import { Api } from "@/services/service";
import { IoIosContact } from "react-icons/io";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import { userContext } from "./_app";
import { useRouter } from "next/router";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { useTranslation } from "react-i18next";

function Profile(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const f = useRef(null);
  const [ProfileData, setProfileData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    number: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();

  const Submit = () => {
    if (password === "") {
      props.toaster({ type: "error", message: "New Password is required" });
      return;
    }

    if (confirmPassword === "") {
      props.toaster({ type: "error", message: "Confirm Password is required" });
      return;
    }

    if (confirmPassword !== password) {
      props.toaster({
        type: "error",
        message: "Your password is not matched with confirm password",
      });
      return;
    }

    const data = {
      password,
    };
    Api("post", "profile/changePassword", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setPassword("");
          setConfirmPassword("");
          props.toaster({ type: "success", message: res?.data?.message });
        } else {
          console.log(res?.data?.message);
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  useEffect(() => {
    profile();
    props.loader(false);
  }, []);

  const profile = () => {
    props.loader(true);
    Api("get", "getProfile", "", router).then(
      (res) => {
        console.log("res================> profile data ::", res);
        props.loader(false);

        if (res?.status) {
          setProfileData(res?.data);
          setUserDetail({
            name: res?.data?.username,
            email: res?.data?.email,
            userimg: res?.data?.profile || "/Rectangle-62.png",
            profile: res?.data?.profile,
            number: res?.data?.number,
          });
        } else {
          console.log(res?.data?.message);
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const submit = () => {
    if (userDetail?.name === "") {
      props.toaster({ type: "error", message: "Name is required" });
      return;
    }

    if (userDetail?.email === "") {
      props.toaster({ type: "error", message: "Email is required" });
      return;
    }

    if (userDetail?.number === "") {
      props.toaster({ type: "error", message: "Phone number is required" });
      return;
    }

    props.loader(true);
    const data = {
      email: userDetail.email.toLowerCase(),
      username: userDetail.name,
      number: userDetail.number,
    };
    Api("post", "updateProfile", data, router).then(
      (res) => {
        console.log("res================> update profile", res);
        props.loader(false);

        if (res?.status) {
          props.toaster({
            type: "success",
            message: "Profile updated successfully",
          });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  return (
    <>
      <div className="min-h-[500px] bg-white px-2 py-8 flex justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
          <div className="bg-white border border-black/10 rounded-2xl shadow-lg">
            <div className="border-b border-black/10 py-6 text-center">
              <h1 className="text-3xl font-bold text-black">
                {t("My Profile")}
              </h1>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              <div>
                <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3 focus-within:border-black transition">
                  <IoIosContact className="text-black/60 w-5 h-5" />
                  <input
                    className="w-full bg-transparent outline-none text-black placeholder-black/50"
                    placeholder={t("Name")}
                    value={userDetail.name}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, name: e.target.value })
                    }
                  />
                </div>
                {submitted && !userDetail.name && (
                  <p className="text-sm text-black/70 mt-1">
                    {t("Name is required")}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3 focus-within:border-black transition">
                  <AiOutlineMail className="text-black/60 w-5 h-5" />
                  <input
                    className="w-full bg-transparent outline-none text-black placeholder-black/50"
                    placeholder={t("Email")}
                    value={userDetail.email}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, email: e.target.value })
                    }
                  />
                </div>
                {submitted && !userDetail.email && (
                  <p className="text-sm text-black/70 mt-1">
                    {t("Email is required")}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3 focus-within:border-black transition">
                  <MdOutlinePhoneAndroid className="text-black/60 w-5 h-5" />
                  <input
                    className="w-full bg-transparent outline-none text-black placeholder-black/50"
                    placeholder={t("Phone number")}
                    value={userDetail.number}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, number: e.target.value })
                    }
                  />
                </div>
                {submitted && !userDetail.number && (
                  <p className="text-sm text-black/70 mt-1">
                    {t("Phone is required")}
                  </p>
                )}
              </div>

              <button
                onClick={submit}
                className="w-full bg-black text-white py-3 rounded-xl text-lg font-medium hover:bg-black/90 transition"
              >
                {t("Update")}
              </button>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-2xl shadow-lg">
            <div className="border-b border-black/10 py-6 text-center">
              <h2 className="text-3xl font-bold text-black">
                {t("Change Password")}
              </h2>
            </div>

            <div className="p-6 md:p-8 space-y-5">
             
              <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3 focus-within:border-black transition">
                <AiFillLock className="text-black/60 w-5 h-5" />
                <input
                  type="password"
                  placeholder={t("New Password")}
                  className="w-full bg-transparent outline-none text-black placeholder-black/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Confirm Password */}
              <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3 focus-within:border-black transition">
                <AiFillLock className="text-black/60 w-5 h-5" />
                <input
                  type="password"
                  placeholder={t("Confirm Password")}
                  className="w-full bg-transparent outline-none text-black placeholder-black/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                onClick={Submit}
                className="w-full bg-black text-white py-3 rounded-xl text-lg font-medium hover:bg-black/90 transition"
              >
                {t("Submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

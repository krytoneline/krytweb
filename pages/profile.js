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
    number: ""
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
          setPassword('')
          setConfirmPassword('')
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
            number: res?.data?.number
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
      <div className="bg-white w-full h-full md:my-10 my-1 px-2 md:px-0  flex flex-col justify-center items-center ">
        <div className="w-full mx-auto max-w-2xl flex flex-col  justify-center items-center self-center  rounded-xl  shadow  p-5">
          <div className="flex justify-center items-center md:pt-5 pt-5 pb-5">
            <h1 className="text-black text-3xl	font-nunito font-bold	">
              {t("My Profile")}
            </h1>
          </div>

          <div className="md:px-20 px-5 py-5 self-center rounded-xl w-full">
            <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange ">
              <IoIosContact className=" text-custom-gray h-5 w-5 ml-2" />
              <input
                className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                placeholder={t("Name")}
                value={userDetail.name}
                onChange={(text) => {
                  setUserDetail({ ...userDetail, name: text.target.value });
                }}
              />
            </div>
            {submitted && userDetail.name === "" && (
              <p className="text-red-700 mt-1">{t("Name is required")}</p>
            )}

            <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange mt-4">
              <AiOutlineMail className=" text-custom-gray h-5 w-5 ml-2" />
              <input
                className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                placeholder={t("Email")}
                value={userDetail.email}
                onChange={(text) => {
                  setUserDetail({ ...userDetail, email: text.target.value });
                }}
              />
            </div>
            {submitted && userDetail.email === "" && (
              <p className="text-red-700 mt-1">{t("Email is required")}</p>
            )}

            <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange mt-4">
              <MdOutlinePhoneAndroid className=" text-custom-gray h-5 w-5 ml-2" />
              <input
                className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                placeholder={t("Phone number")}
                value={userDetail.number}
                onChange={(text) => {
                  setUserDetail({ ...userDetail, number: text.target.value });
                }}
              />
            </div>
            {submitted && userDetail.number === "" && (
              <p className="text-red-700 mt-1">{t("Phone is required")}</p>
            )}

            <div className="flex justify-center items-center mt-5">
              <button
                onClick={submit}
                type="button"
                className="text-white bg-black   font-nunito   text-center md:h-14 h-10 w-full rounded-2xl"
              >
                {t("Update")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full   flex items-center md:my-10 my-5 justify-center px-2 md:px-0">
        <div className="h-full w-full flex flex-col justify-center items-end">
          <div className="w-full mx-auto max-w-2xl h-full">
            <div className="flex w-full items-center justify-center h-full">
              <div className="flex w-full  px-3 flex-col justify-center items-center md:px-7 shadow-xl  border rounded-xl  ">
                <p className="text-black text-3xl font-bold my-5">
                  {" "}
                  {t("Change Password")}
                </p>
                <div className="mb-3 block flex-col md:flex w-full justify-start ">
                  <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange ">
                    <AiFillLock className=" text-custom-gray h-5 w-5 ml-2" />
                    <input
                      placeholder={t("New Password")}
                      type="password"
                      className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                      value={password}
                      onChange={(text) => {
                        setPassword(text.target.value);
                      }}
                    />
                  </div>

                  <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange mt-4">
                    <AiFillLock className=" text-custom-gray h-5 w-5 ml-2" />
                    <input
                      placeholder={t("Confirm Password")}
                      type="password"
                      className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                      value={confirmPassword}
                      onChange={(text) => {
                        setConfirmPassword(text.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center w-full items-center sm:my-5 my-2">
                  <button
                    onClick={Submit}
                    type="button"
                    className="text-white bg-black  sm:py-5 py-2 w-full rounded-2xl text-xl"
                  >
                    {t("Submit")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile

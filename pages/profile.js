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
      },
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
      },
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
      },
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto mb-6">
          <p className="text-sm text-gray-600">
            Home / <span className="text-gray-900">Profile</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4 md:p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Edit Your Profile
          </h1>

          {/* Profile Form */}
          <div className="space-y-6">
            {/* First Name and Last Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  First Name
                </label>
                <input
                  className="w-full bg-gray-100 border-0 rounded px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-0"
                  placeholder="Md"
                  value={userDetail.name}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, name: e.target.value })
                  }
                />
                {submitted && !userDetail.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {t("Name is required")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  className="w-full bg-gray-100 border-0 rounded px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-0"
                  placeholder="Rimel"
                  value={userDetail.number}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, number: e.target.value })
                  }
                />
                {submitted && !userDetail.number && (
                  <p className="text-sm text-red-600 mt-1">
                    {t("Phone is required")}
                  </p>
                )}
              </div>
            </div>

            {/* Email and Address Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  className="w-full bg-gray-100 border-0 rounded px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-0"
                  placeholder="rimel1111@gmail.com"
                  value={userDetail.email}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, email: e.target.value })
                  }
                />
                {submitted && !userDetail.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {t("Email is required")}
                  </p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Address
                </label>
                <input
                  className="w-full bg-gray-100 border-0 rounded px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-0"
                  placeholder="Kingston, 5236, United State"
                  // Add address field to your state if needed
                />
              </div> */}
            </div>

            {/* Password Changes Section */}
            <div className="pt-6">
              <h2 className="text-base font-medium text-gray-900 mb-4">
                Password Changes
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="New Passwod"
                    className="w-full bg-gray-100 border-0 rounded px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-0"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Confirm New Passwod"
                    className="w-full bg-gray-100 border-0 rounded px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-0"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row items-center gap-4 pt-4 justify-end">
              <button className="border-2 border-gray-400 rounded-xl px-6 py-3 text-gray-900 hover:text-gray-700 transition">
                Cancel
              </button>

              <button
                onClick={submit}
                className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-700 transition"
              >
                Save 
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

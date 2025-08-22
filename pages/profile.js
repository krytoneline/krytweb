import React, { useContext, useEffect, useRef, useState } from "react";
import { checkForEmptyKeys } from "@/services/InputsNullChecker";
// import { Api, ApiFormData } from "@/services/service";
import { Api } from "@/services/service";
import { ApiFormData } from "@/services/service";
import { IoIosContact } from "react-icons/io";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
// import { useRouter } from "next/router";
// import { userContext } from "../_app";
import { userContext } from "./_app";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Head from "next/head";
// import ChangePassword from "@/components/changePassword";
import { MdEdit } from "react-icons/md";
// import isAuth from "@/components/isAuth";
// import Router from "next/router";
import { MdOutlinePhoneAndroid } from "react-icons/md";


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
    // profile: "",
    // userimg: "",
  });

  // Change password code

  const [showEmail, setShowEmail] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState();

  // const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


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
  // Change password code



  //   const handleImageChange = (event) => {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     let key = event.target.name;
  //     reader.onloadend = () => {
  //       const base64 = reader.result;
  //       console.log(base64);
  //       setUserDetail({ ...userDetail, userimg: base64, profile: file });
  //     };

  //     if (file) {
  //       reader.readAsDataURL(file);
  //     }
  //   };

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
    // let { anyEmptyInputs } = checkForEmptyKeys(userDetail);
    // if (anyEmptyInputs.length > 0) {
    //   setSubmitted(true);
    //   return;
    // }
    props.loader(true);
    const data = {
      email: userDetail.email.toLowerCase(),
      username: userDetail.name,
      number: userDetail.number,
    };
    // const data = new FormData();
    // data.append("email", userDetail.email.toLowerCase());
    // data.append("username", userDetail.name);
    // data.append("profile", userDetail.profile);


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

  //   const deleteAccount = () => {
  //     Swal.fire({
  //       position: "center",
  //       icon: "error",
  //       title: "Delete your Account ?",
  //       showConfirmButton: true,
  //       showCancelButton: true,
  //       confirmButtonText: "Delete",
  //       cancelButtonText: "Cancel",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         setUser({});
  //         localStorage.removeItem("userDetail");
  //         router.push("/");
  //         props.toaster({ type: "success", message: "Account Deleted" });
  //       }
  //     });
  //     };



  return (
    <>
      {/* <h1 className="text-black mx-6 my-5 text-2xl font-semibold">
        Edit <span className="text-custom-orange">Profile</span>
      </h1> */}

      {/* <Head>
        <title>Profile Settings | Update Personal Info </title>
        <meta
          name="description"
          content="Edit your personal information, update contact details, and manage account settings easily through your ADN Cleaning profile page."
        />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_STRIPE_API_PORT}/myProfile/profile/`}
          key="canonical"
        />
      </Head> */}

      <div className="bg-white w-full h-full md:my-10 my-1 px-2 md:px-0  flex flex-col justify-center items-center ">
        {/* py-6 -mt-16 md:-mt-24 pt-16 md:pt-24 */}

        <div className="w-full mx-auto max-w-2xl flex flex-col  justify-center items-center self-center  rounded-xl  shadow  p-5">
          <div className="flex justify-center items-center md:pt-5 pt-5 pb-5">
            <h1 className="text-black text-3xl	font-nunito font-bold	">
              My Profile
            </h1>
          </div>

          {/* <div className="flex flex-col justify-center items-center"> */}
          {/* {userDetail.userimg && (
              <div className="w-28 h-28 rounded-full relative">
                <img
                  src={userDetail.userimg}
                  className="w-28 h-28 rounded-full object-cover border-2 border-custom-orange p-1"
                  alt=""
                />
                <MdEdit
                  onClick={() => {
                    f.current.click();
                  }}
                  className="bg-dark-blue absolute z-50 cursor-pointer text-white p-1 border-2 border-white rounded-full h-8 w-8 right-0 bottom-1"
                />
              </div>
            )} */}

          {/* <input
              type="file"
              ref={f}
              className="hidden"
              onChange={handleImageChange}
            />
          </div> */}

          <div className="md:px-20 px-5 py-5 self-center rounded-xl w-full">
            <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange ">
              <IoIosContact className=" text-custom-gray h-5 w-5 ml-2" />
              <input
                className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                placeholder="Name"
                value={userDetail.name}
                onChange={(text) => {
                  setUserDetail({ ...userDetail, name: text.target.value });
                }}
              />
            </div>
            {submitted && userDetail.name === "" && (
              <p className="text-red-700 mt-1">Name is required</p>
            )}

            <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange mt-4">
              <AiOutlineMail className=" text-custom-gray h-5 w-5 ml-2" />
              <input
                className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                placeholder="Email"
                value={userDetail.email}
                onChange={(text) => {
                  setUserDetail({ ...userDetail, email: text.target.value });
                }}
              />
            </div>
            {submitted && userDetail.email === "" && (
              <p className="text-red-700 mt-1">Email is required</p>
            )}

            <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange mt-4">
              <MdOutlinePhoneAndroid className=" text-custom-gray h-5 w-5 ml-2" />
              <input
                className=" w-full pl-2  text-black  sm:text-lg text-sm rounded-2xl sm:py-4 py-2 outline-none"
                placeholder="Phone number"
                value={userDetail.number}
                onChange={(text) => {
                  setUserDetail({ ...userDetail, number: text.target.value });
                }}
              />
            </div>
            {submitted && userDetail.number === "" && (
              <p className="text-red-700 mt-1">Phone is required</p>
            )}

            <div className="flex justify-center items-center mt-5">
              <button
                onClick={submit}
                type="button"
                className="text-white bg-black   font-nunito   text-center md:h-14 h-10 w-full rounded-2xl"
              >
                Update
              </button>
            </div>
            {/* <div className="flex justify-center items-center mt-5">
              <button
                onClick={deleteAccount}
                type="button"
                className="text-white bg-red-500  font-nunito   text-center md:h-14 h-10 w-full rounded-2xl"
              >
                Delete Account
              </button>
            </div> */}
          </div>
        </div>

        {/* <ChangePassword {...props} /> */}
      </div>

      {/* change password codt start from here */}

      <div className="w-full   flex items-center md:my-10 my-5 justify-center px-2 md:px-0">
        {/* -mt-16 md:-mt-24 pt-8 md:pt-14 */}
        <div className="h-full w-full flex flex-col justify-center items-end">
          <div className="w-full mx-auto max-w-2xl h-full">
            <div className="flex w-full items-center justify-center h-full">
              <div className="flex w-full  px-3 flex-col justify-center items-center md:px-7 shadow-xl  border rounded-xl  ">
                <p className="text-black text-3xl font-bold my-5">
                  {" "}
                  Change Password
                </p>
                <div className="mb-3 block flex-col md:flex w-full justify-start ">
                  <div className="mr-2 relative w-full  sm:pb-0 pb-1 flex rounded-2xl  justify-start items-center border outline-custom-orange ">
                    <AiFillLock className=" text-custom-gray h-5 w-5 ml-2" />
                    <input
                      placeholder="New Password"
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
                      placeholder="Confirm Password"
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
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* change password codt end */}
    </>
  );
}

export default Profile

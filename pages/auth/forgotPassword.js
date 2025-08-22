import React, { useState } from 'react'
import { useRouter } from "next/router";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { Api } from '@/services/service';
import { useTranslation } from "react-i18next";

function forgotPassword(props) {
    const router = useRouter();
    const [eyeIcon, setEyeIcon] = useState(false);
    const [eyeIcons, setEyeIcons] = useState(false);
    const [showEmail, setShowEmail] = useState(true);
    const [email, setEmail] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState();
    const { t } = useTranslation();

    const sendOtp = () => {
        if (email === "") {
            props.toaster({ type: "error", message: "Email is required" });
            return;
        }

        const data = {
            email: email,
        };
        console.log(data);
        props.loader(true);
        Api("post", "sendOTP", data, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.status) {
                    setShowEmail(false);
                    setShowOtp(true);
                    setShowPassword(false);
                    setToken(res?.data?.token);
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

    const verifyOtp = () => {
        if (otp === "") {
            props.toaster({ type: "error", message: "OTP is required" });
            return;
        }

        const data = {
            otp,
            token,
        };

        console.log(data);
        props.loader(true);
        Api("post", "verifyOTP", data, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.status) {
                    setShowEmail(false);
                    setShowOtp(false);
                    setShowPassword(true);
                    setToken(res?.data?.token);
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

    const Submit = () => {
        if (confirmPassword !== password) {
            props.toaster({
                type: "error",
                message: "Your password is not matched with confirm password",
            });
            return;
        }

        if (password === "") {
            props.toaster({ type: "error", message: "New Password is required" });
            return;
        }
        if (confirmPassword === "") {
            props.toaster({ type: "error", message: "Confirm Password is required" });
            return;
        }

        const data = {
            password,
            token,
        };
        Api("post", "changePassword", data, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.status) {
                    setShowEmail(true);
                    setShowOtp(false);
                    setShowPassword(false);
                    props.toaster({ type: "success", message: res?.data?.message });
                    router.push("/auth/signIn");
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

    return (
        <div className="bg-white w-full">
            <section className="bg-white w-full  relative flex flex-col justify-center items-center">
                <div className="max-w-7xl mx-auto w-full md:px-0 px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <div className="bg-custom-lightGrayColors w-full rounded-[20px] border border-custom-darkGrayColor md:p-10 p-5">
                        <div className="grid md:grid-cols-3 grid-cols-1 w-full md:gap-0 gap-5">
                            <div className="flex flex-col justify-center">
                                <p className="md:text-3xl text-2xl text-black font-bold pb-5 text-center">{t("Forgot Password")}</p>

                                {showEmail && (<input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[5px]  border-2 border-custom-newLightGray font-normal md:text-lg text-base text-black outline-none mb-5" type="email" placeholder={t("Email")}
                                    value={email}
                                    onChange={(text) => {
                                        setEmail(text.target.value);
                                    }}
                                />)}

                                {showOtp && (<input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[5px]  border-2 border-custom-newLightGray font-normal md:text-lg text-base text-black outline-none mb-5" type="number" placeholder={t("OTP")}
                                    value={otp}
                                    onChange={(text) => {
                                        setOtp(text.target.value);
                                    }} />)}


                                {showPassword && (<div>
                                    <div className='relative'>
                                        <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[5px]  border-2 border-custom-newLightGray font-normal md:text-lg text-base text-black outline-none mb-5" placeholder={t("New Password")}
                                            type={!eyeIcon ? "password" : "text"}
                                            value={password}
                                            onChange={(text) => {
                                                setPassword(text.target.value);
                                            }}
                                        />
                                        <div className='absolute md:top-[14px] top-[10px] right-[12px]'>
                                            {!eyeIcon && <IoEyeOffOutline className='w-[20px] h-[20px] text-custom-newLightGray' onClick={() => { setEyeIcon(true); }} />}
                                            {eyeIcon && <IoEyeOutline className='w-[20px] h-[20px] text-custom-newLightGray' onClick={() => { setEyeIcon(false); }} />}
                                        </div>
                                    </div>

                                    <div className='relative'>
                                        <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[5px]  border-2 border-custom-newLightGray font-normal md:text-lg text-base text-black outline-none mb-5" placeholder={t("Confirm Password")}
                                            type={!eyeIcons ? "password" : "text"}
                                            value={confirmPassword}
                                            onChange={(text) => {
                                                setConfirmPassword(text.target.value);
                                            }}
                                        />
                                        <div className='absolute md:top-[14px] top-[10px] right-[12px]'>
                                            {!eyeIcons && <IoEyeOffOutline className='w-[20px] h-[20px] text-custom-newLightGray' onClick={() => { setEyeIcons(true); }} />}
                                            {eyeIcons && <IoEyeOutline className='w-[20px] h-[20px] text-custom-newLightGray' onClick={() => { setEyeIcons(false); }} />}
                                        </div>
                                    </div>
                                </div>)}

                                {showEmail && (<button className="bg-custom-red md:h-[50px] h-[40px] w-full rounded-[10px] font-bold md:text-xl text-base text-white md:mb-10 mb-5" onClick={sendOtp}>{t("Send OTP")}</button>)}
                                {showOtp && (<button className="bg-custom-red md:h-[50px] h-[40px] w-full rounded-[10px] font-bold md:text-xl text-base text-white md:mb-10 mb-5" onClick={verifyOtp}>{t("Verify")}</button>)}
                                {showPassword && (<button className="bg-custom-red md:h-[50px] h-[40px] w-full rounded-[10px] font-bold md:text-xl text-base text-white md:mb-10 mb-5" onClick={Submit}>{t("Submit")}</button>)}
                                <p className="md:text-lg text-base text-black font-normal">
                                    {t("Already have an account")} <span className="font-bold text-black cursor-pointer" onClick={() => {
                                        router.push("/auth/signIn");
                                    }}>{t("sign in")}</span>
                                </p>
                            </div>
                            <div className='md:flex justify-center items-center col-span-2 hidden'>
                                <img className='h-96 object-contain' src='/image-17.png' />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default forgotPassword

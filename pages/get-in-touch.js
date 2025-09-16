import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

function GetInTouch(props) {
  const router = useRouter();
  const [getInTouchData, setGetInTouchData] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
    description: "",
  });
  const { t } = useTranslation();

  const submit = (e) => {
    e.preventDefault();
    // return
    props.loader(true);
    const data = {
      first_name: getInTouchData.firstName,
      email: getInTouchData.email.toLowerCase(),
      phone: getInTouchData.phoneNumber,
      description: getInTouchData.description,
    };
    Api("post", "getInTouch", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setGetInTouchData({
            firstName: "",
            email: "",
            phoneNumber: "",
            description: "",
          });
          props.toaster({
            type: "success",
            message:
              "Thank you for your message. We'll get back to you within 24 hours.",
          });
        } else {
          console.log(res?.data?.message);
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  return (
    <div className="bg-white w-full">
      <section className="bg-white w-full flex flex-col justify-center items-center max-w-4xl mx-auto">
        <div className="md:px-10 mx-auto w-full  px-5 md:pt-10 pt-5 md:pb-10 pb-5">
          <div className="flex flex-col justify-center items-center">
            <p className="text-black font-semibold md:text-4xl text-2xl text-center">
              {t("Get In Touch With Us")}
            </p>
            <p className="text-custom-newGray font-normal text-base md:pt-5 pt-2 md:w-[560px] text-center">
              {t(
                "For more information about our product & services. please feel free to drop us an email. our staff always be there to help you out. do not hesitate!"
              )}
            </p>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 w-full md:pt-10 pt-5">
            <div className="flex flex-col justify-start md:items-center items-start">
              <div className="w-full justify-center">
                <div className="flex justify-start items-center">
                  <div className="bg-black md:w-[40px] w-[35px] md:h-[40px] h-[35px] rounded-full flex justify-center items-center">
                    <FaLocationDot className="md:w-[22px] w-[15px] md:h-[22px] h-[15px] text-white" />
                  </div>
                  <p className="text-black md:text-2xl text-lg font-semibold ml-2">
                    {t("Address")}
                  </p>
                </div>
                <p className="text-black font-normal text-base pt-2 ml-12 md:ml-12">
                  SYNCOPE TECHNOLOGY LTD
                </p>
                <p className="text-black font-normal text-base pt-2 ml-12 md:ml-12">
                  Royal Road, La Paix Piton, Mauritius
                </p>
              </div>
              <div className="w-full justify-center mt-10">
                <div className="flex justify-start items-center">
                  <div className="bg-black md:w-[40px] w-[35px] md:h-[40px] h-[35px] rounded-full flex justify-center items-center">
                    <FaPhoneAlt className="md:w-[22px] w-[15px] md:h-[22px] h-[15px] text-white" />
                  </div>
                  <p className="text-black md:text-2xl text-lg font-semibold ml-2">
                    {t("Phone")}
                  </p>
                </div>
                <p className="text-black font-normal text-base pt-2 ml-12 md:ml-12">
                  {t("Mobile")} : <a href="tel:+23057322255">+23057322255</a>
                </p>
                {/* <p className='text-black font-normal text-base pt-2 ml-10'>{t("Hotline: +(84) 456-6789")}</p> */}
              </div>
            </div>

            <form className="md:pt-0 pt-5 relative" onSubmit={submit}>
              <div className="w-full">
                <p className="text-black font-normal  text-base">
                  {t("First Name")}
                </p>
                <input
                  className="bg-white md:w-[428px] w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3"
                  type="text"
                  placeholder={t("First Name")}
                  required
                  value={getInTouchData.firstName}
                  onChange={(text) => {
                    setGetInTouchData({
                      ...getInTouchData,
                      firstName: text.target.value,
                    });
                  }}
                />
              </div>

              <div className="w-full">
                <p className="text-black font-normal  text-base">
                  {t("Phone Number")}
                </p>
                <input
                  className="bg-white md:w-[428px] w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3"
                  type="number"
                  placeholder={t("Phone Number")}
                  required
                  value={getInTouchData.phoneNumber}
                  onChange={(text) => {
                    setGetInTouchData({
                      ...getInTouchData,
                      phoneNumber: text.target.value,
                    });
                  }}
                />
              </div>

              <div className="w-full">
                <p className="text-black font-normal  text-base">
                  {t("Email Address")}
                </p>
                <input
                  className="bg-white md:w-[428px] w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3"
                  type="email"
                  placeholder={t("Email Address")}
                  required
                  value={getInTouchData.email}
                  onChange={(text) => {
                    setGetInTouchData({
                      ...getInTouchData,
                      email: text.target.value,
                    });
                  }}
                />
              </div>

              <div className="w-full">
                <p className="text-black font-normal  text-base">
                  {t("Message")}
                </p>
                <textarea
                  className="bg-white md:w-[428px] w-full px-5 py-2 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3"
                  rows={4}
                  placeholder={t("Hi! i’d like to ask about")}
                  value={getInTouchData.description}
                  onChange={(e) => {
                    setGetInTouchData({
                      ...getInTouchData,
                      description: e.target.value,
                    });
                  }}
                  required
                />
              </div>
              <div className="flex md:justify-start justify-center">
                <button
                  className="bg-black w-[237px] md:h-[50px] h-[40px] rounded-[5px] text-white font-normal text-base"
                  type="submit"
                >
                  {t("Submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GetInTouch;

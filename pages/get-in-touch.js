import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
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
      },
    );
  };

  return (
    <div className="min-h-[600px] bg-gray-50 p-4 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:mb-8 mb-3">
          <p className="text-sm text-gray-600">
            <span
              className="hover:text-gray-900 cursor-pointer"
              onClick={() => router.push("/")}
            >
              {t("Home")}
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{t("Contact")}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 bg-white rounded-lg shadow-sm p-4 md:p-12">
          <div className="space-y-8 col-span-1">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FaPhoneAlt className="w-5 h-5 text-white" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">
                  {t("Call To Us")}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-2 ">
                SYNCOPE TECHNOLOGY LTD
              </p>
              <p className="text-sm text-gray-600 mb-2 ">
                Royal Road, La Paix Piton, Mauritius
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {t("We are available 24/7, 7 days a week.")}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {" "}
                {t("Phone:")} <a href="tel:+23057322255">+23057322255</a>
              </p>
            </div>

            <hr className="border-gray-200" />

            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <FaEnvelope className="w-5 h-5 text-white" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">
                  {t("Write To US")}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {t(
                  "Fill out our form and we will contact you within 24 hours.",
                )}
              </p>
              <p className="text-sm text-gray-900 mb-2">
                {t("Emails:")}{" "}
                <a
                  href="mailto:customer@exclusive.com"
                  className="text-blue-600 underline"
                >
                  customer@exclusive.com
                </a>
              </p>
            </div>
          </div>

          <div className="col-span-2">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder={t("Your Name *")}
                  required
                  value={getInTouchData.firstName}
                  onChange={(e) =>
                    setGetInTouchData({
                      ...getInTouchData,
                      firstName: e.target.value,
                    })
                  }
                  className="px-4 py-3 bg-gray-100 rounded text-sm text-gray-900 placeholder-gray-500 outline-none focus:bg-gray-200 transition-colors"
                />
                <input
                  type="email"
                  placeholder={t("Your Email *")}
                  required
                  value={getInTouchData.email}
                  onChange={(e) =>
                    setGetInTouchData({
                      ...getInTouchData,
                      email: e.target.value,
                    })
                  }
                  className="px-4 py-3 bg-gray-100 rounded text-sm text-gray-900 placeholder-gray-500 outline-none focus:bg-gray-200 transition-colors"
                />
                <input
                  type="tel"
                  placeholder={t("Your Phone *")}
                  required
                  value={getInTouchData.phoneNumber}
                  onChange={(e) =>
                    setGetInTouchData({
                      ...getInTouchData,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="px-4 py-3 bg-gray-100 rounded text-sm text-gray-900 placeholder-gray-500 outline-none focus:bg-gray-200 transition-colors"
                />
              </div>

              {/* Message Textarea */}
              <textarea
                placeholder={t("Your Message")}
                rows={8}
                value={getInTouchData.description}
                onChange={(e) =>
                  setGetInTouchData({
                    ...getInTouchData,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-gray-100 rounded text-sm text-gray-900 placeholder-gray-500 outline-none focus:bg-gray-200 transition-colors resize-none"
              />

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-12 py-3 bg-black hover:bg-gray-800 text-white rounded font-medium transition-colors duration-200"
                >
                  {t("Send Message")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetInTouch;

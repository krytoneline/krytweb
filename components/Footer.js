import React, { useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import moment from 'moment';
import { FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { FaInstagram } from "react-icons/fa";
import { ImLinkedin } from "react-icons/im";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";

function Footer(props) {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState({
    subscriber: "",
  });
  const { t } = useTranslation();

  const addSubscriber = (e) => {
    e.preventDefault();
    const data = {
      email: userDetail?.subscriber,
    }
    props.loader(true);
    Api("post", "add-subscriber", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setUserDetail({
            subscriber: "",
          });
          props.toaster({ type: "success", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.data?.message });
      }
    );
  };

  return (
    <div>
      <div className="bg-black relative py-10">
        <div className="max-w-7xl  mx-auto h-full">
          <div className="grid md:grid-cols-5 grid-cols-1">
            <div className="text-white px-5 md:px-0 flex flex-col md:justify-start justify-center md:items-start items-center">
              <div className="py-5">
                <img
                  className="md:w-[114px] h-[67px]  object-cover  rounded-[5px] -mt-6"
                  src="/logo-1.png"
                  alt=""
                  onClick={() => { router.push('/') }}
                />
              </div>
              <p className="text-white text-sm	font-normal pb-2 md:text-start text-center">{t("Address")} -1 : Royal Road, La Paix Piton, Mauritius</p>
              <p className="text-white text-sm	font-normal pb-2 md:text-start text-center">{t("Address")} -2 : Hyde Park Crown First Floor, FF-14-21 Plot No GH-03 Sector-78, Noida, Uttar Pradesh 201306</p>
              <p className="text-white text-sm	font-normal pb-5 md:text-start text-center">{t("Mobile")} : <a href="tel:+23057322255">+23057322255</a></p>

              <div className="flex flex-row gap-3 justify-center items-center">
                <FaSquareInstagram className=" text-[40px] text-white" onClick={() => window.open("https://www.instagram.com/p/DBmBF6Ns7ij/?igsh=MTR1b2ZpeGNrOHBmZQ%3D%3D", "_blank")} />
                <ImLinkedin className="text-[35px] text-white" onClick={() => window.open("https://www.linkedin.com/authwall?trk=bf&trkInfo=AQErXiahTmuPcgAAAZTB1yj4rOHWyIlsIWNoQORNaK0VpNHS8PfToi1wI88N6mZxVzr4bDORTHaJX9D2eG6-sN7fGhO3Sa-yLWDSVBa6Piy9FoZ10xynW-MP7yqnw2c2YS4GMlE=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fkryt%2F", "_blank")} />
                <FaFacebookSquare className="text-[40px] text-white" onClick={() => window.open("https://www.facebook.com/people/KRYT/61568113250364/?mibextid=wwXIfr&rdid=lHjrt3VfJkWfzRkV&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18MG88UKJF%2F%3Fmibextid%3DwwXIfr", "_blank")} />
                {/* <img className="h-[28px] w-[28px]" src="/instagram.png" />
                <img className="h-[28px] w-[28px]" src="/tiktok.png" /> */}
              </div>
            </div>

            <div className="text-white px-5 md:px-0 flex flex-col md:justify-start justify-center md:items-center items-center col-span-3">
              <div className="flex flex-col md:items-start items-center">
                <p className="text-white text-base font-bold py-5 uppercase">{t("Quick Link")}</p>
                {/* <p className="text-white text-base font-normal cursor-pointer pb-5" onClick={() => { router.push('/product-details') }}>Products</p> */}
                <p className="text-white text-base font-normal cursor-pointer pb-5" onClick={() => { router.push('/categories/all') }}>{t("Categories")}</p>
                <p className="text-white text-base font-normal cursor-pointer pb-5" onClick={() => { router.push('/get-in-touch') }}>{t("Get In Touch")}</p>
                <p className="text-white text-base font-normal cursor-pointer" onClick={() => { router.push('/about-us') }}>{t("About us")}</p>
              </div>
            </div>

            <div className="text-white px-5 md:px-0">
              <p className="text-white text-base font-bold py-5 w-full md:text-start text-center uppercase">{t("Resources")}</p>
              <p className="text-white text-base font-normal cursor-pointer pb-5 md:text-start text-center" onClick={() => { router.push('/faq') }}>{t("FAQ")}</p>
              <p className="text-white text-base font-normal cursor-pointer pb-5 md:text-start text-center" onClick={() => { router.push('/terms-condition') }}>{t("Terms and Conditions")}</p>
              <p className="text-white text-base font-normal cursor-pointer md:text-start text-center" onClick={() => { router.push('/privacy-policy') }}>{t("Privacy Policy")}</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto h-full md:pb-0 pb-14"></div>
      </div>
    </div>
  );
}

export default Footer;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Api } from "@/services/service";
import Head from "next/head";
import Image from "next/image";
import { Shield, Users, Briefcase, Star, Clock, ShoppingCart } from "lucide-react";

const services = [
  {
    title: "Buy Products",
    description: "Shop from multiple sellers across various categories",
  },
  {
    title: "Sell Online",
    description: "List and manage your products with ease",
  },
  {
    title: "Rent Equipment",
    description: "Offer or find items for short-term rental",
  },
  {
    title: "Service Enquiry",
    description: "Connect with businesses for professional services",
  },
];

const AboutUs = (props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const features = [
    {
      icon: Shield,
      title: "All-in-One Marketplace",
      description:
        "Buy, sell, rent, and explore business services — everything you need in one powerful platform.",
    },
    {
      icon: Users,
      title: "Trusted Network",
      description:
        "Connect with verified sellers, renters, and professional service providers for secure and reliable transactions.",
    },
    {
      icon: Briefcase,
      title: "Business Growth & Enquiries",
      description:
        "Businesses can receive customer enquiries, generate leads, and expand their reach through Krytonline.",
    },
  ];

  return (
    <>
      <Head>
        <title>About Krytonline</title>
        <meta
          name="description"
          content="Krytonline is a multi-seller marketplace where you can buy, sell, rent products and connect with businesses for service enquiries."
        />
        <link rel="canonical" href="https://www.krytonline.com/about-us" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 text-black bg-white">

        {/* Hero Section */}
        <div className="border border-black rounded-3xl my-20 relative">
          <div className="flex flex-col lg:flex-row">
            <div className="max-w-2xl p-8 lg:p-12 flex flex-col justify-center min-h-[420px]">
              <h1 className="text-[26px] md:text-[32px] font-bold mb-4">
                {t("Welcome to Krytonline – Buy, Sell, Rent & Grow Your Business")}
              </h1>

              <p className="mb-6 text-[16px] leading-relaxed">
                {t(
                  "Krytonline is a unified digital marketplace where individuals and businesses can buy products, sell items, rent equipment, and explore professional services. Our platform connects customers with trusted sellers and service providers, offering a secure and seamless experience in one place."
                )}
              </p>

              <button
                className="border border-black bg-black hover:bg-white hover:text-black text-white transition px-6 py-3 rounded-lg w-fit flex items-center"
                onClick={() => router.push("/categories/all")}
              >
                {t("Explore Marketplace")}
                <ShoppingCart size={18} className="ml-2" />
              </button>
            </div>
          </div>

          <div className="absolute -top-10 right-10 lg:w-[500px] md:flex hidden">
            <div className="relative w-full h-[380px]">
              <Image
                fill
                src="/Store.png"
                alt="Krytonline marketplace"
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Why Section */}
        <div className="border border-black rounded-3xl px-6 py-12 text-center">
          <h2 className="text-[28px] md:text-[36px] font-bold mb-3">
            {t("Why Choose Krytonline")}
          </h2>

          <p className="text-[18px] mb-4">
            {t("Bringing Commerce, Services & Convenience Together")}
          </p>

          <p className="text-[15px] max-w-3xl mx-auto">
            {t(
              "We combine quality products, reliable vendors, rental options, and professional service providers to deliver a complete marketplace experience."
            )}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-black rounded-2xl p-6 text-center hover:bg-black hover:text-white transition"
            >
              <feature.icon size={40} className="mx-auto mb-4" />
              <h3 className="text-[18px] font-bold mb-3">
                {t(feature.title)}
              </h3>
              <p className="text-[14px]">{t(feature.description)}</p>
            </div>
          ))}
        </div>

        {/* Business Section */}
        <div className="border border-black rounded-3xl my-20 relative">
          <div className="lg:max-w-2xl p-8 lg:p-12">
            <h2 className="text-[28px] font-bold mb-6">
              {t("Built for Customers and Businesses")}
            </h2>

            <p className="text-[15px] mb-6">
              {t(
                "Krytonline empowers entrepreneurs, SMEs, and individuals by providing tools to sell products, offer rentals, and receive business enquiries. Our platform helps businesses grow while giving customers easy access to products and services."
              )}
            </p>

            <div className="flex gap-3 flex-wrap">
              <div className="border border-black px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <Clock size={16} />
                {t("Fast Response")}
              </div>

              <div className="border border-black px-4 py-2 rounded-full text-sm flex items-center gap-2">
                <Star size={16} />
                {t("Trusted by Businesses")}
              </div>
            </div>
          </div>

          <div className="absolute -top-10 right-10 lg:w-[450px] md:flex hidden">
            <div className="relative w-full h-[320px]">
              <Image
                fill
                src="/Rectangle25.png"
                alt="Business services"
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>


        <div className="mb-20">
          <h2 className="text-center text-[30px] font-bold mb-12">
            {t("Our Services")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="border border-black rounded-2xl p-6 text-center hover:bg-black hover:text-white transition"
              >
                <h3 className="text-[18px] font-semibold mb-2">
                  {t(service.title)}
                </h3>
                <p className="text-[14px]">{t(service.description)}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default AboutUs;

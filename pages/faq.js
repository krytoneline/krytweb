import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";

function Faq(props) {
  const router = useRouter();
  const [open, setOpen] = useState([]);
  const { t } = useTranslation();
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    faq();
  }, []);

  const faq = async () => {
    props.loader(true);
    Api("get", "faq", "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setFaqData(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      },
    );
  };

  // const faqData = [
  //     {
  //         question: 'Alright, but what exactly do you do?',
  //         answer: 'As a creative agency we work with you to develop solutions to address your brand needs. That includes various aspects of brand planning and strategy, marketing and design.'
  //     },
  //     {
  //         question: 'Alright, but what exactly do you do?',
  //         answer: 'As a creative agency we work with you to develop solutions to address your brand needs. That includes various aspects of brand planning and strategy, marketing and design.'
  //     },
  //     {
  //         question: 'Alright, but what exactly do you do?',
  //         answer: 'As a creative agency we work with you to develop solutions to address your brand needs. That includes various aspects of brand planning and strategy, marketing and design.'
  //     },
  //     {
  //         question: 'Alright, but what exactly do you do?',
  //         answer: 'As a creative agency we work with you to develop solutions to address your brand needs. That includes various aspects of brand planning and strategy, marketing and design.'
  //     },
  // ]

  const selected = (type) => {
    console.log(type);
    if (open.includes(type)) {
      const data = open.filter((f) => f !== type);
      setOpen(data);
      return;
    }
    open.push(type);
    console.log(open);
    setOpen([...open]);
  };

  return (
<div className="bg-gray-50 w-full py-10">
  <section className="max-w-7xl mx-auto px-4">
    
    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
      {t("FAQ")}
    </h2>

    {/* FAQ List */}
    <div className="space-y-4">
      {faqData.map((item, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300"
        >
          {/* Question */}
          <button
            onClick={() => selected(i)}
            className="w-full flex justify-between items-center text-left px-6 py-5 hover:bg-gray-50 transition"
          >
            <div className="flex items-start gap-4">
              <span className="text-lg font-semibold text-gray-500">
                {i + 1}.
              </span>
              <p className="text-lg md:text-xl font-semibold text-gray-800">
                {item?.question}
              </p>
            </div>

            {/* Icon */}
            <span className="text-2xl text-gray-600">
              {open.includes(i) ? "-" : "+"}
            </span>
          </button>

          {/* Answer */}
          <Collapse in={open.includes(i)} timeout="auto" unmountOnExit>
            <div className="px-6 pb-6 pt-5 text-gray-600 text-base leading-relaxed">
              {item?.answer}
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  </section>
</div>

  );
}

export default Faq;

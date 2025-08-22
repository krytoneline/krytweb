import React, { useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { Api } from '@/services/service';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';

function Faq(props) {
    const router = useRouter();
    const [open, setOpen] = useState([]);
    const { t } = useTranslation();
    const [faqData, setFaqData] = useState([])

    useEffect(() => {
        faq()
    }, [])

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
            }
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
        console.log(type)
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
        <div className="bg-white w-full">
            <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="mx-auto w-full md:px-10 px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <p className='text-2xl text-black font-bold text-center md:pb-5 pb-5'>{t("FAQ")}</p>
                    {/* {faqData.map((item, i) => (< div key={i} className={`md:px-5 md:pt-5 pt-5 px-5 border-b border-white ${open.includes(i) ? 'bg-black md:pb-5' : 'bg-custom-lightGrayColors'}`} onClick={() => selected(i)}>
                        <div className='flex justify-between md:items-center items-start pb-5'>
                            <div className='flex justify-start md:items-center items-start'>
                                <p className={`md:text-xl text-lg font-normal ${open.includes(i) ? 'text-white' : 'text-black'}`}>{i + 1}</p>
                                <p className={`md:text-xl text-lg font-bold pl-5 md:leading-[35px] ${open.includes(i) ? 'text-white' : 'text-black'}`}>{item?.question}</p>
                            </div>
                            {open.includes(i) && <img className={`md:w-[30px] w-[20px] md:h-[30px] h-[20px] md:ml-0 ml-5`} src='/image-18.png' />}
                            {!open.includes(i) && <img className={`md:w-[30px] w-[20px] md:h-[30px] h-[20px] md:ml-0 ml-5`} src='/image-19.png' />}
                        </div>
                            <p className={`md:text-lg  text-base font-normal md:pl-[72px] transition-transform duration-500 text-white ${open.includes(i) ? "translate-y-0" : "-translate-y-full"}`}>{item?.answer}</p>
                    </div>))} */}

                    {faqData.map((item, i) => (<List
                        onClick={() => selected(i)}
                        sx={{ width: '100%', maxWidth: 360, }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        className='!w-full !max-w-full cursor-pointer p-1'

                    >
                        < div key={i} className={`md:px-5 md:pt-5 pt-5 px-5  ${open.includes(i) ? 'bg-black' : 'bg-custom-lightGrayColors'}`} >
                            <div className={`flex justify-between md:items-center items-start pb-5 ${open.includes(i) ? 'pb-0 ' : 'pb-5 '}`}>
                                <div className='flex justify-start md:items-center items-start'>
                                    <p className={`md:text-xl text-lg font-normal ${open.includes(i) ? 'text-white' : 'text-black'}`}>{i + 1}</p>
                                    <p className={`md:text-xl text-lg font-bold pl-5 md:leading-[35px] ${open.includes(i) ? 'text-white' : 'text-black'}`}>{item?.question}</p>
                                </div>
                                {open.includes(i) && <img className={`md:w-[30px] w-[20px] md:h-[30px] h-[20px] md:ml-0 ml-5`} src='/image-18.png' />}
                                {!open.includes(i) && <img className={`md:w-[30px] w-[20px] md:h-[30px] h-[20px] md:ml-0 ml-5`} src='/image-19.png' />}
                            </div>
                        </div>
                        <Collapse in={open.includes(i)} timeout="auto" unmountOnExit>
                            <p className={`md:text-lg pb-5 bg-black text-base font-normal md:pl-[72px] py-2 transition-transform duration-500 text-white `}>{item?.answer}</p>

                        </Collapse>
                    </List>))}

                </div>
            </section >
        </div >
    )
}

export default Faq

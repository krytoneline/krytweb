import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { Api } from '@/services/service';
import { useTranslation } from "react-i18next";

function PrivacyPolicy(props) {
    const router = useRouter();
    const [contentData, setContentData] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        content()
    }, [])

    const content = async () => {
        props.loader(true);
        Api("get", "content", "", router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setContentData(res.data?.privacy);
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    return (
        <section className="bg-white w-full flex flex-col justify-center items-center">
            <div className="md:px-10 mx-auto w-full   px-5 md:pt-10 pt-5 md:pb-10 pb-5 md:min-h-screen min-h-[400px]">
                <p className='text-2xl text-black font-bold md:pb-5 pb-2'>{t("Privacy Policy")}</p>
                <p className='text-base	text-black font-normal' dangerouslySetInnerHTML={{ __html: contentData }}></p>
            </div>
        </section>
    )
}

export default PrivacyPolicy

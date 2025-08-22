import { Api, ApiFormData } from '@/services/service';
import React, { useRef, useState, useMemo, useContext } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { useRouter } from "next/router";
import { userContext } from './_app';
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";
import ConfirmationModal from '@/components/ConfirmationModel';

function StoreCreate(props) {
    const f = useRef(null);
    const f1 = useRef(null);
    const router = useRouter();
    const [storeCreateData, setStoreCreateData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        country: "",
        address: "",
        city: "",
        kbis: "",
        identity: "",
        phone: "",
        email: ""
    });

    const options = useMemo(() => countryList().getData(), [])
    const [value, setValue] = useState('')
    const [user, setUser] = useContext(userContext);
    const changeHandler = value => {
        setValue(value)
    }
    const { t } = useTranslation();
    const [createStoreModel, setCreateStoreModel] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        props.loader(true);
        const data = {
            userid: user?._id,
            ...storeCreateData
        };
        Api("post", "createStore", data, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.status) {
                    setStoreCreateData({
                        firstName: "",
                        lastName: "",
                        companyName: "",
                        country: "",
                        address: "",
                        city: "",
                        kbis: "",
                        identity: "",
                        phone: "",
                        email: ""
                    });
                    setUser({
                        ...user,
                        store: res.data.store
                    })
                    // props.toaster({ type: "success", message: res?.data?.message });

                    setCreateStoreModel(true)

                    // Swal.fire({
                    //     title: res?.data?.message,
                    //     showDenyButton: false,
                    //     showCancelButton: true,
                    //     confirmButtonText: "OK",
                    //     cancelButtonText: "Dashboard",
                    //     cancelButtonColor: '#FE3E00'
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                    //         router.replace("/");
                    //     } else {
                    //         router.replace("/");
                    //         window.open('https://www.admin.krytonline.com/', '_blanck')
                    //     }

                    // });

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

    const handleImageChange = (event, type) => {
        const file = event.target.files[0];
        const data = new FormData()
        data.append('file', file)
        props.loader(true);
        ApiFormData("post", "/user/fileupload", data, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res.status) {
                    setStoreCreateData({ ...storeCreateData, [type]: res.data.file })
                    props.toaster({ type: "success", message: res.data.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
        const reader = new FileReader();
        // let key = event.target.name;
        // reader.onloadend = () => {
        //   const base64 = reader.result;
        //   console.log(base64);
        //   // setData({ ...data, img: base64, profile: file });
        // };

        // if (file) {
        //   reader.readAsDataURL(file);
        // }
    };

    return (
        <div className="bg-white w-full">
            <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="mx-auto w-full md:px-10 px-5 md:pt-10 pt-5 md:pb-10 pb-5">

                    <form className='' onSubmit={submit}>
                        <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-x-24'>

                            <div className='md:order-1 order-2'>
                                <p className='text-black font-semibold md:text-4xl text-2xl pb-5'>{t("Store Create")}</p>

                                <div className='grid grid-cols-2 w-full gap-5'>
                                    <div className='w-full'>
                                        <p className='text-black font-normal  text-base'>{t("First Name")}</p>
                                        <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3" type="text" placeholder={t("First Name")}
                                            required
                                            value={storeCreateData.firstName}
                                            onChange={(text) => {
                                                setStoreCreateData({
                                                    ...storeCreateData,
                                                    firstName: text.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-black font-normal  text-base'>{t("Last Name")}</p>
                                        <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3" type="text" placeholder={t("Last Name")}
                                            required
                                            value={storeCreateData.lastName}
                                            onChange={(text) => {
                                                setStoreCreateData({
                                                    ...storeCreateData,
                                                    lastName: text.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='w-full'>
                                    <p className='text-black font-normal  text-base'>{t("Company Name (Optional)")}</p>
                                    <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3" type="text" placeholder={t("Company Name (Optional)")}
                                        value={storeCreateData.companyName}
                                        onChange={(text) => {
                                            setStoreCreateData({
                                                ...storeCreateData,
                                                companyName: text.target.value,
                                            });
                                        }}
                                    />
                                </div>

                                <div className='w-full'>
                                    <p className='text-black font-normal  text-base'>{t("Country / Region")}</p>
                                    <Select className='md:min-h-[50px] min-h-[40px] md:my-5 my-3' options={options}
                                        value={storeCreateData.country}
                                        onChange={(text) => {
                                            console.log(text)
                                            let c = { ...text }
                                            setStoreCreateData({
                                                ...storeCreateData,
                                                country: text,
                                            });
                                        }} />
                                </div>
                            </div>

                            <div className='md:order-2 order-1 md:mb-0 mb-5'>
                                <img className='w-full md:h-[390px] object-contain' src='/image-20.png' />
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-x-24'>
                            <div className='w-full'>
                                <p className='text-black font-normal  text-base'>{t("Street Address")}</p>
                                <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3" type="text" placeholder={t("Street Address")}
                                    required
                                    value={storeCreateData.address}
                                    onChange={(text) => {
                                        setStoreCreateData({
                                            ...storeCreateData,
                                            address: text.target.value,
                                        });
                                    }}
                                />
                            </div>

                            <div className='w-full'>
                                <p className='text-black font-normal  text-base'>{t("Town / City")}</p>
                                <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3" type="text" placeholder={t("Town / City")}
                                    required
                                    value={storeCreateData.city}
                                    onChange={(text) => {
                                        setStoreCreateData({
                                            ...storeCreateData,
                                            city: text.target.value,
                                        });
                                    }}
                                />
                            </div>

                            <div className='w-full'>
                                <p className='text-black font-normal  text-base'>{t("Upload Documents ( kbis )")}</p>
                                <div className='relative'>
                                    <div className='w-full md:h-[50px] h-[40px] bg-white border border-custom-newGray rounded-[10px]  md:my-5 my-3 flex px-5'>
                                        <input className="outline-none font-normal  text-base text-black md:w-[95%] w-[90%]" type="text" placeholder={t("Upload Document")}
                                            required
                                            value={storeCreateData.kbis}
                                            onChange={(text) => {
                                                setStoreCreateData({
                                                    ...storeCreateData,
                                                    kbis: text.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="absolute md:top-[13px] top-[8px] md:right-[10px] right-[10px]">
                                        <MdOutlineFileUpload className="text-black h-6 w-6"
                                            onClick={() => {
                                                f.current.click();
                                            }} />
                                        <input type="file"
                                            ref={f}
                                            className="hidden"
                                            onChange={(event) => { handleImageChange(event, 'kbis') }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='w-full'>
                                <p className='text-black font-normal  text-base'>{t("Upload Documents ( Identity document )")}</p>
                                <div className='relative'>
                                    <div className='w-full md:h-[50px] h-[40px] bg-white border border-custom-newGray rounded-[10px]  md:my-5 my-3 flex px-5'>
                                        <input className="outline-none font-normal  text-base text-black md:w-[95%] w-[90%]" type="text" placeholder={t("Upload Document")}
                                            required
                                            value={storeCreateData.identity}
                                            onChange={(text) => {
                                                setStoreCreateData({
                                                    ...storeCreateData,
                                                    identity: text.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="absolute md:top-[13px] top-[8px] md:right-[10px] right-[10px]">
                                        <MdOutlineFileUpload className="text-black h-6 w-6"
                                            onClick={() => {
                                                f1.current.click();
                                            }} />
                                        <input type="file"
                                            ref={f1}
                                            className="hidden"
                                            onChange={(event) => { handleImageChange(event, 'identity') }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='w-full'>
                                <p className='text-black font-normal  text-base'>{t("Phone")}</p>
                                <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3" type="number" placeholder={t("Phone")}
                                    required
                                    value={storeCreateData.phone}
                                    onChange={(text) => {
                                        setStoreCreateData({
                                            ...storeCreateData,
                                            phone: text.target.value,
                                        });
                                    }}
                                />
                            </div>

                            <div className='w-full'>
                                <p className='text-black font-normal  text-base'>{t("Email Address")}</p>
                                <input className="bg-white w-full md:h-[50px] h-[40px] px-5 rounded-[10px] border border-custom-newGray font-normal  text-base text-black outline-none md:my-5 my-3" type="email" placeholder={t("Email Address")}
                                    required
                                    value={storeCreateData.email}
                                    onChange={(text) => {
                                        setStoreCreateData({
                                            ...storeCreateData,
                                            email: text.target.value,
                                        });
                                    }}
                                />
                            </div>

                        </div>

                        <div className='flex justify-center items-center md:mt-5 mt-2'>
                            <button className='bg-black w-[237px] md:h-[50px] h-[40px] rounded-[5px] text-white font-normal text-base' type="submit">{t("Submit")}</button>
                        </div>
                    </form>

                </div>
            </section>

            <ConfirmationModal
                open={createStoreModel}
                onClose={() => {
                    setCreateStoreModel(false);
                    router.replace("/");
                    window.open('https://www.admin.krytonline.com/', '_blanck')
                }}
                onConfirm={() => {
                    router.replace("/");
                }}
                cancleBtn='Dashboard'
                confirmBtn='OK'
                title='Your store created successfully. Now you can access you dashbord!'
            />

        </div>
    )
}

export default StoreCreate

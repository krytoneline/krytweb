import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Ip() {
    const [ip, setIp] = useState('');

    useEffect(() => {
        const fetchIp = async () => {
            const res = await axios.get("https://ipinfo.io/?format=jsonp");
            console.log(res.data);
            // console.log(ip)
            // const res = await fetch('/api/get-ip');
            // const data = await res.json();
            // setIp(data.ip);
        };

        fetchIp();
    }, []);

    return (
        <div className="bg-white w-full">
            <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="mx-auto w-full md:px-10 px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <h1 className='text-black text-2xl font-normal'>Your IP Address</h1>
                    <p className='text-black'>{ip}</p>
                </div>
            </section>
        </div>
    )
}

export default Ip

import React from 'react'
import { useTranslation } from "react-i18next";
import AboutUsContent from '@/components/AboutUsContent';

function AboutUs() {
    const { t } = useTranslation();


    return (
        <div className="bg-white w-full">
            <section className="bg-white w-full flex flex-col justify-center items-center">
                <div className="md:px-10 mx-auto w-full  px-5 md:pt-10 pt-5 md:pb-10 pb-5">
                    <p className='text-black text-2xl font-normal md:pb-5 pb-2'>{t("About us")}</p>
                    <div>
                        {/* <h2 className='text-black text-base font-bold md:pb-5 pb-2'>About Krytonline</h2> */}

                        <h3 className='text-black text-base font-normal md:pb-5 pb-2'>A Unified Marketplace for Buying, Selling, and Renting</h3>
                        <p className='text-black text-base font-normal md:pb-5 pb-2'>Krytonline.com was founded with a vision to bridge the gap between small and medium-sized enterprises (SMEs) and individual entrepreneurs, providing them with a <strong>shared, dynamic online marketplace</strong>. Our platform is designed to cater to a wide range of needs by integrating <strong>multi-seller e-commerce and rental services</strong> into a single, seamless experience. With our core motto—<strong>BUY, SELL, RENT</strong>—we empower businesses and individuals to explore new opportunities, expand their reach, and engage in secure and hassle-free transactions.</p>

                        <h3 className='text-black text-base font-normal md:pb-5 pb-2'>A Platform Built Through Collaboration</h3>
                        <p className='text-black text-base font-normal md:pb-5 pb-2'>The successful development of Krytonline has been made possible through the <strong>dedication, expertise, and financial contributions of our esteemed partners</strong>. Their unwavering support has helped shape this platform into a <strong>comprehensive and inclusive</strong> space where sellers, buyers, and renters can connect with ease.</p>
                        <p className='text-black text-base font-normal md:pb-5 pb-2'>Our goal is not just to <strong>facilitate commerce</strong> but to <strong>revolutionize the online marketplace</strong> by offering a space where businesses of all sizes—whether startups, growing brands, or established enterprises—can <strong>thrive in a competitive digital economy</strong>.</p>

                        <h3 className='text-black text-base font-normal md:pb-5 pb-2'>A Global Vision with Local Franchise Opportunities</h3>
                        <p className='text-black text-base font-normal md:pb-5 pb-2'>Krytonline is designed to serve a <strong>global audience</strong>, ensuring that businesses and individuals from different parts of the world have access to a <strong>trusted and scalable platform</strong> for their commercial and rental needs. Understanding the importance of local presence, we also offer <strong>franchise opportunities in selected countries</strong>, allowing franchisees to operate under the Krytonline brand while aligning with our <strong>shared vision and business philosophy</strong>.</p>
                        <p className='text-black text-base font-normal md:pb-5 pb-2'>Our <strong>franchise model</strong> is structured to support entrepreneurs and investors who wish to <strong>bring Krytonline to their local markets</strong>, benefiting from our platform’s robust technology, established reputation, and global marketplace connections.</p>

                        <h3 className='text-black text-base font-normal md:pb-5 pb-2'>Innovation and Expertise: The Strength of Our Team</h3>
                        <p className='text-black text-base font-normal md:pb-5 pb-2'>At Krytonline, we believe that <strong>innovation and technology</strong> are at the heart of creating a <strong>successful and user-friendly platform</strong>. Our <strong>highly skilled team</strong>, comprising experts in <strong>technology, business strategy, and digital commerce</strong>, has worked relentlessly to combine their knowledge and creative insights in developing Krytonline.</p>

                        <p className='text-black text-base font-normal md:pb-5 pb-2'>We have focused on <strong>cutting-edge digital solutions</strong>, ensuring that our platform provides:</p>
                        <ul>
                            <li className='text-black text-base font-normal md:pb-5 pb-2'><strong>A seamless user experience</strong> with intuitive navigation and smart search capabilities</li>
                            <li className='text-black text-base font-normal md:pb-5 pb-2'><strong>Secure transactions</strong> with advanced payment gateway integrations</li>
                            <li className='text-black text-base font-normal md:pb-5 pb-2'><strong>Comprehensive seller and renter tools</strong> to help businesses and individuals maximize their potential</li>
                            <li className='text-black text-base font-normal md:pb-5 pb-2'><strong>A strong support system</strong> that fosters trust and reliability among users</li>
                        </ul>

                        <h3 className='text-black text-base font-normal md:pb-5 pb-2'>Join Us in Shaping the Future of Online Commerce</h3>
                        <p className='text-black text-base font-normal md:pb-5 pb-2'>Krytonline is more than just a marketplace—it is a <strong>community-driven platform</strong> that brings together businesses, entrepreneurs, and individuals in a way that fosters <strong>growth, collaboration, and success</strong>. Whether you are looking to <strong>buy, sell, or rent</strong>, Krytonline provides you with a <strong>trusted environment</strong> to do business efficiently and effectively.</p>

                        <p className='text-black text-base font-normal md:pb-5 pb-2'>We invite you to be a part of our journey as we continue to expand, innovate, and redefine the way people <strong>engage in commerce and rentals</strong>.</p>

                        <p className='text-black text-base font-normal'><strong>Krytonline – Buy, Sell, Rent with Confidence.</strong></p>
                    </div>

                    {/* <div className='w-full flex justify-center items-center'>
                        <div className='flex flex-col justify-center items-center md:w-[50%]'>
                            <p className='text-black text-base font-normal md:pb-5 pb-2'>{t("About us")}</p>
                            <p className='text-base	text-black font-normal pb-5'>Krytonline.com started for SMEs and individual to be in same marketplace. We have combined multi-seller and rental in one place. Our motto says BUY,SELL,RENT.</p>
                            <p className='text-base	text-black font-normal pb-5'>Together with our partners financial contribution, this website together has been made possible. Krytonline is aimed for global market and also allows franchisee for selected countries to operate with the same vision of our partners.</p>
                            <p className='text-base	text-black font-normal'>Our Team successfully integrated intellectual and technological ideas to create Krytonline.</p>
                        </div>
                    </div> */}
                </div>
            </section>
        </div>
    )
}

export default AboutUs

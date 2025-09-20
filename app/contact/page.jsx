'use client'
import { assets } from "@/lib_src/assets";
import NewsletterBox from "@/components/NewsletterBox";
import Title from "@/components/Title";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"GET IN"} text2={"TOUCH"} />
      </div>
      <div className="my-10 flex flex-col justify-center bg-gradient-to-l from-gray-100 to-white md:flex-row gap-10 mb-20 px-6 md:px-16 border border-gray-300 shadow-lg rounded-lg py-10 bg-white ">
        <img
          src={assets.contact_img}
          className="w-full md:max-w-[480px] rounded-lg shadow-md"
          alt="Contact Us"
        />
        <div className="flex flex-col justify-center items-between gap-6 text-gray-700">
          <p className="font-semibold text-xl text-gray-800">OUR STORE</p>
          <p className="text-gray-600 leading-relaxed">
            Computer Village<br />Ikeja, Lagos Nigeria
          </p>
          <p className="text-gray-600 leading-relaxed">
            <b>Phone:</b> (+234) 81-359-71304 <br /> <b>Email:</b> silverchristopher12@gmail.com
          </p>
          <p className="font-semibold text-xl text-gray-800">JOIN OUR TEAM</p>
          <p className="text-gray-600">
            Explore exciting career opportunities and be a part of our growing family.
          </p>
          <button className="border border-blue-800 bg-blue-700 text-white px-8 py-3 text-sm font-medium transition-all duration-500 rounded-lg shadow-md hover:bg-blue-600 hover:border-blue-600">
  EXPLORE JOBS
</button>


        </div>
      </div>
      <NewsletterBox />
    </div>
  );
};

export default Contact;
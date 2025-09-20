
const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-10 px-6">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 text-sm">
        <div>
          <p className="text-3xl font-bold flex items-center gap-1">
            My <span className="text-blue-400">Store</span>
          </p>
          <p className="w-full md:w-2/3 text-gray-400">
            Discover the best products at unbeatable prices. We strive to bring quality and affordability to your shopping experience. Shop with confidence and enjoy a seamless online shopping journey with us.
          </p>
          <p className="w-full md:w-2/3 text-gray-400 mt-3">
            Our mission is to provide top-notch products and exceptional customer service. Stay connected with us for the latest updates, offers, and new arrivals. Your satisfaction is our priority!
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5 text-blue-400">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li className="hover:text-blue-400 cursor-pointer">Home</li>
            <li className="hover:text-blue-400 cursor-pointer">About Us</li>
            <li className="hover:text-blue-400 cursor-pointer">Delivery</li>
            <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-400 cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-blue-400 cursor-pointer">Careers</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5 text-blue-400">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li>+234-8135971304</li>
            <li>silverchristopher12@gmail.com</li>
            <li className="hover:text-blue-400 cursor-pointer">Support Center</li>
            <li className="hover:text-blue-400 cursor-pointer">FAQs</li>
            <li className="hover:text-blue-400 cursor-pointer">Live Chat</li>
          </ul>
        </div>
      </div>
      <div className="mt-10">
        <hr className="w-full border-gray-700" />
        <p className="py-5 text-sm text-center text-gray-400">
          Copyright 2025 @ MyStore - All Rights Reserved. Your one-stop destination for quality and affordable products.
        </p>
      </div>
    </div>
  );
};

export default Footer;



'use client'
import { useContext, useState } from "react";
import Image from "next/image";
import { assets } from "@/lib_src/assets";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShopContext } from "@/context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const { setShowSearch, getCartCount, token, setToken, setCartItems, router } = useContext(ShopContext)!;

  const logout = () => {
    router.push("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white shadow-md">
      {/* Logo */}
      <Link href={"/"} className="text-3xl font-bold flex items-center gap-2">
        <p className="text-black">My</p>
        <span className="text-blue-600">Store</span>
      </Link>

      {/* Navigation Links (Desktop) */}
      <ul className="hidden sm:flex gap-6 text-sm font-medium">
        {[
          { href: "/", label: "HOME" },
          { href: "/collection", label: "COLLECTION" },
          { href: "/about", label: "ABOUT" },
          { href: "/contact", label: "CONTACT" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-2 py-1 transition duration-300 hover:text-blue-700 ${
              pathname === item.href ? "border-b-2 border-blue-700" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </ul>

      {/* Icons Section */}
      <div className="flex items-center gap-5">
        {/* Search Icon */}
        <Image
          src={assets.search_icon}
          onClick={() => setShowSearch(true)}
          className="w-5 cursor-pointer hover:opacity-80"
          alt="search"
          width={20}
          height={20}
        />

        {/* Profile Dropdown */}
        <div className="relative group">
          <Image
            onClick={() => (token ? null : router.push("/login"))}
            src={assets.profile_icon}
            className="w-6 cursor-pointer hover:opacity-80"
            alt="profile"
            width={24}
            height={24}
          />
          {token && (
            <div className="absolute hidden group-hover:block right-0 mt-2 w-40 bg-white text-gray-700 rounded-lg shadow-lg py-3 px-4 transition-all duration-300">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p
                onClick={() => router.push("/orders")}
                className="cursor-pointer hover:text-black"
              >
                Orders
              </p>
              <p onClick={logout} className="cursor-pointer hover:text-black">
                Logout
              </p>
            </div>
          )}
        </div>

        {/* Cart Icon with Badge */}
        <Link href={"/cart"} className="relative">
          <Image src={assets.cart_icon} className="w-6" alt="cart" width={24} height={24} />
          <p className="absolute -right-2 -bottom-2 w-4 h-4 flex items-center justify-center bg-blue-500 text-white rounded-full text-[10px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Button */}
        <Image
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-6 cursor-pointer sm:hidden transition-transform transform hover:scale-110"
          alt="menu"
          width={24}
          height={24}
        />
      </div>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0 w-3/4 sm:w-1/2" : "translate-x-full w-0"
        }`}
      >
        <div className="p-5 flex flex-col h-full z-10 ">
          {/* Close Button */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 cursor-pointer text-gray-800 hover:text-black py-2 px-3 rounded-md transition-all duration-200"
          >
            <Image
              src={assets.dropdown_icon}
              className="h-5 rotate-180"
              alt="back"
              width={20}
              height={20}
            />
            <p className="font-semibold">Close</p>
          </div>

          {/* Sidebar Links */}
          <ul className="mt-6 space-y-4">
            {[
              { href: "/", label: "HOME" },
              { href: "/collection", label: "COLLECTION" },
              { href: "/about", label: "ABOUT" },
              { href: "/contact", label: "CONTACT" },
            ].map((item) => (
              <Link
                key={item.href}
                onClick={() => setVisible(false)}
                href={item.href}
                className="block py-2 px-4 rounded-md text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
              >
                {item.label}
              </Link>
            ))}
          </ul>

          {/* Logout Button (Only if logged in) */}
          {token && (
            <div className="mt-auto p-4">
              <button
                onClick={logout}
                className="w-full bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;


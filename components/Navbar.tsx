
'use client'
import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/lib_src/assets";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShopContext } from "@/context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { setShowSearch, getCartCount, token, setToken, setCartItems, router } = useContext(ShopContext)!;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileRef, setShowProfileOptions]);

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
        <div className="relative" ref={profileRef}>
          <Image
            onClick={() => {
              if (token) {
                setShowProfileOptions(!showProfileOptions);
              } else {
                router.push("/login");
              }
            }}
            src={assets.profile_icon}
            className="w-6 cursor-pointer hover:opacity-80"
            alt="profile"
            width={24}
            height={24}
          />
          <AnimatePresence>
            {token && showProfileOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-44 bg-white text-gray-700 rounded-lg shadow-xl py-2 z-50 border border-gray-100"
              >
                <motion.p 
                  className="cursor-pointer hover:text-black px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ x: 4 }}
                >
                  👤 My Profile
                </motion.p>
                <motion.p
                  onClick={() => router.push("/orders")}
                  className="cursor-pointer hover:text-black px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ x: 4 }}
                >
                  📦 Orders
                </motion.p>
                <motion.p 
                  onClick={logout} 
                  className="cursor-pointer hover:text-red-600 px-4 py-2 hover:bg-red-50 transition-colors duration-200 text-red-500"
                  whileHover={{ x: 4 }}
                >
                  🚪 Logout
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart Icon with Badge */}
        <Link href={"/cart"} className="relative">
          <Image src={assets.cart_icon} className="w-6" alt="cart" width={24} height={24} />
          <p className="absolute -right-2 -bottom-2 w-4 h-4 flex items-center justify-center bg-blue-500 text-white rounded-full text-[10px]">
            {getCartCount()}
          </p>
        </Link>

        {/* Modern Mobile Menu Toggle */}
        <motion.button
          onClick={() => setVisible(true)}
          className="sm:hidden p-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <motion.div
              className="w-5 h-0.5 bg-gray-800 mb-1"
              animate={visible ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-5 h-0.5 bg-gray-800 mb-1"
              animate={visible ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-5 h-0.5 bg-gray-800"
              animate={visible ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] sm:hidden"
            onClick={() => setVisible(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-2xl z-[70] sm:hidden"
          >
            <div className="p-5 flex flex-col h-full">
              {/* Close Button */}
              <motion.div
                onClick={() => setVisible(false)}
                className="flex items-center gap-3 cursor-pointer text-gray-800 hover:text-black py-2 px-3 rounded-md transition-all duration-200 mb-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="font-semibold">Close</p>
              </motion.div>

              {/* Sidebar Links */}
              <motion.ul 
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.1
                    }
                  }
                }}
              >
                {[
                  { href: "/", label: "HOME", icon: "🏠" },
                  { href: "/collection", label: "COLLECTION", icon: "🛍️" },
                  { href: "/about", label: "ABOUT", icon: "ℹ️" },
                  { href: "/contact", label: "CONTACT", icon: "📞" },
                ].map((item) => (
                  <motion.li
                    key={item.href}
                    variants={{
                      hidden: { x: 50, opacity: 0 },
                      visible: { x: 0, opacity: 1 }
                    }}
                  >
                    <Link
                      onClick={() => setVisible(false)}
                      href={item.href}
                      className={`flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        pathname === item.href 
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" 
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              {/* User Actions */}
              <div className="mt-auto space-y-4">
                {token && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    <Link
                      href="/orders"
                      onClick={() => setVisible(false)}
                      className="flex items-center gap-3 py-2 px-4 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                      <span className="text-lg">📦</span>
                      My Orders
                    </Link>
                    <motion.button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>🚪</span>
                      Logout
                    </motion.button>
                  </motion.div>
                )}
                {!token && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      href="/login"
                      onClick={() => setVisible(false)}
                      className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200"
                    >
                      <span>👤</span>
                      Sign In
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;


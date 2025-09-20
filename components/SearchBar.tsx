
'use client'
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/lib_src/assets";
import { ShopContext } from "@/context/ShopContext";
import { usePathname } from "next/navigation";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext)!;
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setVisible(pathname ? pathname.includes("collection") : false);
  }, [pathname]);

  return showSearch && visible ? (
    <div className="fixed top-0 left-0 w-full bg-white-900 bg-opacity-90 py-4 px-6 flex justify-center items-center z-50">
      <div className="relative flex items-center w-full max-w-lg bg-white rounded-xl  px-4 py-2 border border-gray-300" >
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full outline-none text-gray-700 text-sm bg-transparent px-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Image src={assets.search_icon} width={20} height={20} className="w-5 cursor-pointer filter invert opacity-60" alt="search" />
      </div>
      <Image
        src={assets.cross_icon}
        width={24}
        height={24}
        className="w-6 ml-4 cursor-pointer filter invert"
        onClick={() => setShowSearch(false)}
        alt="close"
      />
    </div>
  ) : null;
};

export default SearchBar;

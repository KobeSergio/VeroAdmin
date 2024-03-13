"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsGrid, BsBoxArrowInLeft } from "react-icons/bs";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full min-h-full px-6 py-10 flex flex-col justify-start items-center bg-white border border-[#D5D7D8] rounded-[10px]">
      <h3 className="font-monts font-medium text-base text-darkerGray">
        Welcome back, Admin
      </h3>
      <hr className="bg-[#BDBDBD] w-full h-px my-4"></hr>
      <div className="w-full space-y-2 flex flex-col justify-between">
        <Link
          href={"/dashboard"}
          className={`flex items-center pl-4 pr-2 py-3 font-monts font-semibold text-sm rounded-[10px] cursor-pointer ${
            pathname.includes("/dashboard") || pathname.includes("/post")
              ? "bg-primaryBlue text-white fill-white"
              : "text-darkGray hover:bg-lightestGray "
          }`}
        >
          <BsGrid size={18} />
          <span className="ml-3">Discussions Manager</span>
        </Link>
      </div>
      <br></br>
      <div className="w-full space-y-2 flex flex-col justify-between">
        <Link
          href={"/event"}
          className={`flex items-center pl-4 pr-2 py-3 font-monts font-semibold text-sm rounded-[10px] cursor-pointer ${
            pathname.includes("/event")
              ? "bg-primaryBlue text-white fill-white"
              : "text-darkGray hover:bg-lightestGray "
          }`}
        >
          <BsGrid size={18} />
          <span className="ml-3">Event Manager</span>
        </Link>
      </div>
    </div>
  );
}

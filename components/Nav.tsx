"use client";

import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { BsBoxArrowInLeft } from "react-icons/bs";

export default function Nav() {
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <nav className="w-full relative z-30 bg-white-800 shadow ">
        <div className="justify-between px-6 lg:px-12 mx-auto lg:items-center lg:flex">
          <div>
            <div className="flex items-center justify-between py-3 lg:block">
              <div className="flex flex-row gap-3 items-center">
                <h1 className="font-monts font-semibold text-base lg:text-xl text-primaryBlue">
                  VeroAdmin
                </h1>
              </div>
              <div className="lg:hidden">
                <Image
                  src={
                    toggle ? "assets/icons/close.svg" : "assets/icons/menu.svg"
                  }
                  width={20}
                  height={20}
                  alt="menu"
                  className="object-contain cursor-pointer"
                  onClick={() => setToggle(!toggle)}
                />
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-2 lg:block lg:pb-0 lg:mt-0 ${
                toggle ? "block" : "hidden"
              }`}
            >
              <Link
                href="/"
                className="flex items-center px-4 py-2  font-monts font-semibold text-sm rounded-[10px] cursor-pointer text-darkGray"
              >
                <BsBoxArrowInLeft />
                <span className="ml-3">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

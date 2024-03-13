"use client";

import Image from "next/image";
import { useState } from "react";
import Firebase from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import { signIn } from "next-auth/react";
const firebase = new Firebase();

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (email === "" && password === "") {
      alert("Please fill up all fields.");
      return;
    }
  
    setIsLoading(true);
  
      try {
        const res = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (res !== undefined && res.url !== null) {
          router.push(res.url);
          return;
        }
        alert("Invalid credentials");
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    
  };
  const handleForgotPassword = async (event: any) => {
    event.preventDefault();
    if (email === "")
      return;

    try {
      const res = await firebase.forgotPassword(email);

      if (res === undefined)
        return;

      if (res.status === 200)
        alert("Please check your email to reset your password");      
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gradient-to-b from-[#4A148C] via-[#311B92] to-[#1A237E] z-50 px-6 py-12 lg:py-24">
    <h2 className="font-monts text-4xl text-white font-bold text-center mt-6">
        Admin
      </h2>
      <form className="max-w-md w-full mx-auto p-4 mt-6 bg-[#FFFFF] rounded-md shadow-lg">
        <div className="flex items-center border-2 border-[#FFFFF] px-4 py-2 rounded-lg">
        <label className="sr-only" htmlFor="email">
    Email address
  </label>
          <span>
            <Image
              src={"assets/icons/envelope.svg"}
              width={18}
              height={18}
              alt={"envelope icon"}
            /> 
          </span>
          <input
            id="email"
            className="appearance-none bg-transparent border-none w-full font-monts font-medium text-sm text-white ml-2 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Email address"
            aria-label="Email address"
            value={email}
            onChange={handleInputChange}
          /> 
        </div>
        <div className="flex items-center border-2 border-[#FFFFF] px-4 py-2 rounded-lg mt-4">
        <label className="sr-only" htmlFor="password">
    Password
  </label>
          <span>
            <Image
              src={"assets/icons/key.svg"}
              width={18}
              height={18}
              alt={"envelope icon"}
            />{" "}
          </span>
          <input
            id="password"
            className="appearance-none bg-transparent border-none w-full font-monts font-medium text-sm text-white ml-2 py-1 px-2 leading-tight focus:outline-none"
            type="password"
            placeholder="Password"
            aria-label="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {/* <div className="flex justify-end items-center mt-4">
          <h4 className="font-monts font-medium text-xs italic text-primaryBlue hover:underline underline-offset-4 cursor-pointer">
            Forgot password?
          </h4>
        </div> */}
         <section className="flex gap-x-1.5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-[#7851A9] hover:bg-[#365592] font-monts font-semibold text-center text-sm  text-white py-3 px-5 rounded-lg mt-6 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex flex-row items-center gap-1">
                {" "}
                <Spinner />
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
          <button
            onClick={handleForgotPassword}
            className="block w-full mt-6 underline text-blue-500">
            Forgot Password?
          </button>
        </section>
      </form>
    </div>
  );
}

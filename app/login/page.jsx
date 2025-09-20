'use client'
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "@/context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("LOGIN");
  const context = useContext(ShopContext);
  const { token, setToken, router } = context;
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "SIGN UP") {
        const response = await axios.post("/api/user/register", { name, email, password }); // Updated API call
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Registration successful!");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post("/api/user/login", { email, password }); // Updated API call
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred!");
    }
  };

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-[480px] m-auto mt-14 gap-4 text-gray-800 mb-12">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl text-gray-800">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-blue-600" />
      </div>
      {currentState === "LOGIN" ? null : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
          placeholder="NAME"
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
        placeholder="abcd@gmail.com"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
        placeholder="abcd@1234"
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer text-blue-600">FORGOT YOUR PASSWORD?</p>
        {currentState === "LOGIN" ? (
          <p className="cursor-pointer text-blue-600" onClick={() => setCurrentState("SIGN UP")}>
            CREATE ACCOUNT
          </p>
        ) : (
          <p className="cursor-pointer text-blue-600" onClick={() => setCurrentState("LOGIN")}>
            LOGIN HERE
          </p>
        )}
      </div>
      <button className="bg-blue-600 text-white font-light px-8 py-2 mt-4 rounded-md hover:bg-blue-700 transition-all duration-300">
        {currentState === "LOGIN" ? "SIGN IN" : "SIGN UP"}
      </button>
    </form>
  );
};

export default Login;
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function SignUp() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailExist, setIsEmailExist] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const emailRegex = /^[^\s@]+@sssh\.tp\.edu\.tw$/;
    const emailValid = emailRegex.test(email);
    const passwordValid = password.length >= 8;

    setIsEmailValid(emailValid);
    setIsPasswordValid(passwordValid);

    if (emailValid && passwordValid) {
      try{
        const response = await fetch("/api/checkEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json()
        setIsEmailExist(data.exists)

        if(!data.exists) {
          sessionStorage.setItem("signupPassword", password);
          router.push(`/verify?email=${encodeURIComponent(email)}`);
        }
      } catch (error) {
        console.log(error)
      }
    }
  };

  function warningMessages() {
    if(isEmailValid && isPasswordValid && isEmailExist) return
    if(!isEmailValid) return <div className="text-red-500">請使用學校 email 註冊 (...@sssh.tp.edu.tw)</div>
  }

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">註冊帳號</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              name="email"
              placeholder="請使用學校email註冊" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="relative">
            <input 
              type={isPasswordVisible ? "text" : "password"} 
              name="password"
              placeholder="請設定密碼" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
            </button>
          </div>

          {warningMessages()}
          {isEmailExist && <div className="text-red-500">此email已註冊</div>}
          <button 
            type="submit" 
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            下一步
          </button>
        </form>
      </div>
    </section>
  );
}

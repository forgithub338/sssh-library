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
    if(!isEmailValid) return <div className="text-[#9B1B30] p-3 bg-red-50 rounded-lg">請使用學校 email 註冊 (...@sssh.tp.edu.tw)</div>
    if(!isPasswordValid) return <div className="text-[#9B1B30] p-3 bg-red-50 rounded-lg">密碼長度至少為 8 個字元</div>
  }

  return (
    <section className="flex justify-center items-center min-h-screen bg-[#FAF3E0]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-100">
        <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-6 -mt-8 -mx-8 mb-6 rounded-t-lg">
          <h2 className="text-2xl font-semibold text-center text-white">註冊帳號</h2>
          <div className="h-1 w-24 bg-white/50 mt-2 mx-auto rounded-full"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group">
            <label className="block text-sm font-medium text-[#333333] mb-2 group-focus-within:text-[#1E3A8A] transition-colors">電子郵件</label>
            <input 
              type="email" 
              name="email"
              placeholder="請使用學校email註冊" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-gray-50 focus:bg-white transition-all"
            />
            <p className="text-[#B0B0B0] text-xs mt-1">必須使用 @sssh.tp.edu.tw 結尾的學校信箱</p>
          </div>
          
          <div className="group relative">
            <label className="block text-sm font-medium text-[#333333] mb-2 group-focus-within:text-[#1E3A8A] transition-colors">密碼</label>
            <input 
              type={isPasswordVisible ? "text" : "password"} 
              name="password"
              placeholder="請設定密碼" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-gray-50 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-[60%] transform -translate-y-1/2 text-[#B0B0B0] hover:text-[#1E3A8A]"
            >
              <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
            </button>
            <p className="text-[#B0B0B0] text-xs mt-1">密碼需要至少 8 個字元</p>
          </div>

          {warningMessages()}
          {isEmailExist && <div className="text-[#9B1B30] p-3 bg-red-50 rounded-lg text-center">此email已註冊</div>}
          
          <button 
            type="submit"
            style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}}
            className="w-full py-3 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 mt-6"
            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #9B1B30, #9B1B30)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            下一步
          </button>
          
          <div className="text-center mt-4">
            <a href="/login" className="text-[#1E3A8A] hover:text-[#9B1B30] text-sm transition-colors">
              已有帳號？前往登入
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}

"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Verify() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [code, setCode] = useState(Array(6).fill(""));
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");
  const hasSentCode = useRef(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (email && !hasSentCode.current) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      hasSentCode.current = true;
      setGeneratedCode(verificationCode);

      fetch("/api/sendVerificationCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // 限制只能輸入數字

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // 自動跳到下一個輸入框
    if (value && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (code.join("") === generatedCode) {
      const password = sessionStorage.getItem("signupPassword");
      if (password) {
        await fetch("/api/mySQL", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        sessionStorage.removeItem("signupPassword");
      }

      router.push("/login?method=relogin");
    } else {
      setError("驗證碼錯誤，請重新輸入！");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-[#FAF3E0]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-100">
        <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-6 -mt-8 -mx-8 mb-6 rounded-t-lg">
          <h2 className="text-2xl font-semibold text-center text-white">驗證帳號</h2>
          <div className="h-1 w-24 bg-white/50 mt-2 mx-auto rounded-full"></div>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-[#333333] mb-2">我們已發送 6 位數驗證碼到</p>
          <p className="text-[#1E3A8A] font-semibold">{email}</p>
          <p className="text-[#9B1B30] text-sm mt-4 p-2 bg-red-50 rounded-lg inline-block">如果未收到訊息，請重新整理網頁以獲得新驗證碼</p>
        </div>

        <div className="flex justify-center space-x-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 border border-gray-200 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] shadow-sm bg-gray-50 focus:bg-white transition-all"
            />
          ))}
        </div>

        {error && <div className="text-[#9B1B30] text-center mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}

        <button
          onClick={handleVerify}
          style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}}
          className="w-full py-3 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #9B1B30, #9B1B30)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
          驗證
        </button>
        
        <div className="text-center mt-6">
          <a href="/signUp" className="text-[#1E3A8A] hover:text-[#9B1B30] text-sm transition-colors">
            返回註冊頁面
          </a>
        </div>
      </div>
    </section>
  );
}

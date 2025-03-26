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

      router.push("/");
    } else {
      setError("驗證碼錯誤，請重新輸入！");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">驗證帳號</h2>
        <p className="text-center text-gray-600 mb-4">我們已發送 6 位數驗證碼到 {email}</p>
        <p className="text-center text-red-500 text-sm mb-4">如果未收到訊息，請重新整理網頁以獲得新驗證碼</p>

        <div className="flex justify-center space-x-2 mb-4">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>

        {error && <div className="text-red-500 text-center mb-2">{error}</div>}

        <button
          onClick={handleVerify}
          className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          驗證
        </button>
      </div>
    </section>
  );
}

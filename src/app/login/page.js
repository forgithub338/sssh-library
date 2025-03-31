"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "";

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    console.log(`Attempting login for: ${email}`);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        console.log("Login successful, setting cookie directly in browser");
        
        // 如果 API 返回了 token，直接在客戶端設置 cookie
        if (data.token) {
          Cookies.set('authToken', data.token, { 
            expires: 1, // 1 天
            path: '/'
          });
          
          localStorage.setItem('authToken', data.token); // 備用存儲
          console.log("Token stored in both cookie and localStorage");
        }
        
        // 檢查是否需要更改密碼
        if (data.alterPassword === 0) {
          console.log("First login detected, redirecting to password change");
          window.location.href = '/changePassword?method="firstLogin';
        } else {
          // 延遲導航，確保存儲完成
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 300);
        }
      } else {
        console.log('Login failed:', data.message || 'Unknown error');
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginSuccess(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-[#FAF3E0]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-100">
        <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-6 -mt-8 -mx-8 mb-6 rounded-t-lg">
          <h2 className="text-2xl font-semibold text-center text-white">登入帳號</h2>
          <div className="h-1 w-24 bg-white/50 mt-2 mx-auto rounded-full"></div>
        </div>
        
        {method && <div className="text-[#1E3A8A] text-center mb-4 p-3 bg-blue-50 rounded-lg">更改密碼成功，請重新登入</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group">
            <label className="block text-sm font-medium text-[#333333] mb-2 group-focus-within:text-[#1E3A8A] transition-colors">電子郵件</label>
            <input
              type="email"
              name="email"
              placeholder="請使用學校email登入"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          
          <div className="group relative">
            <label className="block text-sm font-medium text-[#333333] mb-2 group-focus-within:text-[#1E3A8A] transition-colors">密碼</label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="請輸入密碼"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-gray-50 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-3 top-[60%] transform -translate-y-1/2 text-[#B0B0B0] hover:text-[#1E3A8A]"
            >
              <FontAwesomeIcon 
                icon={isPasswordVisible ? faEyeSlash : faEye} 
                className="mt-5"/>
            </button>
          </div>

          {!loginSuccess && <div className="text-[#9B1B30] p-3 bg-red-50 rounded-lg text-center">帳號或密碼錯誤</div>}

          <button
            type="submit"
            style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}}
            className="w-full py-3 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 mt-6"
            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #9B1B30, #9B1B30)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            登入
          </button>
          
          {/* <div className="text-center mt-4">
            <a href="/signUp" className="text-[#1E3A8A] hover:text-[#9B1B30] text-sm transition-colors">
              還沒有帳號？立即註冊
            </a>
          </div> */}
        </form>
      </div>
    </section>
  );
}

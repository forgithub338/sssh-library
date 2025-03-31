"use client"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation";
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import getUserEmail from "@/../lib/getUserEmail";

export default function ChangePassword() {
  const router = useRouter()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const method = searchParams.get("method") || "";
  const email = getUserEmail()
  console.log("Current user email:", email)

  async function handleSubmit(e) {
    e.preventDefault();
    const newPassword = e.target.password.value
    
    if (newPassword.length < 8) {
      setError("密碼長度至少為 8 個字元");
      return;
    }

    setTimeout(() => {
      // 將新密碼存儲到 sessionStorage 中
      sessionStorage.setItem("newPassword", newPassword);
      setSuccess(true);
      router.push(`/verify?email=${email}`);
    }, 1500);
    
    // try {
    //   // 直接呼叫 API 更改密碼
    //   const response = await fetch("/api/changePassword", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password: newPassword }),
    //   });
      
    //   const data = await response.json();
      
    //   if (data.success) {
    //     setSuccess(true);
    //     // 延遲導航到儀表板
        
    //   } else {
    //     setError(data.message || "密碼更改失敗，請稍後再試");
    //   }
    // } catch (error) {
    //   console.error("更改密碼時發生錯誤:", error);
    //   setError("系統錯誤，請稍後再試");
    // }
  }

  return(
    <div>
      <section className="flex justify-center items-center min-h-screen bg-[#FAF3E0]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-100">
        <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-6 -mt-8 -mx-8 mb-6 rounded-t-lg">
          <h2 className="text-2xl font-semibold text-center text-white">更換密碼</h2>
          <div className="h-1 w-24 bg-white/50 mt-2 mx-auto rounded-full"></div>
        </div>
        
        {method && <div className="text-[#1E3A8A] text-center mb-4 p-3 bg-blue-50 rounded-lg">第一次登入，請重新設定密碼</div>}
        
        {error && <div className="text-[#9B1B30] text-center mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}
        
        {success ? (
          <div className="text-green-600 text-center mb-4 p-3 bg-green-50 rounded-lg">
            密碼更改成功！正在前往儀表板...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group relative">
              <label className="block text-sm font-medium text-[#333333] mb-2 group-focus-within:text-[#1E3A8A] transition-colors">新密碼</label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="請輸入新密碼"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-gray-50 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="absolute right-3 top-[52%] transform -translate-y-1/2 text-[#B0B0B0] hover:text-[#1E3A8A] flex items-center justify-center w-6 h-6"
              >
                <FontAwesomeIcon 
                  icon={isPasswordVisible ? faEyeSlash : faEye} 
                  className="w-4 h-4 mt-7" 
                  style={{transform: 'rotate(0deg)'}}
                  fixedWidth
                />
              </button>
              <p className="text-[#B0B0B0] text-xs mt-1">密碼需要至少 8 個字元</p>
            </div>

            <button
              type="submit"
              style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}}
              className="w-full py-3 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 mt-6"
              onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #9B1B30, #9B1B30)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}
            >
              更換密碼
            </button>
          </form>
        )}
      </div>
    </section>
    </div>
  )
}
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function getUserEmail() {
  try {
    // 嘗試從 cookie 中獲取 token
    let token = Cookies.get("authToken");
    
    // 如果 cookie 中沒有，嘗試從 localStorage 獲取
    if (!token) {
      token = localStorage.getItem("authToken");
      // console.log("Trying localStorage, token available:", !!token);
    } else {
      // console.log("Cookie token available:", !!token);
    }
    
    // 如果兩者都沒有，返回 null
    if (!token) {
      // console.log("No token found in cookies or localStorage");
      return null;
    }
    
    // 解碼 token 以獲取用戶數據
    const decoded = jwtDecode(token);
    // console.log("JWT decoded successfully, email:", decoded.email);
    
    // 從解碼後的 token 中返回電子郵件
    return decoded.email;
  } catch (error) {
    // console.error("獲取用戶郵箱失敗:", error);
    return null;
  }
}



import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function getUserPosition() {
  try {
    // 嘗試從 cookie 中獲取 token
    let token = Cookies.get("authToken");
    
    // 如果 cookie 中沒有，嘗試從 localStorage 獲取
    if (!token) {
      token = localStorage.getItem("authToken");
    }

    if (!token) return null;

    // 解碼 token 以獲取用戶數據
    const decoded = jwtDecode(token);

    // 從解碼後的 token 中返回 position
    return decoded.position || null;
  } catch (error) {
    return null;
  }
}
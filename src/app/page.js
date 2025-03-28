"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import getUserEmail from '@/../lib/getUserEmail'

export default function Home() {
  const [post, setPost] = useState([])
  const router = useRouter()
  
  // 在每次渲染時嘗試獲取 email
  const email = getUserEmail()
  console.log("Home page - user email:", email)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch("/api/mySQL")
        const response = await data.json()
        setPost(response.posts)
      } catch(error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // 如果有登入憑證，重定向到儀表板
    if (email) {
      console.log("User is authenticated, redirecting to dashboard")
      router.push('/dashboard')
    }
  }, [email, router])

  const employeeElement = post.map(user => {
    return (
      <div key={user.email}>
        <p>email: {user.email}</p>
        <p>password: {user.password}</p>
      </div>
    )
  })

  return (
    // 如果已登入，可以顯示載入中的訊息
    // 如果未登入，顯示正常的主頁內容
    <>
      {email ? (
        <div className="flex items-center justify-center min-h-screen">
          <p>正在載入您的儀表板...</p>
        </div>
      ) : (
        <>
          <h1>Hello World</h1>
          {employeeElement}
          <section>
            <Link href="/login" className="login-btn">
              登入
            </Link>
            <Link href="/signUp" className="register-btn">
              註冊
            </Link>
          </section>
        </>
      )}
    </>
  )
}
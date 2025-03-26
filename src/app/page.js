"use client"
import { useEffect, useState } from "react"

export default function Home() {
  const [post, setPost] = useState([])

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

  const employeeElement = post.map(user => {
    return (
      <div key={user.email}>
        <p>email: {user.email}</p>
        <p>password: {user.password}</p>
      </div>
    )
  })

  return(
    <>
      <h1>Hello World</h1>
      {employeeElement}

      <section>
        
      </section>
    </>
  )
}
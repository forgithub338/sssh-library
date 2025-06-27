"use client";
import { useState } from "react"

export default function AddUser() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    position: "使用者"
  })

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/add-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    })

    const data = await res.json();
    console.log(data);
  }

  return(
    <>
      <h1>新增使用者</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>使用者信箱</label>
          <input
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label>預設密碼</label>
          <input
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div>
          <label>使用者名稱</label>
          <input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <select
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          >
            <option value={"使用者"}>使用者</option>
            <option value={"管理者"}>管理者</option>
          </select>
        </div>
        <button type="submit">新增使用者</button>
      </form>
    </>
  )
}
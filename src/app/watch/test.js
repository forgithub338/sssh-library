"use client";
import SideBarMedia from "@/../components/ui/sideBarMedia"
import SideBarDesktop from "@/../components/ui/sideBarDesktop"
import { projectTypes, subjectAreas } from '../../../components/data/interestArea';
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";

export default function Watch() {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    projectType: "所有類型",
    subject: "所有領域",
    sortBy: "date-asc"
  })
  const [getData, setGetData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/watch", {
          method: "POST",
          body: JSON.stringify(formData)
        });
        
        const data = await response.json()

        setGetData(data)
        console.log(data)
      } catch(error) {
        console.log(error)
      }
    }
    fetchData()
  }, [formData])

  return (
    <div className="flex h-screen bg-[#FAF3E0]">
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SideBarDesktop />

      

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 bg-red-100">
              <label>成果類型</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              >
                <option value="所有類型">所有類型</option>
                {projectTypes.map((type) => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>

              <label>成果領域</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="所有領域">所有領域</option>
                {subjectAreas.map((area) => (
                  <option key={area.subjectId} value={area.subject}>{area.subject}</option>
                ))}
              </select>

              <label>排序方式</label>
              <select
                value={formData.sortBy}
                onChange={(e) => setFormData({ ...formData, sortBy: e.target.value })}
              >
                <option value="date-asc">最新上傳</option>
                <option value="date-desc">最早上傳</option>
              </select>
              {getData?.data?.map((obj) => (
                <div key={obj.project_id}>
                  {obj.author} 
                  <FontAwesomeIcon icon={faGreaterThan} />
                  {obj.title}          
                  <div>{obj.description}</div>
                </div>
              ))}

              
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
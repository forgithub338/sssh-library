import { HeartIcon, EyeIcon } from "@heroicons/react/24/outline";
import latestFileBasic from "../data/latestFile";



export default function UserLatestFile(props) {
  const latestFile = latestFileBasic(props);

  return (
    <div className="mt-8">
                <div className="bg-white shadow rounded-xl border border-gray-100 overflow-hidden">
                  <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="px-5 py-4 text-white">
                    <h3 className="text-lg font-medium">最近分享的作品</h3>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {latestFile.map((project) => (
                      <li key={project.id} className="px-5 py-5 hover:bg-[#FAF3E0]/30 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${project.typeColor}`}>
                              <project.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#333333] truncate">{project.title}</p>
                            <p className="text-sm text-[#B0B0B0] truncate">{project.type}</p>
                            {project.section && (
                              <p className="text-sm text-[#8E9FE6] truncate">{project.section}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[#9B1B30]">{project.date}</p>
                            <div className="flex items-center mt-1 justify-end">
                              <HeartIcon className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-xs text-[#333333]">{project.likes}</span>
                              <EyeIcon className="h-4 w-4 text-blue-500 ml-2 mr-1" />
                              <span className="text-xs text-[#333333]">{project.views}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-50 px-5 py-3">
                    <a href="/projects" className="text-sm font-medium text-[#1E3A8A] hover:text-[#9B1B30] transition-colors flex justify-center items-center">
                      查看所有作品
                      <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
  )
}

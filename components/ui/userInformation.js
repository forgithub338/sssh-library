import { AcademicCapIcon } from "@heroicons/react/24/outline";

export default function UserInformation() {
  return (
    <div className="mt-8 bg-white overflow-hidden shadow rounded-xl border border-gray-100">
                <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-6">
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-full bg-white p-1">
                      <div className="h-full w-full rounded-full bg-[#9B1B30] flex items-center justify-center text-white text-2xl font-bold">
                        王
                      </div>
                    </div>
                    <div className="ml-6">
                      <h2 className="text-xl font-bold text-white">王小明</h2>
                      <div className="flex items-center mt-2">
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center">
                          <AcademicCapIcon className="h-4 w-4 mr-1" />
                          多媒體設計學生
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#FAF3E0] rounded-xl p-4 border border-gray-100">
                      <h3 className="text-sm font-medium text-[#B0B0B0]">關注領域</h3>
                      <p className="text-lg font-medium text-[#333333] mt-2">互動設計</p>
                      <p className="text-sm text-[#1E3A8A] mt-1">UI/UX 與前端開發</p>
                    </div>
                    <div className="bg-[#FAF3E0] rounded-xl p-4 border border-gray-100">
                      <h3 className="text-sm font-medium text-[#B0B0B0]">總分享數</h3>
                      <p className="text-lg font-medium text-[#333333] mt-2">12 個專案</p>
                      <p className="text-sm text-[#1E3A8A] mt-1">累積 58 個讚</p>
                    </div>
                    <div className="bg-[#FAF3E0] rounded-xl p-4 border border-gray-100">
                      <h3 className="text-sm font-medium text-[#B0B0B0]">最近活動</h3>
                      <p className="text-lg font-medium text-[#333333] mt-2">3 天前更新</p>
                      <p className="text-sm text-[#1E3A8A] mt-1">互動網頁設計作品</p>
                    </div>
                  </div>
                </div>
              </div>
  )
}

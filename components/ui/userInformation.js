import { AcademicCapIcon } from "@heroicons/react/24/outline";

export default function UserInformation(props) {
  function userType(type) {
    if (type === 'club') {
      return '社團'
    } else if (type === 'teacher') {
      return '教師'
    } else {
      return '學生'
    }
  }

  function getDate() {
    try {
      const date = new Date(props.latestDate);
      if (!isNaN(date)) {
        return date.toLocaleString('zh-TW', { 
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
      return props.latestDate;
    } catch (e) {
      return props.latestDate;
    }
  }

  return (
    <div className="mt-4 md:mt-8 bg-white overflow-hidden shadow rounded-xl border border-gray-100">
      {/* 用戶頭像和基本信息 */}
      <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4 md:p-6">
        <div className="flex items-center">
          {/* 手機版較小的頭像 */}
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white p-1 flex-shrink-0">
            <div className="h-full w-full rounded-full bg-[#9B1B30] flex items-center justify-center text-white text-xl md:text-2xl font-bold">
              {props.name?.charAt(0) || "?"}
            </div>
          </div>
          <div className="ml-4 md:ml-6 min-w-0 flex-1">
            <h2 className="text-lg md:text-xl font-bold text-white truncate">{props.name}</h2>
            <div className="flex items-center mt-2">
              <span className="bg-white/20 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center">
                <AcademicCapIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                {userType(props.type)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 統計信息網格 */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* 關注領域 */}
          <div className="bg-[#FAF3E0] rounded-xl p-3 md:p-4 border border-gray-100">
            <h3 className="text-xs md:text-sm font-medium text-[#B0B0B0]">關注領域</h3>
            <p className="text-base md:text-lg font-medium text-[#333333] mt-1 md:mt-2">互動設計</p>
            <p className="text-xs md:text-sm text-[#1E3A8A] mt-1">UI/UX 與前端開發</p>
          </div>

          {/* 總分享數 */}
          <div className="bg-[#FAF3E0] rounded-xl p-3 md:p-4 border border-gray-100">
            <h3 className="text-xs md:text-sm font-medium text-[#B0B0B0]">總分享數</h3>
            <p className="text-base md:text-lg font-medium text-[#333333] mt-1 md:mt-2">{props.project} 個專案</p>
            <p className="text-xs md:text-sm text-[#1E3A8A] mt-1">累積 {props.love} 個讚</p>
          </div>

          {/* 最新活動 */}
          <div className="bg-[#FAF3E0] rounded-xl p-3 md:p-4 border border-gray-100 md:col-span-1 col-span-1">
            <h3 className="text-xs md:text-sm font-medium text-[#B0B0B0]">最新活動</h3>
            <p className="text-base md:text-lg font-medium text-[#333333] mt-1 md:mt-2 line-clamp-1">
              {props.latestProject === null ? "目前無專案" : props.latestProject}
            </p>
            <p className="text-xs md:text-sm text-[#1E3A8A] mt-1">
              {props.latestDate === null ? "目前無更新" : getDate()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
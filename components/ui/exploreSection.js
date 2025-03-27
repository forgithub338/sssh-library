import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import interestAreas from "../data/interestArea";

export default function ExploreSection() {
  return (
    <div className="mt-8 bg-white rounded-xl p-6 shadow border border-gray-100">
      <h3 className="text-lg font-medium text-[#333333] mb-4">探索學習領域</h3>
      <div className="space-y-6">
        {interestAreas.map((subject) => (
          <div 
            key={subject.subjectId}
            className="w-full"
          >
            <h2 className="text-lg font-medium mb-3 text-[#1E3A8A]">{subject.subject}</h2>
            <div className="flex flex-wrap gap-2">
              {subject.interests.map((interest) => (
                <button
                  key={interest.id}
                  className="px-4 py-2 rounded-lg text-[#1E3A8A] bg-[#FAF3E0] hover:bg-[#1E3A8A] hover:text-white transition-colors duration-300 border border-transparent hover:border-blue-100 text-sm"
                >
                  {interest.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#B0B0B0] mb-2">作品類型</label>
          <select className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent">
            <option value="">所有類型</option>
            <option value="web">網頁設計</option>
            <option value="graphic">平面設計</option>
            <option value="uxui">UI/UX</option>
            <option value="video">影片製作</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#B0B0B0] mb-2">分享時間</label>
          <select className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent">
            <option value="">所有時間</option>
            <option value="week">本週</option>
            <option value="month">本月</option>
            <option value="year">今年</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#B0B0B0] mb-2">排序方式</label>
          <select className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent">
            <option value="latest">最新上傳</option>
            <option value="popular">最多喜歡</option>
            <option value="views">最多瀏覽</option>
          </select>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <button className="px-5 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#9B1B30] transition-colors duration-300 flex items-center">
          <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
          探索作品
        </button>
      </div>
    </div>
  );
} 
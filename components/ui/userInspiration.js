import inspirations from "../data/inspirations";

export default function UserInspiration() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-xl border border-gray-100">
      <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="p-4 text-white">
        <h3 className="text-lg font-medium">創作靈感</h3>
      </div>
      <div className="p-5 divide-y divide-gray-200">
        {inspirations.map((item) => (
          <div key={item.id} className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-start">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full ${item.bgColor} flex items-center justify-center`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-[#333333]">{item.title}</p>
                <p className="mt-1 text-sm text-[#B0B0B0]">{item.content}</p>
                <div className="mt-2">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF3E0] text-[#1E3A8A] mr-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <a href="#" className="text-sm font-medium text-[#1E3A8A] hover:text-[#9B1B30] transition-colors flex justify-center items-center">
          探索更多靈感
          <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
} 
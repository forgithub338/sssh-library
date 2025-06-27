import statCardsBasic from "../data/statCards";

export default function UserStatics(props) {
  const statCards = statCardsBasic(props);
  
  return (
    <div className="mt-6 md:mt-8 grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((card) => (
        <div key={card.name} className="bg-white overflow-hidden shadow rounded-xl border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300">
          <div className="p-4 md:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-[#FAF3E0] p-2 md:p-3 rounded-lg">
                <card.icon className="h-5 w-5 md:h-6 md:w-6 text-[#1E3A8A]" aria-hidden="true" />
              </div>
              <div className="ml-4 md:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs md:text-sm font-medium text-[#B0B0B0] truncate">{card.name}</dt>
                  <dd>
                    <div className="text-base md:text-lg font-medium text-[#333333]">{card.amount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2D4A9A] px-4 md:px-5 py-2 md:py-3">
            <div className="text-xs md:text-sm">
              <a href={card.href} className="font-medium text-white hover:text-white/80 flex justify-between items-center">
                查看詳情
                <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
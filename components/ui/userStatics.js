import statCards from "../data/statCards";

export default function UserStatics() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card) => (
                  <div key={card.name} className="bg-white overflow-hidden shadow rounded-xl border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-[#FAF3E0] p-3 rounded-lg">
                          <card.icon className="h-6 w-6 text-[#1E3A8A]" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-[#B0B0B0] truncate">{card.name}</dt>
                            <dd>
                              <div className="text-lg font-medium text-[#333333]">{card.amount}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2D4A9A] px-5 py-3">
                      <div className="text-sm">
                        <a href="#" className="font-medium text-white hover:text-white/80 flex justify-between items-center">
                          查看詳情
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

import { XMarkIcon } from "@heroicons/react/24/outline";
import navigationBasic from "@/../components/data/navigation";



export default function SideBarMedia(props) {
  const navigation = navigationBasic(props.position)
  
  return (
    <div className={`fixed inset-0 z-40 flex md:hidden ${props.sidebarOpen ? 'visible' : 'invisible'}`} role="dialog" aria-modal="true">
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${props.sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
        aria-hidden="true" onClick={() => props.setSidebarOpen(false)}></div>
      
      <div className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition transform ${props.sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => props.setSidebarOpen(false)}
          >
            <span className="sr-only">關閉側邊欄</span>
            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-shrink-0 flex items-center px-4">
          <h1 className="text-2xl font-bold text-[#1E3A8A]">學習成果分享平台</h1>
        </div>
        <div className="mt-5 flex-1 h-0 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center px-4 py-3 text-base font-medium rounded-xl text-[#333333] hover:bg-[#FAF3E0] hover:text-[#1E3A8A] transition-colors"
              >
                <item.icon className="mr-4 h-6 w-6 text-[#B0B0B0] group-hover:text-[#1E3A8A] transition-colors" aria-hidden="true" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

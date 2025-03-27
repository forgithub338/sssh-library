import navigation from "../data/navigation";
import { useRouter } from 'next/navigation';
import getUserEmail from '@/../lib/getUserEmail';

export default function SideBarDesktop() {
  const router = useRouter();
  const email = getUserEmail();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1">
          <div style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}} className="flex items-center h-16 flex-shrink-0 px-6 text-white">
            <h1 className="text-2xl font-bold">學習成果平台</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto bg-white border-r border-gray-200">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => router.push(`${item.href}?email=${email}`)}
                  className="group flex items-center px-4 py-3 text-base font-medium rounded-xl text-[#333333] hover:bg-[#FAF3E0] hover:text-[#1E3A8A] transition-colors w-full"
                >
                  <item.icon className="mr-3 h-6 w-6 text-[#B0B0B0] group-hover:text-[#1E3A8A] transition-colors" aria-hidden="true" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

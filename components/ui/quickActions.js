import { useRouter } from 'next/navigation';
import getUserEmail from '@/../lib/getUserEmail';

export default function QuickActions() {
  const router = useRouter();
  const email = getUserEmail();

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <button 
        style={{background: 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}}
        className="relative overflow-hidden group px-6 py-5 text-white rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl flex items-center justify-center font-medium text-lg"
        onClick={() => router.push('/upload')}
        onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #9B1B30, #9B1B30)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1E3A8A, #2D4A9A)'}
      >
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 transform group-hover:-translate-y-1 transition-transform duration-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        分享新作品
      </button>
      
      <button 
        className="relative overflow-hidden group px-6 py-5 text-[#1E3A8A] bg-white rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl flex items-center justify-center font-medium text-lg border-2 border-[#1E3A8A] hover:text-[#9B1B30] hover:border-[#9B1B30]"
        onClick={() => router.push('/projects')}
      >
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#FAF3E0] rounded-full group-hover:w-80 group-hover:h-80 opacity-50"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
        瀏覽我的作品集
      </button>
    </div>
  );
} 
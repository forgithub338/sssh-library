import {
  HomeIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

export default function getNavigation(position) {
  // 所有用戶的基本導航項
  const baseNavigation = [
    {
      name: '儀表板',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: '我的作品',
      href: '/projects',
      icon: DocumentTextIcon,
    },
    {
      name: '上傳作品',
      href: '/upload',
      icon: ArrowUpTrayIcon,
    },
    {
      name: '個人資料',
      href: '/profile',
      icon: UserCircleIcon,
    },
  ];

  // 僅管理員可見的導航項
  if (position === '管理者') {
    return [
      ...baseNavigation,
      {
        name: '待審核專案',
        href: '/admin/review-projects',
        icon: ClipboardDocumentCheckIcon,
      }
    ];
  }

  return baseNavigation;
}
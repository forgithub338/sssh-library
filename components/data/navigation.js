import { ChartBarIcon, DocumentTextIcon, PhotoIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default [
  { name: '首頁', href: '/', icon: ChartBarIcon },
  { name: '個人資訊', href: '/dashboard', icon: UserCircleIcon },
  { name: '上傳新作品', href: '/upload', icon: DocumentTextIcon },
  { name: '已上傳作品集', href: '/projects', icon: PhotoIcon }
];
import { DocumentTextIcon, HeartIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function getStatCards(props) {
  return [
    { name: '已分享作品', href: '/projects', amount: props.project ? props.project : '0', icon: DocumentTextIcon },
    { name: '獲得喜歡', href: '/projects', amount: props.love ? props.love : '0', icon: HeartIcon },
    { name: '作品瀏覽量', href: '/projects', amount: props.view ? props.view : '0', icon: EyeIcon },
  ];
}

import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function latestFiles({latestProject1, latestProject2, latestProject3, latestProject4}) {
  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    // If it's already in a simple format, return as is
    if (!dateString.includes('T')) return dateString;
    
    // Parse the ISO string
    const date = new Date(dateString);
    
    // Format as YYYY/MM/DD HH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  return [
    {
      id: latestProject1?.project_id || 1,
      title: latestProject1?.title || '無標題專案',
      type: latestProject1?.type || '未分類',
      section: latestProject1?.section,
      date: latestProject1?.date ? formatDate(latestProject1.date) : '未知日期',
      likes: latestProject1?.love || 0,
      views: latestProject1?.view || 0,
      typeColor: 'bg-[#1E3A8A]',
      icon: DocumentTextIcon
    },
    {
      id: latestProject2?.project_id || 2,
      title: latestProject2?.title || '無標題專案',
      type: latestProject2?.type || '未分類',
      section: latestProject2?.section,
      date: latestProject2?.date ? formatDate(latestProject2.date) : '未知日期',
      likes: latestProject2?.love || 0,
      views: latestProject2?.view || 0,
      typeColor: 'bg-purple-500',
      icon: DocumentTextIcon
    },
    {
      id: latestProject3?.project_id || 3,
      title: latestProject3?.title || '無標題專案',
      type: latestProject3?.type || '未分類',
      section: latestProject3?.section,
      date: latestProject3?.date ? formatDate(latestProject3.date) : '未知日期',
      likes: latestProject3?.love || 0,
      views: latestProject3?.view || 0,
      typeColor: 'bg-[#9B1B30]',
      icon: DocumentTextIcon
    },
    {
      id: latestProject4?.project_id || 4,
      title: latestProject4?.title || '無標題專案',
      type: latestProject4?.type || '未分類',
      section: latestProject4?.section,
      date: latestProject4?.date ? formatDate(latestProject4.date) : '未知日期',
      likes: latestProject4?.love || 0,
      views: latestProject4?.view || 0,
      typeColor: 'bg-green-500',
      icon: DocumentTextIcon
    },
  ];
} 
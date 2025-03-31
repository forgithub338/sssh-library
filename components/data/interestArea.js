// 成果類型選項
export const projectTypes = [
  { id: 1, name: "課程成果" },
  { id: 2, name: "自主學習" },
  { id: 3, name: "跨國交流" },
  { id: 4, name: "競賽作品" },
  { id: 5, name: "專題研究" }
];

// 學科領域與子項目
export const subjectAreas = [
  {
    subject: "資訊",
    subjectId: 1,
    interests: [
      { id: 1, name: "UI/UX 前端設計" },
      { id: 2, name: "C++" },
      { id: 3, name: "Python" },
      { id: 4, name: "Java" },
      { id: 5, name: "資料庫設計" },
      { id: 6, name: "APP開發" }
    ]
  },
  {
    subject: "音樂",
    subjectId: 2,
    interests: [
      { id: 7, name: "作曲/編曲" },
      { id: 8, name: "作詞" },
      { id: 9, name: "混音工程" },
      { id: 10, name: "演奏" },
      { id: 11, name: "音樂理論" }
    ]
  },
  {
    subject: "體育",
    subjectId: 3,
    interests: [
      { id: 12, name: "棒球" },
      { id: 13, name: "籃球" },
      { id: 14, name: "排球" },
      { id: 15, name: "羽球" },
      { id: 16, name: "游泳" },
      { id: 17, name: "田徑" }
    ]
  },
  {
    subject: "美術",
    subjectId: 4,
    interests: [
      { id: 18, name: "攝影" },
      { id: 19, name: "3D 建模" },
      { id: 20, name: "平面設計" },
      { id: 21, name: "水彩" },
      { id: 22, name: "素描" },
      { id: 23, name: "動畫" }
    ]
  },
  {
    subject: "家政",
    subjectId: 5,
    interests: [
      { id: 24, name: "烹飪" },
      { id: 25, name: "縫紉" },
      { id: 26, name: "營養學" },
      { id: 27, name: "食品科學" }
    ]
  },
  {
    subject: "語文",
    subjectId: 6,
    interests: [
      { id: 28, name: "寫作" },
      { id: 29, name: "演講" },
      { id: 30, name: "文學賞析" },
      { id: 31, name: "翻譯" }
    ]
  },
  {
    subject: "社會科學",
    subjectId: 7,
    interests: [
      { id: 32, name: "歷史研究" },
      { id: 33, name: "地理考察" },
      { id: 34, name: "公民參與" },
      { id: 35, name: "社會調查" }
    ]
  },
  {
    subject: "自然科學",
    subjectId: 8,
    interests: [
      { id: 36, name: "物理實驗" },
      { id: 37, name: "化學研究" },
      { id: 38, name: "生物觀察" },
      { id: 39, name: "環境科學" }
    ]
  },
  {
    subject: "數學",
    subjectId: 9,
    interests: [
      { id: 40, name: "代數" },
      { id: 41, name: "幾何" },
      { id: 42, name: "統計" },
      { id: 43, name: "數學建模" }
    ]
  }
];

// 預設導出為向後兼容
export default subjectAreas;
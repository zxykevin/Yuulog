// 日记数据配置
// 用于管理日记页面的数据

export interface DiaryItem {
	id: number;
	title?: string;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

const diaryData: DiaryItem[] = [
	{
		id: 1,
		title: "日记页面正在整理中",
		content: "这里之后会放一些生活记录、碎片想法和旅行笔记。",
		date: "2026-06-15T00:00:00+02:00",
		images: ["/images/diary/diary-0-1.webp"],
	},
];

// 获取日记列表（按时间倒序）
export const getDiaryList = (limit?: number) => {
	const sortedData = [...diaryData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 获取所有标签
export const getAllTags = () => {
	const tags = new Set<string>();
	diaryData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};

// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "yuulog",
		title: "Yuulog",
		description:
			"个人博客“星轨手札”，记录德国留学、日本旅行、动漫巡礼与技术折腾。",
		image: "",
		category: "web",
		techStack: ["Astro", "TypeScript", "Tailwind CSS", "Svelte"],
		status: "in-progress",
		sourceCode: "https://github.com/zxykevin/Yuulog",
		visitUrl: "https://yuulog.org/",
		startDate: "2026-05-09",
		featured: true,
		tags: ["Blog", "Astro", "Open Source"],
		showImage: false,
	},
	{
		id: "yuucomments",
		title: "YuuComments",
		description:
			"面向静态网站的轻量评论系统，基于 Cloudflare Workers 与 D1 构建。",
		image: "",
		category: "web",
		techStack: ["Cloudflare Workers", "TypeScript", "D1", "JavaScript"],
		status: "in-progress",
		sourceCode: "https://github.com/zxykevin/YuuComments",
		visitUrl: "https://yuucomments-cf-pages-demo.pages.dev/",
		startDate: "2026-05-16",
		featured: true,
		tags: ["Comments", "Cloudflare", "Open Source"],
		showImage: false,
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter(
		(p) => p.status === "completed",
	).length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};

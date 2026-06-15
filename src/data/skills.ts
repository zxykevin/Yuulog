// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	{
		id: "astro",
		name: "Astro",
		description: "用于构建个人博客和内容型网站的现代静态站点框架。",
		icon: "logos:astro",
		category: "frontend",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: ["yuulog"],
		color: "#BC52EE",
	},
	{
		id: "typescript",
		name: "TypeScript",
		description:
			"用于编写易于维护的前端代码与 Cloudflare Workers API，并通过类型检查减少错误。",
		icon: "logos:typescript-icon",
		category: "frontend",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: ["yuulog", "yuucomments"],
		color: "#3178C6",
	},
	{
		id: "javascript",
		name: "JavaScript",
		description: "用于实现浏览器交互、静态网站功能与无服务器应用逻辑。",
		icon: "logos:javascript",
		category: "frontend",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: ["yuulog", "yuucomments"],
		color: "#F7DF1E",
	},
	{
		id: "html-css",
		name: "HTML / CSS",
		description: "用于构建语义清晰、响应式且具有良好可访问性的网页界面。",
		icon: "logos:html-5",
		category: "frontend",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: ["yuulog", "yuucomments"],
		color: "#E34F26",
	},
	{
		id: "cloudflare-workers",
		name: "Cloudflare Workers",
		description: "用于构建基于边缘计算的 API 和轻量级后端逻辑。",
		icon: "simple-icons:cloudflareworkers",
		category: "backend",
		level: "intermediate",
		experience: { years: 0, months: 6 },
		projects: ["yuucomments"],
		color: "#F38020",
	},
	{
		id: "cloudflare-d1",
		name: "Cloudflare D1",
		description:
			"用于在无服务器应用中存储关系型数据，并管理数据库迁移与查询。",
		icon: "simple-icons:cloudflare",
		category: "database",
		level: "intermediate",
		experience: { years: 0, months: 6 },
		projects: ["yuucomments"],
		color: "#F48120",
	},
	{
		id: "git-github",
		name: "Git & GitHub",
		description: "用于版本控制、问题跟踪、版本发布与项目协作。",
		icon: "logos:git-icon",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: ["yuulog", "yuucomments"],
		color: "#F05032",
	},
	{
		id: "wrangler",
		name: "Wrangler",
		description:
			"用于开发、配置和部署 Cloudflare Workers，并管理 D1 数据库迁移。",
		icon: "simple-icons:cloudflare",
		category: "tools",
		level: "intermediate",
		experience: { years: 0, months: 6 },
		projects: ["yuucomments"],
		color: "#F38020",
	},
	{
		id: "cpp",
		name: "C++",
		description:
			"掌握基础语法与编程概念，并用于学习程序逻辑和解决基础问题。",
		icon: "logos:c-plusplus",
		category: "other",
		level: "beginner",
		experience: { years: 0, months: 6 },
		color: "#00599C",
	},
];

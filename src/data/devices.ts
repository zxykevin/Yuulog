// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	ASUS: [
		{
			name: "ASUS TUF Gaming F16 2024",
			image: "/images/device/asus-tuf-gaming-f16-2024.webp",
			specs: "i9-14900HX / RTX 4070 Laptop / 32GB RAM / 3TB SSD",
			description:
				"我的主力笔记本，主要用于日常使用、开发、游戏和本地项目测试。",
			link: "https://www.asus.com.cn/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-f16-2024/",
		},
	],
	Huawei: [
		{
			name: "Huawei Pura 70 Pro+",
			image: "/images/device/huawei-pura70-pro-plus.webp",
			specs: "16GB + 512GB",
			description:
				"我的主力手机，用于日常通信、拍照、旅行记录和移动端测试。",
			link: "https://consumer.huawei.com/cn/support/phones/pura70-pro-plus/",
		},
		{
			name: "Huawei MatePad Pro 12.2",
			image: "/images/device/huawei-matepad-pro-12-2.webp",
			specs: "12GB + 256GB",
			description: "主要用于上课、记笔记、阅读文档和轻量级内容浏览。",
			link: "https://consumer.huawei.com/cn/support/tablets/matepad-pro-12-2/",
		},
	],
	Beyerdynamic: [
		{
			name: "Beyerdynamic DT 770 PRO X",
			image: "/images/device/dt-770-pro-x.webp",
			specs: "Closed-back / Wired / Studio Headphones",
			description:
				"我的主力有线耳机，主要用于听音乐、看视频和日常电脑使用。",
			link: "https://www.beyerdynamic.de/p/dt-770-pro-x",
		},
	],
};

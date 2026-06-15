import type { ImageMetadata } from "astro";

const R2_GALLERY_BASE_URL = "https://img.yuulog.org/gallery";
const OSAKA_TOKYO_R2_ALBUM_SLUG = "osaka-tokyo";
const MOE_R2_ALBUM_SLUG = "moe";

export type GalleryImageSource = string | ImageMetadata;

export const r2GalleryImage = (albumSlug: string, fileName: string) =>
	`${R2_GALLERY_BASE_URL}/${albumSlug}/${fileName}`;

export const isRemoteImage = (src: GalleryImageSource): src is string =>
	typeof src === "string";

const moePictureFiles = Array.from({ length: 22 }, (_, index) => {
	const number = String(index + 1).padStart(3, "0");

	return `${number}.webp`;
});

export interface GalleryPhoto {
	src: GalleryImageSource;
	alt: string;
	caption: string;
	camera?: string;
}

export interface Gallery {
	slug: string;
	title: string;
	description: string;
	date: string;
	cover: GalleryImageSource;
	location: string;
	tags: string[];
	photos: GalleryPhoto[];
}

export const galleries: Gallery[] = [
	{
		slug: "osaka-kyoto-uji-toyosato-numazu-tokyo-2026",
		title: "大阪→京都→宇治→丰乡→沼津→东京旅游",
		description:
			"从关西一路走到东京，把大阪、京都、宇治、丰乡、沼津与东京的旅途片段收进同一个相册。",
		date: "2026-02-05",
		cover: r2GalleryImage(OSAKA_TOKYO_R2_ALBUM_SLUG, "001.webp"),
		location: "日本 大阪、京都、宇治、丰乡、沼津、东京",
		tags: ["日本旅行", "关西", "巡礼", "沼津", "东京"],
		photos: Array.from({ length: 728 }, (_, index) => {
			const number = String(index + 1).padStart(3, "0");
			const fileName = `${number}.webp`;

			return {
				src: r2GalleryImage(OSAKA_TOKYO_R2_ALBUM_SLUG, fileName),
				alt: `大阪到东京旅行照片 ${number}`,
				caption: `大阪到东京旅行记录 ${number}`,
			};
		}),
	},
	{
		slug: "moe",
		title: "萌物",
		description: "The world is vast, and you have to go explore it.",
		date: "2025-08-01",
		cover: r2GalleryImage(MOE_R2_ALBUM_SLUG, "001.webp"),
		location: "Bilibili",
		tags: ["Kawai", "Cute", "Moe"],
		photos: moePictureFiles.map((fileName, index) => ({
			src: r2GalleryImage(MOE_R2_ALBUM_SLUG, fileName),
			alt: `Lovely picture ${index + 1}`,
			caption: `Photo ${index + 1}`,
		})),
	},
];

export const getGalleryBySlug = (slug: string): Gallery | undefined =>
	galleries.find((gallery) => gallery.slug === slug);

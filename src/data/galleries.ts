import type { ImageMetadata } from "astro";

const R2_GALLERY_BASE_URL = "https://img.yuulog.org/gallery";
const OSAKA_TOKYO_R2_ALBUM_SLUG = "osaka-tokyo";
const MOE_R2_ALBUM_SLUG = "moe";
const NUMAZU_R2_ALBUM_SLUG = "numazu";
const NUMAZU_PHOTO_R2_ALBUM_SLUG = `${NUMAZU_R2_ALBUM_SLUG}/numazu-photo`;
const NUMAZU_POST_PHOTO_R2_ALBUM_SLUG = `${NUMAZU_R2_ALBUM_SLUG}/numazu-post-photo`;

export type GalleryImageSource = string | ImageMetadata;

export const r2GalleryImage = (albumSlug: string, fileName: string) =>
	`${R2_GALLERY_BASE_URL}/${albumSlug}/${fileName}`;

export const isRemoteImage = (src: GalleryImageSource): src is string =>
	typeof src === "string";

const moePictureFiles = Array.from({ length: 22 }, (_, index) => {
	const number = String(index + 1).padStart(3, "0");

	return `${number}.webp`;
});

const numazuPhotoFiles = Array.from({ length: 137 }, (_, index) => {
	const number = String(index + 1).padStart(3, "0");

	return `${number}.webp`;
});

const numazuPostPhotoFiles = Array.from({ length: 35 }, (_, index) => {
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
	children?: Gallery[];
}

export const galleries: Gallery[] = [
	{
		slug: "numazu",
		title: "沼津",
		description: "沼津旅途与文章配图整理。",
		date: "2026-02-09",
		cover: r2GalleryImage(NUMAZU_PHOTO_R2_ALBUM_SLUG, "001.webp"),
		location: "日本 沼津",
		tags: ["沼津", "日本旅行", "巡礼"],
		photos: [],
		children: [
			{
				slug: "numazu-photo",
				title: "沼津总览",
				description: "沼津旅行照片总览。",
				date: "2026-02-09",
				cover: r2GalleryImage(NUMAZU_PHOTO_R2_ALBUM_SLUG, "001.webp"),
				location: "日本 沼津",
				tags: ["沼津", "日本旅行", "巡礼"],
				photos: numazuPhotoFiles.map((fileName, index) => ({
					src: r2GalleryImage(NUMAZU_PHOTO_R2_ALBUM_SLUG, fileName),
					alt: `沼津总览照片 ${index + 1}`,
					caption: `沼津总览 ${index + 1}`,
				})),
			},
			{
				slug: "numazu-post-photo",
				title: "沼津文章精选",
				description: "用于沼津相关文章的精选配图。",
				date: "2026-02-09",
				cover: r2GalleryImage(NUMAZU_POST_PHOTO_R2_ALBUM_SLUG, "001.webp"),
				location: "日本 沼津",
				tags: ["沼津", "文章配图", "精选"],
				photos: numazuPostPhotoFiles.map((fileName, index) => ({
					src: r2GalleryImage(
						NUMAZU_POST_PHOTO_R2_ALBUM_SLUG,
						fileName,
					),
					alt: `沼津文章精选照片 ${index + 1}`,
					caption: `沼津文章精选 ${index + 1}`,
				})),
			},
		],
	},
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
	galleries
		.flatMap((gallery) => [gallery, ...(gallery.children ?? [])])
		.find((gallery) => gallery.slug === slug);

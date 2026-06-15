import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const albumSlug = process.argv[2];

if (!albumSlug) {
	console.error("Usage: pnpm gallery:prepare <album-slug>");
	process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(albumSlug)) {
	console.error(
		"Album slug must contain only lowercase letters, numbers, and hyphens.",
	);
	process.exit(1);
}

const inputDirectory = path.resolve("photos", "raw", albumSlug);
const outputDirectory = path.resolve("photos", "processed", albumSlug);
const supportedExtensions = new Set([
	".jpg",
	".jpeg",
	".png",
	".webp",
	".heic",
	".heif",
]);
const collator = new Intl.Collator(undefined, {
	numeric: true,
	sensitivity: "base",
});

let entries;

try {
	entries = await readdir(inputDirectory, { withFileTypes: true });
} catch (error) {
	console.error(`Unable to read input directory: ${inputDirectory}`);
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
}

const inputFiles = entries
	.filter(
		(entry) =>
			entry.isFile() &&
			!entry.name.startsWith(".") &&
			supportedExtensions.has(path.extname(entry.name).toLowerCase()),
	)
	.sort((a, b) => collator.compare(a.name, b.name));

if (inputFiles.length === 0) {
	console.error(`No supported images found in: ${inputDirectory}`);
	process.exit(1);
}

await mkdir(outputDirectory, { recursive: true });

let processedCount = 0;
let failedCount = 0;

for (const [index, entry] of inputFiles.entries()) {
	const outputName = `${String(processedCount + 1).padStart(3, "0")}.webp`;
	const inputPath = path.join(inputDirectory, entry.name);
	const outputPath = path.join(outputDirectory, outputName);

	process.stdout.write(
		`[${index + 1}/${inputFiles.length}] ${entry.name} -> ${outputName} ... `,
	);

	try {
		await sharp(inputPath)
			.rotate()
			.resize({
				width: 1200,
				height: 1200,
				fit: "inside",
				withoutEnlargement: true,
			})
			.webp({ quality: 82 })
			.toFile(outputPath);
		processedCount += 1;
		console.log("done");
	} catch (error) {
		failedCount += 1;
		const extension = path.extname(entry.name).toLowerCase();
		const message = error instanceof Error ? error.message : String(error);

		console.log("skipped");
		if (extension === ".heic" || extension === ".heif") {
			console.warn(
				`  HEIC/HEIF support is unavailable or this file cannot be decoded: ${message}`,
			);
		} else {
			console.warn(`  Could not process ${entry.name}: ${message}`);
		}
	}
}

console.log(
	`\nPrepared ${processedCount} image(s) in ${outputDirectory}${failedCount ? `; skipped ${failedCount}` : ""}.`,
);
console.log("Suggested upload command:");
console.log(
	`rclone copy photos/processed/${albumSlug} r2:yuulog-gallery/gallery/${albumSlug} --progress`,
);

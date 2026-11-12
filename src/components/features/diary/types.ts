import type { CollectionEntry } from "astro:content";

export interface MomentCardProps {
	moment: CollectionEntry<"diary">;
	index: number;
	minutesAgo: string;
	hoursAgo: string;
	daysAgo: string;
}

import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";
import { MERGE_SERIES_ON_HOME } from "@constants/constants";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

export type SeriesCard = {
	slug: string;
	data: CollectionEntry<"posts">["data"] & { isSeriesCard: true; seriesName: string; seriesCount: number };
};

export type PostOrSeriesCard = CollectionEntry<"posts"> | SeriesCard;

export async function getSortedPostsForHome(): Promise<PostOrSeriesCard[]> {
	if (!MERGE_SERIES_ON_HOME) {
		return await getSortedPosts();
	}

	const allPosts = await getSortedPosts();

	const seriesMap = new Map<string, CollectionEntry<"posts">[]>();

	allPosts.forEach((post) => {
		if (post.data.series) {
			const seriesName = post.data.series.trim();
			if (!seriesMap.has(seriesName)) {
				seriesMap.set(seriesName, []);
			}
			seriesMap.get(seriesName)?.push(post);
		}
	});

	const seriesNames = Array.from(seriesMap.keys());
	const seriesPosts: SeriesCard[] = seriesNames.map((seriesName) => {
		const postsInSeries = seriesMap.get(seriesName) || [];
		const latestPost = postsInSeries[0];
		return {
			slug: `/series/${encodeURIComponent(seriesName)}/`,
			data: {
				...latestPost.data,
				isSeriesCard: true,
				seriesName,
				seriesCount: postsInSeries.length,
			},
		};
	});

	const postsWithoutSeries = allPosts.filter((post) => !post.data.series);

	const combined = [...seriesPosts, ...postsWithoutSeries];

	combined.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});

	return combined;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

export type Series = {
	name: string;
	count: number;
};

export async function getSeriesList(): Promise<Series[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { series?: string } }) => {
		if (post.data.series) {
			const seriesName = post.data.series.trim();
			count[seriesName] = count[seriesName] ? count[seriesName] + 1 : 1;
		}
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return lst.map((key) => ({ name: key, count: count[key] }));
}

export async function getPostsBySeries(seriesName: string): Promise<PostForList[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const seriesPosts = allBlogPosts
		.filter((post) => post.data.series === seriesName)
		.map((post) => ({
			slug: post.slug,
			data: post.data,
		}));

	return seriesPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
}

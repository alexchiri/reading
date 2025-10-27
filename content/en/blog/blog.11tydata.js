export default {
	tags: [
		"posts",
		"posts_en"
	],
	layout: "layouts/post.njk",
	lang: "en",
	permalink: function(data) {
		return `/en/blog/${data.page.fileSlug}/`;
	}
};

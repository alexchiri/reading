export default {
	tags: [
		"posts",
		"posts_se"
	],
	layout: "layouts/post.njk",
	lang: "se",
	permalink: function(data) {
		return `/se/blog/${data.page.fileSlug}/`;
	}
};

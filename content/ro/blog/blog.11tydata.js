export default {
	tags: [
		"posts",
		"posts_ro"
	],
	layout: "layouts/post.njk",
	lang: "ro",
	permalink: function(data) {
		return `/ro/blog/${data.page.fileSlug}/`;
	}
};

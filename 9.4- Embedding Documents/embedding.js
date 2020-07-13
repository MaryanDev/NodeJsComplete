const mongoose = require("mongoose");

mongoose
	.connect("mongodb://localhost/playground")
	.then(() => console.log("Connected to MongoDB..."))
	.catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
	name: String,
	bio: String,
	website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
	"Course",
	new mongoose.Schema({
		name: String,
		authors: [authorSchema],
	})
);

async function createCourse(name, authors) {
	const course = new Course({
		name,
		authors,
	});

	const result = await course.save();
	console.log(result);
}

async function updateCourse(courseId) {
	const course = await Course.findById(courseId);
	course.author.name = "Marian Maikher";
	await course.save();
}

async function updateCourseDirectly(courseId) {
	await Course.update(
		{ _id: courseId },
		{
			$set: {
				"author.name": "Maikher Marian",
			},
		}
	);
}

async function findAndUpdateCourseDirectly(courseId) {
	await Course.findByIdAndUpdate(courseId, {
		$set: {
			"author.name": "Maikher Marian 2",
		},
	});
}

async function addAuthor(courseId, author) {
	const course = await Course.findById(courseId);
	course.authors.push(author);
	await course.save();
}

async function removeAuthor(courseId, authorId) {
	const course = await Course.findById(courseId);
	const author = course.authors.id(authorId);
	author.remove();
	await course.save();
}

async function listCourses() {
	const courses = await Course.find();
	console.log(courses);
}

removeAuthor("5f0c5fa2ddf7354d00656731", "5f0c609c178e1d0c1476c281");

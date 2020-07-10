const mongoose = require("mongoose");

mongoose
	.connect("mongodb://localhost/mongo-exercises", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected"))
	.catch((err) => console.log("could not connect. " + err));

const courseSchema = new mongoose.Schema({
	// _id: String,
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		// match: /pattern/,
	},
	category: {
		type: String,
		enum: ["web", "mobile", "network"],
		lowercase: true,
		// uppercase: true
		trim: true,
	},
	author: String,
	tags: {
		type: [String],
		validate: {
			// isAsync: true,
			validator: function (v) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve(v && v.length > 0);
					}, 4000);
				});
			},
			message: "A course should have at least one tag.",
		},
	},
	date: { type: Date, default: Date.now },
	isPublished: Boolean,
	price: {
		type: Number,
		required: function () {
			return this.isPublished;
		},
		min: 10,
		max: 150,
		get: (v) => Math.round(v),
		set: (v) => Math.round(v),
	},
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
	const course = new Course({
		name: "Angular",
		author: "Maryan",
		tags: ["Web"],
		isPublished: true,
		category: "Web   ",
		price: 50.6,
	});

	try {
		// await course.validate();
		const result = await course.save();
		console.log("test");

		console.log(result);
	} catch (ex) {
		for (field in ex.errors) {
			console.log(ex.errors[field]);
		}
	}
}

async function getCourses() {
	const courses = await Course
		// .find({ author: "Maryan" })
		// .find({ price: { $gte: 10, $lte: 20 } })
		// .find({ price: { $in: [10, 15, 20] } })
		// .find()
		// .or([{ author: "Maryan" }, { isPublished: true }])

		//Starts with
		// .find({ author: /^Mary/ })
		//Ends with insensitive
		// .find({ author: /Maikher$/i })
		//contains, .* - zero or more
		// .find({ author: /.*Maryan.*/ })
		.limit(10)
		.sort({ name: 1 })
		.select({ name: 1, tags: 1 });
	console.log(courses);
}

async function updateCourse(id) {
	const course = await Course.findById(id);
	if (!course) {
		return;
	}

	course.set({
		name: "C# course",
		author: "Marian Maikher",
	});

	const result = await course.save();
	console.log(result);
}

async function updateCourseDocument(id) {
	const course = await Course.findByIdAndUpdate(
		id,
		{
			$set: {
				author: "Maikher Marian",
				name: "SQL course",
			},
		},
		{ new: true }
	);

	console.log(course);
}

async function removeDocument(id) {
	const result = await Course.deleteOne({ _id: id });
	console.log(result);
}

// updateCourse("5a68fdc3615eda645bc6bdec");
// updateCourseDocument("5a68fdc3615eda645bc6bdec");
// removeDocument("5a68fdc3615eda645bc6bdec");
createCourse();

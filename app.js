var bodyParser = require("body-parser"),
methodOverride = require("method-override"), //override method, use in edit.ejs to update
mongoose = require("mongoose"),
express = require("express"),
app = express();



// mongoose.connect("mongodb+srv://admin-jin:1011@cluster0-eoevk.mongodb.net/<Name OF DB>", { useNewUrlParser: true })
//APP CONFIG
mongoose.connect("mongodb+srv://admin-jin:1011@cluster0-eoevk.mongodb.net/restful_blog_app", { useNewUrlParser: true }) // if find restful_blog app will get things inside this, but if not, it will create one
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));         //use override method in app



//MONGOOSE/MODLE CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created:{type: Date, default: Date.now}
});



//------------------------------------------------------------------------------------

//RESTFUL ROUTE
var Blog= mongoose.model("Blog", blogSchema);
/*
//First blog:
Blog.create({
	title: "Test Blog",
	image:"https://thumbs-prod.si-cdn.com/s-rtW1rEAQTIGcmUVNFSSPC4s3I=/800x600/filters:no_upscale()/https://public-media.si-cdn.com/filer/56/4a/564a542d-5c37-4be7-8892-98201ab13180/cat-2083492_1280.jpg",
	body: "Hello!!!"
});
*/

app.get("/",function(req,res){
	res.redirect("/blogs");
});
app.get("/blogs", function(req,res){
	Blog.find({},function(err, blogs){
		if(err){
			console.log("Error");
		}else{
			res.render("index",{blogs:blogs});  //index.ejs
		}
	});
	
});

//---------------------------------------------------------------------------------------
//New Route- also in new.ejs
app.get("/blogs/new",function(req,res){
	res.render("new");  //new.ejs
});

//CREATE ROUTE
app.post("/blogs", function(req,res){
	//create blog
	Blog.create(req.body.blog,function(err,newBlog){ //req.body will take data from name="blog" (blog[title], blog[body]), and make it a blog 
													//(we got req.body.blog because in new.ejs, we name it as blog[title]..., if we name it as blih["title"], we got req.body.blih) 
		if(err){
			res.render("new"); // go to new.ejs
		}else{
			res.redirect("/blogs");// redirect to same page
		}
	})
});

//Show Route -edit also in show.ejs and index.ejs
app.get("/blogs/:id",function(req,res){ //u dont need :id in ejs, but u need to write :id in app.js
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	})
})

//Edit -edit.ejs
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{ blog:foundBlog}); //go to edit.ejs
		}
	});
});

//Update route -edit.ejs, install override method in Git Bash, and tell app to use it (line 2 and line 12)
app.put("/blogs/:id", function(req,res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});


//Delete Route:
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redire("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
})

// var port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log("Server Has Started!");
// });


let port =process.env.PORT;
if (port ==null || port == ""){
	port =3000;
}
app.listen(port,function(){
	console.log("server is running!!");
});


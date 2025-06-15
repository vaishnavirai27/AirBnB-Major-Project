const express=require("express");
const router=express.Router(); 
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js"); 
const upload = multer({ storage });

//combine the / routes together using router.route index and create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
     upload.single('image'),
    validateListing,
    wrapAsync(listingController.createListing)
);


//New route
router.get("/new",isLoggedIn,listingController.renderNewForm);


//combine /:id for update and show and delete
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('image'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));





//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports=router;
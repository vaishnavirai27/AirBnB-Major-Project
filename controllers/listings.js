const Listing=require("../models/listing");



module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
        
    };

module.exports.renderNewForm=(req,res)=>{
     res.render("listings/new.ejs");
};

module.exports.showListing=(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).
    populate({path:"reviews",
        populate:{
        path:"author",
    },
}).populate("owner");
    if(!listing){
        req.flash("error","Listing requested does not exist!!");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
});

const axios = require('axios');

module.exports.createListing = async (req, res, next) => {
  try {
    const { listing } = req.body;
    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Geocoding using Nominatim
    const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: listing.location,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'Wanderlust App (vaishnavi@example.com)' // Use your actual email
      }
    });

    if (geoResponse.data.length > 0) {
      const coords = geoResponse.data[0];
      newListing.geometry = {
        lat: coords.lat,
        lng: coords.lon
      };
    } else {
      newListing.geometry = null; // Optional: handle invalid location gracefully
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    console.error("Error in createListing:", err);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings/new");
  }
};


    module.exports.renderEditForm=async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing requested does not exist!!");
            res.redirect("/listings")
        }
        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs",{listing,originalImageUrl});
    };  

    module.exports.updateListing=async (req,res)=>{
        let {id}=req.params;
        let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(typeof req.file!=="undefined"){
         let url=req.file.path;
         let filename=req.file.filename;
         listing.image={url,filename};
         await listing.save();
        }
        req.flash("success","Listing Updated!");
        res.redirect(`/listings/${id}`);
    };

    module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};
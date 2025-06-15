const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const MongoURL="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connected to Db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect(MongoURL);
};

const initDB=async()=>{
    await Listing.deleteMany({});
    
    initData.data=initData.data.map((obj)=>
        ({
        ...obj,
        image:{
            url:obj.image.url,
            filename:obj.image.filename,
        },
    owner:"684c02308f37d1c410b0fedd",
   }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
};

initDB();

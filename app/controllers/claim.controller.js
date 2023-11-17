const db = require("../models");
const Claim = db.claim;


exports.createClaim = (req, res) => {
    const { address, description, entityType, entityReference,user } = req.body;
    console.log({ address, description, entityType, entityReference,user })
    const images = req.files.map((file) => (
        file.filename
    ));
    const newClaim = new Claim({
        address: {
            country: req.body["address.country"],
            state: req.body["address.state"],
            city: req.body["address.city"],
            street: req.body["address.street"],
            areaCode: req.body["address.areaCode"]
        },
        description,
        images,
        entityType,
        entityReference: entityReference,
        user:user
    });

    newClaim
        .save()
        .then((claim) => res.status(201).json(claim))
        .catch((error) => res.status(500).json({ error: error.message }));
}

exports.getById = async (req, res) => {
    const claimId = req.query.id;
    Claim.findById(claimId)
    .populate('entityReference') 
    .exec()
    .then((claim) =>{
        

        if (claim) {
            const imageDataArray = claim.images;
            const imageDataUrls = imageDataArray.map((imageData) => {
              const dataUri = `data:${imageData.contentType};base64,${imageData.data.toString('base64')}`;
              return dataUri;
            });
    
            // Send the data URI image URLs to the client
            res.json({
                claim,
              images: imageDataUrls,
              // Add other claim properties if needed
            });
            // res.json(claim);
          } else {
            res.status(404).json({ message: 'Claim not found' });
          }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}


exports.getPages = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalRecords = await Claim.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        const claim = await Claim.find().select("_id title entityType ")
            .skip(skip)
            .limit(limit)
            .exec();

        const response = {
            claim,
            pagination: {
                currentPage: page,
                totalPages,
                totalRecords,
            },
        };

        res.send(response);
    } catch (error) {
        res.status(500).send(error);
    }
}


exports.search = async (req, res) => {
    const search = req.query.search || "";
    const regex = new RegExp(search, 'i');
    const query = {
        $or: [
            { 'title': { $regex: regex } },
            { 'description': { $regex: regex } }
        ],
    };

    Claim.find(query, (err, results) => {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(results)
        }
    }).select("_id title entityType ")

}


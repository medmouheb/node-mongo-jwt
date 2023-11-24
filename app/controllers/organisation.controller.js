const db = require("../models");
const Organisation = db.organisation;


exports.createOrganisation = (req, res) => {
    const { name, description,longitude,latitude } = req.body;
    const images = req.files.map((file) => (
        file.filename
    ));
    const newOrganisation = new Organisation({
        name,
        address: {
            country: req.body["address.country"],
            state: req.body["address.state"],
            city: req.body["address.city"],
            street: req.body["address.street"],
            areaCode: req.body["address.areaCode"]
        },
        description,
        images,
        longitude,
        latitude
    });

    newOrganisation
        .save()
        .then((organisation) => res.status(201).json(organisation))
        .catch((error) => res.status(500).json({ error: error.message }));
}

exports.getById = async (req, res) => {
    console.log("xx::",req.query.id)
    const organisationId = req.query.id;
    Organisation.findById(organisationId)
        .exec()
        .then((organisation) => {


            if (organisation) {
                res.json(organisation);
                // res.json(organisation);
            } else {
                res.status(404).json({ message: 'Organisation not found' });
            }
        })
        .catch((error) => res.status(500).json({ error: error.message }));
}


exports.getPages = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalRecords = await Organisation.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        const organisation = await Organisation.find().select("_id title entityType ")
            .skip(skip)
            .limit(limit)
            .exec();

        const response = {
            organisation,
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


// exports.search = async (req, res) => {
//     const search = req.query.search || "";
//     const regex = new RegExp(search, 'i');
//     const query = {
//         $or: [
//             { 'title': { $regex: regex } },
//             { 'description': { $regex: regex } }
//         ],
//     };

//     Organisation.find(query, (err, results) => {
//         if (err) {
//             res.status(500).send(err);

//         } else {
//             res.send(results)
//         }
//     }).select("_id title entityType ")

// }


exports.search = async (req, res) => {
    console.log("fegege")
    const search = req.query.search || "";
    const regex = new RegExp(search, 'i');
    const query = {
        $or: [
            { 'name': { $regex: regex } },
            { 'address.country': { $regex: regex } },
            { 'address.state': { $regex: regex } },
            { 'address.city': { $regex: regex } },
            { 'address.street': { $regex: regex } },
            { 'address.areaCode': { $regex: regex } },
        ],
    };

    Organisation.find(query, (err, results) => {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(results)
        }
    }).limit(10).select("_id name images")

}


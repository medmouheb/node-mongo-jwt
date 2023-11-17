const db = require("../models");
const GasStation = db.gasStation;


exports.createGasStation = (req, res) => {
    const { name, description,longitude,latitude } = req.body;
    const images = req.files.map((file) => (
        file.filename
    ));
    const newGasStation = new GasStation({
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

    newGasStation
        .save()
        .then((gasStation) => res.status(201).json(gasStation))
        .catch((error) => res.status(500).json({ error: error.message }));
}

exports.getById = async (req, res) => {
    const gasStationId = req.query.id;
    GasStation.findById(gasStationId)
        .populate('entityReference')
        .exec()
        .then((gasStation) => {


            if (gasStation) {
                const imageDataArray = gasStation.images;
                const imageDataUrls = imageDataArray.map((imageData) => {
                    const dataUri = `data:${imageData.contentType};base64,${imageData.data.toString('base64')}`;
                    return dataUri;
                });

                // Send the data URI image URLs to the client
                res.json({
                    gasStation,
                    images: imageDataUrls,
                    // Add other gasStation properties if needed
                });
                // res.json(gasStation);
            } else {
                res.status(404).json({ message: 'GasStation not found' });
            }
        })
        .catch((error) => res.status(500).json({ error: error.message }));
}


exports.getPages = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalRecords = await GasStation.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        const gasStation = await GasStation.find().select("_id title entityType ")
            .skip(skip)
            .limit(limit)
            .exec();

        const response = {
            gasStation,
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

    GasStation.find(query, (err, results) => {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(results)
        }
    }).select("_id title entityType ")

}


exports.search = async (req, res) => {
    const search = req.query.search || "";
    const regex = new RegExp(search, 'i');
    const query = {
        $or: [
            { 'address.country': { $regex: regex } },
            { 'address.state': { $regex: regex } },
            { 'address.city': { $regex: regex } },
            { 'address.street': { $regex: regex } },
            { 'address.areaCode': { $regex: regex } },
        ],
    };

    GasStation.find(query, (err, results) => {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(results)
        }
    }).limit(10)

}


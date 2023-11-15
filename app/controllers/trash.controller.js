const db = require("../models");
const Trash = db.trash;


exports.createTrash = (req, res) => {

    const trash = new Trash({
        address: {
            country: req.body.address.country,
            state: req.body.address.state,
            city: req.body.address.city,
            street: req.body.address.street,
            areaCode: req.body.address.areaCode
        },
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        status: req.body.status,
        name:req.body.name
    })

    trash.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        } else {
            return res.status(200).send({ message: "Trash Created" });
        }
    })
}

exports.getById = async (req, res) => {
    const _id = req.query.id;
    try {
        const trash = await Trash.findById(_id);
        if (!trash) {
            
            return res.status(404).send();
        }
        res.send(trash);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.update = async (req, res) => {
    try {
        const trash = await Trash.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!trash) {
            return res.status(404).send();
        }
        res.send(trash);
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.delete = async (req, res) => {
    const _id = req.params.id;
    try {
        const trash = await Trash.findByIdAndDelete(_id);
        if (!trash) {
            return res.status(404).send();
        }
        res.send(trash);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.getPages = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalRecords = await Trash.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        const trash = await Trash.find()
            .skip(skip)
            .limit(limit)
            .exec();

        const response = {
            trash,
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
            { 'address.country': { $regex: regex } },
            { 'address.state': { $regex: regex } },
            { 'address.city': { $regex: regex } },
            { 'address.street': { $regex: regex } },
            { 'address.areaCode': { $regex: regex } },
        ],
    };

    Trash.find(query, (err, results) => {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(results)
        }
    }).limit(10)

}

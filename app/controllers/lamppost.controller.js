const db = require("../models");
const Lamppost = db.lamppost;


exports.createLamppost = (req, res) => {
    const lamppost = new Lamppost({
        address: {
            country: req.body.address.country,
            state: req.body.address.state,
            city: req.body.address.city,
            street: req.body.address.street,
            areaCode: req.body.address.areaCode
        },
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        isWorking: req.body.isWorking
    })

    lamppost.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        } else {
            return res.status(200).send({ message: "Lamppost Created" });
        }
    })
}

exports.getById = async (req, res) => {
    const _id = req.query.id;
    try {
        const lamppost = await Lamppost.findById(_id);
        if (!lamppost) {
            return res.status(404).send();
        }
        res.send(lamppost);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.update = async (req, res) => {
    try {
        const lamppost = await Lamppost.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!lamppost) {
            return res.status(404).send();
        }
        res.send(lamppost);
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.delete = async (req, res) => {
    const _id = req.params.id;
    try {
        const lamppost = await Lamppost.findByIdAndDelete(_id);
        if (!lamppost) {
            return res.status(404).send();
        }
        res.send(lamppost);
    } catch (error) {
        res.status(500).send(error);
    }
}

exports.getPages = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const totalRecords = await Lamppost.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        const lamppost = await Lamppost.find()
            .skip(skip)
            .limit(limit)
            .exec();

        const response = {
            lamppost,
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

    Lamppost.find(query, (err, results) => {
        if (err) {
            res.status(500).send(err);

        } else {
            res.send(results)
        }
    })

}

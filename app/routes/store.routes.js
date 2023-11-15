const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const db = require("../models");
const Lamppost = db.lamppost;

const Trash=db.trash
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'app/uploads/'); // Define the directory where uploaded images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });


    app.post('/addphoto', upload.single('photo'), (req, res) => {
        const photo = req.file.filename;
        res.json({ message: 'User registered successfully  ' + photo });
    });


    app.post('/uploadlamppost', upload.single('csvfile'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log("")

        const csvData = [];

        // Use csv-parser to parse the uploaded CSV data
        fs.createReadStream("app/uploads/"+req.file.filename)
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                try {
                    row["position.coordinates"]=JSON.parse(row["position.coordinates"])
                } catch (error) {
                    row["position.coordinates"]=JSON.parse( row["position.coordinates"]+"]")

                }

                const lamppost= new Lamppost({
                    name:row.name,
                    status:row.status,
                    latitude:row["position.coordinates"][0],
                    longitude:row["position.coordinates"][1],
                    address:{
                        state:row.governorate,
                        city:row.municipality
                    }

                })
                lamppost.save()

                csvData.push(row);
                

            })
            .on('end', () => {
                res.json(csvData);
            })
            .on('error', (error) => {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    });

    app.post('/uploadtrash', upload.single('csvfile'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const csvData = [];

        fs.createReadStream("app/uploads/"+req.file.filename)
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => {
                try {
                    row["position.coordinates"]=JSON.parse(row["position.coordinates"])
                } catch (error) {
                    row["position.coordinates"]=JSON.parse( row["position.coordinates"]+"]")

                }

                const trash= new Trash({
                    name: "tr-"+ row.name,
                    status:Math.floor(Math.random() * 100),
                    latitude:row["position.coordinates"][0] +0.00001,
                    longitude:row["position.coordinates"][1]+0.00001,
                    address:{
                        state:row.governorate,
                        city:row.municipality
                    }

                })

                trash.save()

                csvData.push(row);
                
            })
            .on('end', () => {
                res.json(csvData);
            })
            .on('error', (error) => {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    });

}

const express = require('express');
require('dotenv').config();
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');

const fileUpload = require('express-fileupload');

const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const { MongoClient } = require('mongodb');


const app = express()
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

//config file upload
app.use(fileUpload());

// config red.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config template engine
configViewEngine(app);

// khai bao routes
app.use('/', webRoutes);

app.use('/v1/api/', apiRoutes);





//self running function js muc dich dinh nghia async await
(async () => {
    //test conection
    try {
        //using mongoose
        await connection();



        //using mongodb driver
        // Connection URL
        const url = process.env.DB_HOST_WITH_DRIVER;
        const client = new MongoClient(url);
        // Database Name
        const dbName = process.env.DB_NAME;


        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection('customers');

        // {
        //     id: 1
        //     province: "hn",
        //         country: {
        //         name: 'vietnam',
        //             code: 10000
        //     }
        // }
        // {
        //     id: 2
        //     province: "hcm",
        //         country: {
        //         name: 'vietnam',
        //             code: 10000
        //     }
        // }

        // collection.insertOne(

        //     {
        //         "name": "Hoi Dan IT",
        //         address:
        //             [1, 2]
        //     }

        // )

        // collection.insertOne({ "name": "Hoi Dan IT" })
        // let a = await collection.findOne({ address: "hcm" })
        // console.log(">>> find = ", a)
        //

        app.listen(port, hostname, () => {
            console.log(`Backend app listening on port ${port}`)
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()

const express = require("express")
const app = express();
const cors = require('cors')
const crawlerRouter = require('./routes')

const corsOptions = {
    origin: '*',
    methods: '*',
    maxAge: 86400,
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.static("./public"));
app.use(express.json());
app.use("/api/v1", crawlerRouter);



port = process.env.PORT || 5050;

const start = async () => {
    try {
        app.listen({ port }, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.error(error);
    }
};

start();
let express = require('express')
let bodyParser = require('body-parser')
let { Configuration, OpenAIApi } = require('openai')
let dotenv = require('dotenv').config()
let ejs = require('ejs')

let app = express()
let port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static('public'))


let images = []


app.get("/", (req, res) => {

    res.render('landing')    
})

app.get("/getting-started", (req, res) => {

    res.render("index", {

        url: images
    })
})

app.post("/", async (req, res) => {

    let imgDescription = req.body.imgDescription
    let numberOfImg = Number(req.body.numberOfImg)

    images = []

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createImage({
        prompt: imgDescription,
        n: numberOfImg,
        size: "256x256",
    });

    response.data.data.forEach((data) => {

        images.push(data)
    })

    console.log(response.data);

    res.render('index', {

        url: images
    })
})

app.listen(port, () => {

    console.log(`Server is running at port ${port}`);
})
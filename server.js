const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')

const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index.ejs', { shortUrls: shortUrls })
}) // displays all the data from database

app.post('/shortUrls', async (req, res) => {
   await ShortUrl.create({ full: req.body.fullURL })
   res.redirect('/')
}) // wait until it creates a shortened url

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})// function that runs on clicking the shortened url generated and redirects to the website of the actual url
// the shortened url points to http://localhost:3000/<shortUrl>

app.listen(3000, () => console.log('Server running on port 3000'))
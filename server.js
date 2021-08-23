const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const cors=require('cors');
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})
app.use(cors());
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', (req, res,next) => {
  ShortUrl.create({ full: req.body.fullUrl }).then((shrt_url)=>{
    res.statusCode=200;
    res.end(shrt_url.short);
  })
    .catch((err)=>{
      next(err);
    })
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);
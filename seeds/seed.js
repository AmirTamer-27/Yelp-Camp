
const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./names')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'
)
    .then(() => {
        console.log("Connected to Mongo")
    })
    .catch((e) => {
        console.log(e)
    })
const seedDb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const randomNum = Math.floor(Math.random() *cities.length) + 1;
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '66ebc559c8a9172e17dc61c4',
            location: `${cities[randomNum].city},${cities[randomNum].state}`,
            title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]} `,
            geometry:{type: 'Point',
                coordinates: [ cities[randomNum].longitude, cities[randomNum].latitude ]
            },
            images: [
                { url: 'https://res.cloudinary.com/dmu9ng6w5/image/upload/v1726996911/YelpCamp/qsjdg1xpnsjzhsxs6zdi.jpg' ,
                    filename:'qsjdg1xpnsjzhsxs6zdi'
                },
                { url: 'https://res.cloudinary.com/dmu9ng6w5/image/upload/v1727074555/YelpCamp/mqno08d2jltvff7qbghr.jpg' ,
                    filename:"eemvrpaxn0ekh3maqmgo"
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium cum voluptatem nihil beatae vel! Sed vel natus delectus. Alias repudiandae laboriosam quisquam maxime libero, molestiae harum placeat deserunt incidunt voluptates',
            price: price
        })
        await camp.save();
    }

}
seedDb()
    .then(() => {
        mongoose.connection.close();
    })


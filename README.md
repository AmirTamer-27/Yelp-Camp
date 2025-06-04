# 🏕️ YelpCamp

YelpCamp is a full-stack web application that allows users to create, view, and review campgrounds. This project was built during [Colt Steele’s Web Developer Bootcamp](https://www.udemy.com/course/the-web-developer-bootcamp/) as a hands-on way to learn full-stack development using the **MERN-like stack** (MongoDB, Express, Node.js) with **EJS** templating.

---

## 📸 Features

- 📝 **User authentication** (register/login/logout with Passport.js)
- 🏕️ **CRUD operations** for campgrounds and reviews
- 📍 **Map integration** using Mapbox
- 📷 **Image upload** using Cloudinary
- 🧭 **Search and geolocation** features
- 🔐 Flash messages, input validation, route protection
- 📄 **Responsive UI** with Bootstrap 5
- 💬 Nested comment/review system
- ✨ Clean RESTful architecture and MVC structure

---

## 🚀 Tech Stack

| Layer        | Tech Used                     |
|--------------|-------------------------------|
| Frontend     | HTML, CSS, Bootstrap, EJS     |
| Backend      | Node.js, Express.js           |
| Database     | MongoDB + Mongoose            |
| Auth         | Passport.js, express-session  |
| File Upload  | Cloudinary, Multer            |
| Maps         | Mapbox                        |

---

## 📁 Project Structure

yelpcamp/
│
├── models/ # Mongoose models (User, Campground, Review)
├── routes/ # Route handlers (campgrounds, users, reviews)
├── controllers/ # MVC controller logic
├── public/ # Static assets (CSS, JS, images)
├── views/ # EJS templates (layouts, forms, partials)
├── app.js # Main Express app
├── seeds/index.js # DB seeding script (optional)
├── .env # Environment variables


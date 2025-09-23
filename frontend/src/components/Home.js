import React from 'react';
import { Link } from 'react-router-dom';
import heroimg from '../heroimg.png';
import interiorimg from '../interiorimg.png';
import butterchickenimg from '../butterchickenimg.png';
import paneerimg from '../paneerimg.png';
import chollebhatureimg from '../chollebhatureimg.png';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <img src={heroimg} alt="Restaurant Hero" className="hero-img" />
        <div className="hero-content">
         
          <p>Experience authentic Italian cuisine in an elegant atmosphere</p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn">View Menu</Link>
            <Link to="/reservations" className="btn btn-outline">Make Reservation</Link>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <h2 className="text-center mb-4">Why Choose Rahul Sir Da Dhaba?</h2>
          <div className="grid grid-3">
            <div className="feature-card card text-center">
              <div className="feature-icon">🍝</div>
              <h3>Authentic Recipes</h3>
              <p>Traditional Italian recipes passed down through generations, prepared with the finest ingredients.</p>
            </div>
            <div className="feature-card card text-center">
              <div className="feature-icon">👨‍🍳</div>
              <h3>Expert Chefs</h3>
              <p>Our skilled chefs bring years of experience and passion to every dish they create.</p>
            </div>
            <div className="feature-card card text-center">
              <div className="feature-icon">🍷</div>
              <h3>Fine Dining</h3>
              <p>Elegant atmosphere perfect for romantic dinners, business meetings, or special celebrations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="about-preview section section-light">
        <div className="container">
          <div className="grid grid-2">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Since 1985, Rahul Sir Da Dhaba has been serving the finest cuisine in the heart of the city. 
                Our family-owned restaurant combines traditional recipes with modern culinary techniques to 
                create an unforgettable dining experience.
              </p>
              <p>
From our sizzling tandoor to our slow-cooked curries, every dish is prepared with the authentic flavors of Punjab. We use fresh, homemade ingredients and traditional recipes passed down through generations to ensure a taste that feels like home.
              </p>
              <Link to="/about" className="btn mt-3">Learn More</Link>
            </div>
            <div className="about-image">
              <img src={interiorimg} alt="Restaurant Interior" className="interior-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section className="menu-preview section">
        <div className="container">
          <h2 className="text-center mb-4">Featured Dishes</h2>
          <div className="grid grid-3">
            <div className="menu-item card">
              <div className="item-image">
                <img src={butterchickenimg} alt="Butter Chicken" className="dish-img" />
              </div>
              <div className="item-content">
                <h3>Butter Chicken</h3>
                <p>Creamy tomato-based curry with tender chicken pieces</p>
                <span className="price">₹299.99</span>
              </div>
            </div>
            <div className="menu-item card">
              <div className="item-image">
                <img src={paneerimg} alt="Shahi Paneer" className="dish-img" />
              </div>
              <div className="item-content">
                <h3>Shahi Paneer</h3>
                <p>Creamy paneer curry with a rich tomato gravy</p>
                <span className="price">₹249.99</span>
              </div>
            </div>
            <div className="menu-item card">
              <div className="item-image">
                <img src={chollebhatureimg} alt="Cholle Bhature" className="dish-img" />
              </div>
              <div className="item-content">
                <h3>Cholle Bhature</h3>
                <p>Spicy chickpeas served with deep-fried bread</p>
                <span className="price">₹129.99</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link to="/menu" className="btn">View Full Menu</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section section-dark">
        <div className="container text-center">
          <h2>Ready for an Amazing Dining Experience?</h2>
          <p>Book your table today and taste the difference that quality makes.</p>
          <Link to="/reservations" className="btn">Make a Reservation</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

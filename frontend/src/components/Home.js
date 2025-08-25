import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Bella Vista</h1>
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
          <h2 className="text-center mb-4">Why Choose Bella Vista?</h2>
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
                Since 1985, Bella Vista has been serving the finest Italian cuisine in the heart of the city. 
                Our family-owned restaurant combines traditional recipes with modern culinary techniques to 
                create an unforgettable dining experience.
              </p>
              <p>
                From our wood-fired pizzas to our handmade pasta, every dish is crafted with love and 
                attention to detail. We source only the freshest ingredients and work with local suppliers 
                to ensure quality in every bite.
              </p>
              <Link to="/about" className="btn mt-3">Learn More</Link>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>Restaurant Interior</span>
              </div>
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
                <div className="image-placeholder">Pasta Carbonara</div>
              </div>
              <div className="item-content">
                <h3>Pasta Carbonara</h3>
                <p>Creamy pasta with bacon, eggs, and parmesan cheese</p>
                <span className="price">$17.99</span>
              </div>
            </div>
            <div className="menu-item card">
              <div className="item-image">
                <div className="image-placeholder">Grilled Salmon</div>
              </div>
              <div className="item-content">
                <h3>Grilled Salmon</h3>
                <p>Atlantic salmon with herbs, served with roasted vegetables</p>
                <span className="price">$24.99</span>
              </div>
            </div>
            <div className="menu-item card">
              <div className="item-image">
                <div className="image-placeholder">Tiramisu</div>
              </div>
              <div className="item-content">
                <h3>Tiramisu</h3>
                <p>Classic Italian dessert with coffee-soaked ladyfingers</p>
                <span className="price">$8.99</span>
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

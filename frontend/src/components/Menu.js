import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  paneertikkaimg,
  chicken65img, 
  samosaimg,
  paneerbuttermasalaimg,
  dalmakhaniimg,
  chollebhatureimg,
  butterchickenimg,
  gulabjamunimg,
  rasmalaiimg,
  kheerimg
} from '../assets/images';
import './Menu.css';

const Menu = () => {
  const [menuData, setMenuData] = useState({
    appetizers: [],
    mains: [],
    desserts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get image for each dish
  const getImageForDish = (dishName) => {
    const imageMap = {
      'Paneer Tikka': paneertikkaimg,
      'Chicken 65': chicken65img,
      'Samosa': samosaimg,
      'Paneer Butter Masala': paneerbuttermasalaimg,
      'Dal Makhani': dalmakhaniimg,
      'Chole Bhature': chollebhatureimg,
      'Butter Chicken': butterchickenimg,
      'Gulab Jamun': gulabjamunimg,
      'Rasmalai': rasmalaiimg,
      'Kheer': kheerimg
    };
    return imageMap[dishName] || null;
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/menu');
      setMenuData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to load menu. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="menu loading">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu error">
        <div className="container">
          <div className="error-message">
            <h2>Oops!</h2>
            <p>{error}</p>
            <button onClick={fetchMenu} className="btn">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu">
      <div className="menu-hero">
        <div className="container">
          <h1>Our Menu</h1>
          <p>Discover our carefully crafted dishes made with the finest ingredients</p>
        </div>
      </div>

      <div className="menu-content">
        <div className="container">
          
          {/* Appetizers */}
          <section className="menu-section">
            <h2 className="section-title">Appetizers</h2>
            <div className="menu-grid">
              {menuData.appetizers.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="item-image">
                    {getImageForDish(item.name) ? (
                      <img src={getImageForDish(item.name)} alt={item.name} className="dish-img" />
                    ) : (
                      <div className="image-placeholder">
                        {item.name}
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <div className="item-header">
                      <h3>{item.name}</h3>
                      <span className="price">₹{item.price}</span>
                    </div>
                    <p className="description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Courses */}
          <section className="menu-section">
            <h2 className="section-title">Main Courses</h2>
            <div className="menu-grid">
              {menuData.mains.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="item-image">
                    {getImageForDish(item.name) ? (
                      <img src={getImageForDish(item.name)} alt={item.name} className="dish-img" />
                    ) : (
                      <div className="image-placeholder">
                        {item.name}
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <div className="item-header">
                      <h3>{item.name}</h3>
                      <span className="price">₹{item.price}</span>
                    </div>
                    <p className="description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Desserts */}
          <section className="menu-section">
            <h2 className="section-title">Desserts</h2>
            <div className="menu-grid">
              {menuData.desserts.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="item-image">
                    {getImageForDish(item.name) ? (
                      <img src={getImageForDish(item.name)} alt={item.name} className="dish-img" />
                    ) : (
                      <div className="image-placeholder">
                        {item.name}
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <div className="item-header">
                      <h3>{item.name}</h3>
                      <span className="price">₹{item.price}</span>
                    </div>
                    <p className="description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Menu;

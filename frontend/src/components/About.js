import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <div className="about-hero">
        <div className="container">
          <h1>About Rahul Sir Da Dhaba</h1>
          <p>A culinary journey that began in 1985</p>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          
          {/* Our Story Section */}
          <section className="story-section">
            <div className="grid grid-2">
              <div className="story-text">
                <h2>Our Story</h2>
                <p>
                  Rahul Sir Da Dhaba was born from a simple dream: to bring authentic flavors 
                  to our community. Founded in 1985, our family restaurant has been a beloved
                  destination for nearly four decades.
                </p>
                <p>
                  What started as a small trattoria has grown into a beloved establishment, 
                  but we've never forgotten our roots. Every recipe tells a story, every 
                  dish carries tradition, and every meal creates memories.
                </p>
                <p>
                  Today, our second generation continues the legacy, bringing innovation 
                  while honoring the time-tested recipes that made us who we are.
                </p>
              </div>
              <div className="story-image">
                <div className="image-placeholder">
                  <span>Giuseppe & Maria Rossi</span>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="values-section section-light">
            <div className="container">
              <h2 className="text-center mb-4">Our Values</h2>
              <div className="grid grid-3">
                <div className="value-card card text-center">
                  <div className="value-icon">🌿</div>
                  <h3>Fresh Ingredients</h3>
                  <p>We source only the finest, locally-grown ingredients and import specialty items directly from Italy.</p>
                </div>
                <div className="value-card card text-center">
                  <div className="value-icon">👨‍👩‍👧‍👦</div>
                  <h3>Family Tradition</h3>
                  <p>Our recipes have been passed down through generations, preserving authentic Italian flavors.</p>
                </div>
                <div className="value-card card text-center">
                  <div className="value-icon">❤️</div>
                  <h3>Passion for Excellence</h3>
                  <p>Every dish is prepared with love and attention to detail, ensuring an exceptional dining experience.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="team-section">
            <h2 className="text-center mb-4">Meet Our Team</h2>
            <div className="grid grid-3">
              <div className="team-member card text-center">
                <div className="member-image">
                  <div className="image-placeholder">Chef Marco</div>
                </div>
                <h3>Chef Marco Rossi</h3>
                <p className="role">Executive Chef</p>
                <p>With over 20 years of experience, Chef Marco brings creativity and passion to every dish.</p>
              </div>
              <div className="team-member card text-center">
                <div className="member-image">
                  <div className="image-placeholder">Sofia</div>
                </div>
                <h3>Sofia Rossi</h3>
                <p className="role">Restaurant Manager</p>
                <p>Sofia ensures every guest feels like family with her warm hospitality and attention to detail.</p>
              </div>
              <div className="team-member card text-center">
                <div className="member-image">
                  <div className="image-placeholder">Chef Anna</div>
                </div>
                <h3>Chef Anna Bianchi</h3>
                <p className="role">Pastry Chef</p>
                <p>Anna creates our divine desserts, bringing sweet endings to every memorable meal.</p>
              </div>
            </div>
          </section>

          {/* Awards Section */}
          <section className="awards-section section-light">
            <div className="container">
              <h2 className="text-center mb-4">Recognition & Awards</h2>
              <div className="grid grid-2">
                <div className="awards-list">
                  <ul>
                    <li>🏆 Best Italian Restaurant 2023 - City Dining Awards</li>
                    <li>⭐ Michelin Recommended 2022</li>
                    <li>🍷 Wine Spectator Award of Excellence 2021</li>
                    <li>👑 OpenTable Diners' Choice 2020-2023</li>
                    <li>🌟 TripAdvisor Certificate of Excellence 2019-2023</li>
                  </ul>
                </div>
                <div className="awards-text">
                  <p>
                    We're honored to have received recognition from food critics and 
                    customers alike. These awards reflect our commitment to excellence 
                    and inspire us to continue raising the bar.
                  </p>
                  <p>
                    But our greatest reward is seeing the smiles on our guests' faces 
                    and knowing we've created another wonderful dining memory.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default About;

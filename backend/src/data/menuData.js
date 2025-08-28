// Sample menu data
const menuData = {
  appetizers: [
    {
      id: 1,
      name: "Paneer Tikka",
      description:
        "Cubes of paneer marinated in yogurt and spices, grilled to perfection.",
      price: 250,
      image: "/images/paneer-tikka.jpg",
      category: "Vegetarian Starter",
    },
    {
      id: 2,
      name: "Chicken 65",
      description: "Deep-fried spicy chicken pieces with a tangy, fiery flavor.",
      price: 300,
      image: "/images/chicken-65.jpg",
      category: "Non-Vegetarian Starter",
    },
    {
      id: 3,
      name: "Samosa",
      description:
        "Spicy chicken wings served with celery sticks and blue cheese dip",
      price: 50,
      image: "/images/samosa.jpg",
      category: "Vegetarian Starter / Snack",
    },
  ],
  mains: [
    {
      id: 4,
      name: "Paneer Butter Masala",
      description:
        "Cottage cheese cubes cooked in a rich tomato-based buttery gravy.",
      price: 280,
      image: "/images/salmon.jpg",
      category: "Vegetarian Curry",
    },
    {
      id: 5,
      name: "Dal Makhani",
      description:
        "Creamy black lentils slow-cooked with butter and spices.",
      price: 220,
      image: "/images/steak.jpg",
      category: "Vegetarian Curry",
    },
    {
      id: 6,
      name: "Chole Bhature",
      description:
        "Spicy chickpeas curry, popular in North India, often served with bhature.",
      price: 180,
      image: "/images/chicken-parm.jpg",
      category: "Vegetarian Curry",
    },
    {
      id: 7,
      name: "Butter Chicken",
      description: "Tender chicken cooked in a rich creamy tomato-based gravy.",
      price: 350,
      image: "/images/carbonara.jpg",
      category: "Non-Vegetarian Curry",
    },
  ],
  desserts: [
    {
      id: 8,
      name: "Gulab Jamun",
      description:
        "Soft fried milk dumplings soaked in sugar syrup.",
      price: 120,
      image: "/images/tiramisu.jpg",
      category: "desserts",
    },
    {
      id: 9,
      name: "Rasmalai",
      description:
        "Soft cheese balls soaked in sweet, thickened milk flavored with cardamom.",
      price: 180,
      image: "/images/lava-cake.jpg",
      category: "desserts",
    },
    {
      id: 9,
      name: "Kheer",
      description:
        "Rice pudding cooked with milk, sugar, and flavored with cardamom and saffron.",
      price: 150,
      image: "/images/lava-cake.jpg",
      category: "desserts",
    },
  ],
};

module.exports = menuData;

// Sample menu data
const menuData = {
  appetizers: [
    {
      id: 1,
      name: "Bruschetta Trio",
      description: "Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella",
      price: 12.99,
      image: "/images/bruschetta.jpg",
      category: "appetizers"
    },
    {
      id: 2,
      name: "Crispy Calamari",
      description: "Fresh squid rings served with marinara sauce and lemon",
      price: 14.99,
      image: "/images/calamari.jpg",
      category: "appetizers"
    },
    {
      id: 3,
      name: "Buffalo Wings",
      description: "Spicy chicken wings served with celery sticks and blue cheese dip",
      price: 11.99,
      image: "/images/wings.jpg",
      category: "appetizers"
    }
  ],
  mains: [
    {
      id: 4,
      name: "Grilled Salmon",
      description: "Atlantic salmon with herbs, served with roasted vegetables and rice",
      price: 24.99,
      image: "/images/salmon.jpg",
      category: "mains"
    },
    {
      id: 5,
      name: "Ribeye Steak",
      description: "12oz ribeye steak cooked to perfection with garlic mashed potatoes",
      price: 32.99,
      image: "/images/steak.jpg",
      category: "mains"
    },
    {
      id: 6,
      name: "Chicken Parmesan",
      description: "Breaded chicken breast with marinara sauce and melted mozzarella",
      price: 19.99,
      image: "/images/chicken-parm.jpg",
      category: "mains"
    },
    {
      id: 7,
      name: "Pasta Carbonara",
      description: "Creamy pasta with bacon, eggs, and parmesan cheese",
      price: 17.99,
      image: "/images/carbonara.jpg",
      category: "mains"
    }
  ],
  desserts: [
    {
      id: 8,
      name: "Tiramisu",
      description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
      price: 8.99,
      image: "/images/tiramisu.jpg",
      category: "desserts"
    },
    {
      id: 9,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center, served with vanilla ice cream",
      price: 9.99,
      image: "/images/lava-cake.jpg",
      category: "desserts"
    }
  ]
};

module.exports = menuData;

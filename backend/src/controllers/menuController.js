const menuData = require('../data/menuData');

// Get all menu items
const getMenu = (req, res) => {
  try {
    res.json(menuData);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching menu data' 
    });
  }
};

// Get menu items by category
const getMenuByCategory = (req, res) => {
  try {
    const { category } = req.params;
    
    if (!menuData[category]) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json({
      success: true,
      category,
      items: menuData[category]
    });
  } catch (error) {
    console.error('Error fetching menu category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching menu category' 
    });
  }
};

// Get single menu item
const getMenuItem = (req, res) => {
  try {
    const { id } = req.params;
    let foundItem = null;
    
    // Search through all categories
    Object.values(menuData).forEach(category => {
      const item = category.find(item => item.id === parseInt(id));
      if (item) foundItem = item;
    });
    
    if (!foundItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Menu item not found' 
      });
    }
    
    res.json({
      success: true,
      item: foundItem
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching menu item' 
    });
  }
};

module.exports = {
  getMenu,
  getMenuByCategory,
  getMenuItem
};

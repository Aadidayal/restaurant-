const express = require('express');
const router = express.Router();
const { getMenu, getMenuByCategory, getMenuItem } = require('../controllers/menuController');

// Get all menu items
router.get('/', getMenu);

// Get menu items by category
router.get('/category/:category', getMenuByCategory);

// Get single menu item
router.get('/item/:id', getMenuItem);

module.exports = router;

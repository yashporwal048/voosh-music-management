const eventEmitter = require('../config/events');
eventEmitter.on('favoriteAdded', (userId, category, item_id) => {
    console.log(`Event caught: User ${userId} added type ${category} to favorites`)
})
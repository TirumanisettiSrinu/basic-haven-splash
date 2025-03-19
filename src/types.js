
// This file exports the JSDoc type definitions for the app

/**
 * @typedef {Object} Hotel
 * @property {string} [_id]
 * @property {string} name
 * @property {string} type
 * @property {string} city
 * @property {string} address
 * @property {string} distance
 * @property {string[]} photos
 * @property {string} title
 * @property {string} desc
 * @property {number} rating
 * @property {string[]} rooms
 * @property {number} cheapestPrice
 * @property {boolean} featured
 */

/**
 * @typedef {Object} RoomNumber
 * @property {number} number
 * @property {Date[]} unavailableDates
 */

/**
 * @typedef {Object} Room
 * @property {string} [_id]
 * @property {string} title
 * @property {number} price
 * @property {number} maxPeople
 * @property {string} desc
 * @property {RoomNumber[]} roomNumbers
 * @property {boolean} isCleaned
 * @property {boolean} isAssigned
 * @property {string|null} bookedBy
 * @property {string} [hotelId]
 * @property {Hotel} [hotel]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Object} User
 * @property {string} [_id]
 * @property {string} username
 * @property {string} email
 * @property {string} country
 * @property {string} [img]
 * @property {string} city
 * @property {string} [phone]
 * @property {string} [password]
 * @property {boolean} isAdmin
 * @property {boolean} isModerator
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Object} Moderator
 * @property {string} [_id]
 * @property {string} userId
 * @property {string} hotelId
 * @property {boolean} isActive
 * @property {Object} permissions
 * @property {boolean} permissions.canManageWorkers
 * @property {boolean} permissions.canManageRooms
 * @property {boolean} permissions.canViewBookings
 * @property {string[]} [assignedHotels]
 * @property {User} [user]
 * @property {Hotel} [hotel]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Object} Worker
 * @property {string} [_id]
 * @property {string} name
 * @property {string} userId
 * @property {string} hotelId
 * @property {string} role
 * @property {string} email
 * @property {string} [phone]
 * @property {boolean} isActive
 * @property {Object[]} assignedRooms
 * @property {string} assignedRooms[].roomId
 * @property {User} [user]
 * @property {Hotel} [hotel]
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 */

/**
 * @typedef {Object} Booking
 * @property {string} [_id]
 * @property {string} userId
 * @property {string} hotelId
 * @property {string} roomId
 * @property {number} roomNumber
 * @property {Date} dateStart
 * @property {Date} dateEnd
 * @property {number} totalPrice
 * @property {'active'|'cancelled'|'completed'|'confirmed'} status
 * @property {Date} [createdAt]
 * @property {Date} [updatedAt]
 * @property {Object} [receipt]
 * @property {Date} receipt.issueDate
 * @property {string} receipt.receiptNumber
 * @property {Hotel} [hotel]
 * @property {Room} [room]
 * @property {User} [user]
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {boolean} loading
 * @property {string|null} error
 * @property {boolean} isAuthenticated
 */

/**
 * @typedef {Object} SearchCriteria
 * @property {string} city
 * @property {Date|null} checkIn
 * @property {Date|null} checkOut
 * @property {number} guests
 * @property {[number, number]} [priceRange]
 */

// Export the types through a dummy function
// JSDoc types are compiled away in production, so we just need this for development
export const dummyExportForTypes = () => {};

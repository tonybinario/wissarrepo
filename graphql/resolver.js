// Wir holen uns deine bestehenden, funktionierenden Repositories
const userRepository = require('../models/userrepo');
const householdRepository = require('../models/householdrepo');
const buildingRepository = require('../models/buildingrepo');

const resolvers = {
    Query: {
        users: async () => await userRepository.getAllUsers(),
        households: async () => await householdRepository.getAllHouseholds(),
        buildings: async () => await buildingRepository.getAllBuildings(),
        user: async (parent, args) => await userRepository.getUserById(args.id)
    },

    Building: {
        households: async (parent) => {
            // Ein Gebäude hat weiterhin mehrere Haushalte (Array)
            return await householdRepository.getHouseholdsByBuildingId(parent.id);
        }
    },

    Household: {
        // ANGEPASST: Gibt jetzt ein einzelnes User-Objekt zurück
        user: async (parent) => {
            return await userRepository.getUsersByHouseholdId(parent.id);
        }
    }
};

module.exports = resolvers;
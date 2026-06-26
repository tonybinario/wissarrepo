// Wir holen uns deine bestehenden, funktionierenden Repositories
const userRepository = require('../models/userrepo');
const householdRepository = require('../models/householdrepo');
const buildingRepository = require('../models/buildingrepo');

const resolvers = {
    Query: {
        users: async () => await userRepository.getAllUsers(),
        households: async () => await householdRepository.getAllHouseholds(),
        buildings: async () => await buildingRepository.getAllBuildings(),

        // REPARIERT FÜR SZENARIO 3: id in Integer umwandeln!
        user: async (parent, args) => {
            const userId = parseInt(args.id, 10);
            const userFromDb = await userRepository.getUserById(userId);

            // Diese drei Zeilen loggen die echten Daten im Server-Terminal:
            console.log("=== REALE DATEN AUS USER-REPOSITORY ===");
            console.log(userFromDb);
            console.log("========================================");

            return userFromDb;
        }
    },

    Building: {
        households: async (parent) => {
            // parent.id in Zahl umwandeln, falls es vom Treiber als String kommt
            const buildingId = parseInt(parent.id, 10);
            return await householdRepository.getHouseholdsByBuildingId(buildingId);
        }
    },

    Household: {
        user: async (parent) => {
            const householdId = parseInt(parent.id, 10);

            // WICHTIG FÜR SZENARIO 2:
            // Falls getUsersByHouseholdId ein ARRAY liefert, wir aber nur EIN Objekt
            // für das GraphQL-Schema brauchen, nehmen wir das erste Element [0]
            const result = await userRepository.getUsersByHouseholdId(householdId);
            return Array.isArray(result) ? result[0] : result;
        }
    }
};

module.exports = resolvers;
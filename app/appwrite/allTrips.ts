import { Query, TablesDB } from "appwrite";
import { appwriteConfig, client } from "./client";

const tablesDB = new TablesDB(client);
export const getAllTrips = async () => {
  try {
    const allTrips = await tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.tripsCollectionId,
      queries: [Query.orderDesc("$createdAt")],
    });
    if (allTrips.total === 0) {
      console.error("No Trips Found");
      return { allTrips: [], total: 0 };
    }
    return {
      allTrips: allTrips.rows,
      total: allTrips.total,
    };
  } catch (err) {
    console.log(err);
  }
};

export const getTripById = async (id: string) => {
  const trip = await tablesDB.getRow(
    appwriteConfig.databaseId,
    appwriteConfig.tripsCollectionId,
    id
  );
  if (!trip.$id) {
    console.log("trip not found");
    return null;
  }
  return trip;
};

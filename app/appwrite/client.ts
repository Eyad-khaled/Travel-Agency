import { Account, Client, Databases, Storage , Avatars } from 'appwrite';

export const appwriteConfig = {
 endpointurl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
 projectId: import.meta.env.VITE_APPWRITE_PROJECTKEY,
 apiKey: import.meta.env.VITE_APPWRITE_APIKEY,
 databaseId: import.meta.env.VITE_APPWRITE_DATABASEKEY,
 userCollectionId: import.meta.env.VITE_APPWRITE_USERS_TABLEID,
 tripsCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_TABLEID,
 
}
const client = new Client().setEndpoint(appwriteConfig.endpointurl).setProject(appwriteConfig.projectId);
const avatars = new Avatars(client)
const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage , avatars };
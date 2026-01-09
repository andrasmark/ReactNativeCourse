import { Place } from "../models/place";
import { openDatabaseAsync } from "./sqliteAsync";

export async function init() {
  const createTableSql = `CREATE TABLE IF NOT EXISTS places (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                imageUri TEXT NOT NULL,
                address TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL
            );`;

  try {
    const db = await openDatabaseAsync("places.db");

    if (db && typeof db.execAsync === "function") {
      await db.execAsync(createTableSql);
      return;
    }

    if (db && typeof db.transaction === "function") {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            createTableSql,
            [],
            () => resolve(),
            (_, error) => reject(error)
          );
        });
      });
    }

    throw new Error(
      "Opened database does not expose execAsync or transaction; cannot create table."
    );
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function insertPlace(place) {
  const db = await openDatabaseAsync("places.db");

  try {
    if (db && typeof db.runAsync === "function") {
      const result = await db.runAsync(
        `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
        [
          place.title,
          place.imageUri,
          place.address,
          place.location.lat,
          place.location.lng,
        ]
      );
      console.log("Insert place result:", result);
      return result;
    }

    if (db && typeof db.transaction === "function") {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
            [
              place.title,
              place.imageUri,
              place.address,
              place.location.lat,
              place.location.lng,
            ],
            (_, result) => {
              console.log("Insert place result:", result);
              resolve(result);
            },
            (_, error) => reject(error)
          );
        });
      });
    }

    throw new Error("Database does not expose runAsync or transaction method.");
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function fetchPlaces() {
  try {
    const db = await openDatabaseAsync("places.db");

    if (db && typeof db.getAllAsync === "function") {
      const rows = await db.getAllAsync("SELECT * FROM places", []);
      console.log("Fetch places result:", rows);
      const places = [];
      for (const dp of rows) {
        places.push(
          new Place(
            dp.title,
            dp.imageUri,
            { address: dp.address, lat: dp.lat, lng: dp.lng },
            dp.id
          )
        );
      }
      return places;
    }

    if (db && typeof db.transaction === "function") {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM places",
            [],
            (_, result) => {
              console.log("Fetch places result:", result);
              const places = [];
              for (const dp of result.rows._array) {
                places.push(
                  new Place(
                    dp.title,
                    dp.imageUri,
                    { address: dp.address, lat: dp.lat, lng: dp.lng },
                    dp.id
                  )
                );
              }
              resolve(places);
            },
            (_, error) => {
              reject(error);
            }
          );
        });
      });
    }

    throw new Error(
      "Database does not expose getAllAsync or transaction method."
    );
  } catch (err) {
    console.error("Error fetching places:", err);
    return Promise.reject(err);
  }
}

export async function fetchPlaceDetails(id) {
  try {
    const db = await openDatabaseAsync("places.db");

    if (db && typeof db.getFirstAsync === "function") {
      const dbPlace = await db.getFirstAsync(
        "SELECT * FROM places WHERE id = ?",
        [id]
      );
      console.log("Fetch place details result:", dbPlace);
      if (!dbPlace) return null;
      
      const place = new Place(
        dbPlace.title,
        dbPlace.imageUri,
        {
          address: dbPlace.address,
          lat: dbPlace.lat,
          lng: dbPlace.lng,
        },
        dbPlace.id
      );
      return place;
    }

    if (db && typeof db.transaction === "function") {
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM places WHERE id = ?",
            [id],
            (_, result) => {
              console.log("Fetch place details result:", result);
              const dbPlace = result.rows._array[0];
              if (!dbPlace) {
                resolve(null);
                return;
              }
              const place = new Place(
                dbPlace.title,
                dbPlace.imageUri,
                {
                  address: dbPlace.address,
                  lat: dbPlace.lat,
                  lng: dbPlace.lng,
                },
                dbPlace.id
              );
              resolve(place);
            },
            (_, error) => {
              reject(error);
            }
          );
        });
      });
    }

    throw new Error(
      "Database does not expose getFirstAsync or transaction method."
    );
  } catch (err) {
    console.error("Error fetching place details:", err);
    return Promise.reject(err);
  }
}
// export function init() {
//   const promise = database.execAsync(
//     `CREATE TABLE IF NOT EXISTS places (
//                  id INTEGER PRIMARY KEY NOT NULL,
//                  title TEXT NOT NULL,
//                  imageUri TEXT NOT NULL,
//                  address TEXT NOT NULL,
//                  lat REAL NOT NULL,
//                  lng REAL NOT NULL
//              );`
//   );

//   return promise;
// }

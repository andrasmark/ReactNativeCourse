import * as SQLite from 'expo-sqlite';

// Provides a promise-based `openDatabaseAsync()` compatible API.
// If the native async API (openDatabaseAsync) exists, delegate to it.
// Otherwise, provide a JS shim that wraps the classic callback-based API.

export async function openDatabaseAsync(name = 'database') {
  // Native async API available
  if (SQLite && typeof SQLite.openDatabaseAsync === 'function') {
    return SQLite.openDatabaseAsync(name);
  }

  // Fallback shim using classic API
  const db = SQLite.openDatabase(name);

  function _executeSqlAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            sql,
            params,
            (_, result) => resolve(result),
            (_, error) => reject(error)
          );
        },
        (txError) => reject(txError)
      );
    });
  }

  async function execAsync(sql) {
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      // ignore empty statements
      await _executeSqlAsync(stmt);
    }
  }

  async function runAsync(sql, params = []) {
    const res = await _executeSqlAsync(sql, params);
    return { lastInsertRowId: res.insertId, changes: res.rowsAffected };
  }

  async function getAllAsync(sql, params = []) {
    const res = await _executeSqlAsync(sql, params);
    return res.rows && res.rows._array ? res.rows._array : [];
  }

  return {
    execAsync,
    runAsync,
    getAllAsync,
  };
}

/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Foundation Module: FM-006
 * Component: CMPStorage
 * Version: 1.0.0
 * =====================================================
 */

export class CMPStorage {

  static save(key, data) {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

  }

  static load(key) {

    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : null;

  }

  static remove(key) {

    localStorage.removeItem(key);

  }

}
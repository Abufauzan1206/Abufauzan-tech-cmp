/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Foundation Module: FM-008
 * Component: CMPAuth
 * Version: 1.0.0
 * =====================================================
 */

import { auth } from "../firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

export class CMPAuth {
  
  static role = null;
  
  static permissions = [];

  static currentUser() {

    return auth.currentUser;

  }
  
  static onChange(callback) {

  return onAuthStateChanged(

    auth,

    callback

  );

}

static setRole(role) {

  this.role = role;

}

static setPermissions(permissions) {

  this.permissions = Array.isArray(permissions)
    ? permissions
    : [];

}

static getRole() {

  return this.role;

}

static hasPermission(permission) {

  return Array.isArray(this.permissions) &&

    this.permissions.includes(permission);

}

static async logout() {

  await signOut(auth);

}

static requireLogin(loginPage = "../login.html") {

  if (!this.currentUser()) {

    window.location.href = loginPage;

  }

}

static hasRole(role) {

  return this.role === role;

}

static isSuperAdmin() {

  return this.hasRole("super_admin");

}

static isCooperativeAdmin() {

  return this.hasRole("cooperative_admin");

}

static isMember() {

  return this.hasRole("member");

}

}
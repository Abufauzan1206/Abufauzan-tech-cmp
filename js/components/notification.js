/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Foundation Module: FM-009
 * Component: CMPNotification
 * Version: 1.0.0
 * =====================================================
 */
 
 import { CMPStorage } from "./storage.js";

export class CMPNotification {

  static notifications = [];
  
  static create({

  title,

  message,

  type = "info",

  read = false,

  createdAt = new Date()

}) {

  return {

    id: crypto.randomUUID(),

    title,

    message,

    type,

    read,

    createdAt

  };

}

static add(notification) {

  this.notifications.unshift(notification);

  CMPStorage.save(

    "notifications",

    this.notifications

  );

}

static getAll() {

  return [...this.notifications];

}

static remove(id) {

  this.notifications = this.notifications.filter(

    notification => notification.id !== id

  );

  CMPStorage.save(

    "notifications",

    this.notifications

  );

}

static markAsRead(id) {

  const notification = this.notifications.find(

    notification => notification.id === id

  );

  if (notification) {

  notification.read = true;

  CMPStorage.save(

    "notifications",

    this.notifications

  );

}

}

static getUnreadCount() {

  return this.notifications.filter(

    notification => !notification.read

  ).length;

}

static load() {

  this.notifications = Array.isArray(

    CMPStorage.load(

      "notifications",

      []

    )

  )

    ? CMPStorage.load(

        "notifications",

        []

      )

    : [];

}


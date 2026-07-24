/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Foundation Module: FM-005
 * Component: CMPModal
 * Version: 1.0.0
 * =====================================================
 */

export class CMPModal {

  static confirm(message) {

    return confirm(message);

  }

  static alert(message) {

    alert(message);

  }

  static success(message) {

    alert("✅ " + message);

  }

  static error(message) {

    alert("❌ " + message);

  }

}
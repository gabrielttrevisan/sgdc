import { RoleModel } from "../models/Role.model.js";

export class AuthSingleton {
  /** @type {PermissionModel|null} */
  static #instance = null;

  /** @type {AuthSingleton} */
  static get instance() {
    if (!AuthSingleton.#instance)
      return (AuthSingleton.#instance = new AuthSingleton());

    return AuthSingleton.#instance;
  }

  /** @type {Map<number, Map<string, Set<string>>>} */
  #roles = new Map();
  #updating = false;

  /**
   * @param {number} roleId
   * @param {Record<string, string[]>} permissions
   */
  #setRole(roleId, permissions) {
    /** @type {[string, Set<string>]} */
    const permissionEntries = Object.entries(permissions).map(
      ([key, actions]) => [key, new Set(actions)],
    );

    this.#roles.set(roleId, new Map(permissionEntries));
  }

  /**
   * @param {number} roleId
   * @param {string} key
   * @param {string} action
   * @returns {Promise<boolean>}
   */
  async can(roleId, key, action) {
    if (this.#updating) return false;

    if (this.#roles.size === 0) {
      const updated = await this.#update();

      if (!updated) return false;
    }

    const rolePermissions = this.#roles.get(roleId);

    if (!rolePermissions) return false;

    const permission = rolePermissions.get(key);

    if (!permission) return false;

    return permission.has(action);
  }

  async rolesUpdated() {
    this.#roles = new Map();
    await this.#update();
  }

  async #update() {
    this.#updating = true;

    const [roles, error] = await RoleModel.findAllWithPermissions();

    if (error) {
      this.#updating = false;
      return false;
    }

    for (const role of roles) {
      this.#setRole(role.id, role.permissions);
    }

    this.#updating = true;

    return true;
  }
}

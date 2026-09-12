export class PermissionHelper {
  /** @type {Record<string, Set>} */
  #permissions = null;

  constructor(permissions) {
    this.#permissions = Object.fromEntries(
      Object.entries(permissions).map(([category, actions]) => [
        category,
        new Set(actions),
      ]),
    );
  }

  can(category, action) {
    return (
      this.#permissions[category] && this.#permissions[category].has(action)
    );
  }

  checkCategory(category) {
    return (this.#permissions[category]?.size ?? 0) > 0;
  }

  arrayBuilder() {
    const array = [];
    const permissions = this;
    const builder = {
      pushUnsafe(...value) {
        array.push(...value);
        return builder;
      },
      push(value, category, action) {
        if (permissions.can(category, action)) array.push(value);

        return builder;
      },
      pushByCategory(value, category) {
        if (permissions.checkCategory(category)) array.push(value);

        return builder;
      },
      pushByCategories(value, ...categories) {
        if (categories.every((category) => permissions.checkCategory(category)))
          array.push(value);

        return builder;
      },
      getArray() {
        return array;
      },
    };

    return builder;
  }
}

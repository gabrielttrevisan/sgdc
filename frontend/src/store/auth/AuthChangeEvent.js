export class AuthChangeEvent extends CustomEvent {
  static get EVENT_TYPE() {
    return "auth:change";
  }

  #isSignedIn;

  constructor(isSignedIn, menu) {
    super(
      AuthChangeEvent.EVENT_TYPE,
      menu && isSignedIn ? { detail: { menu } } : undefined,
    );
  }

  get isSignedIn() {
    return this.#isSignedIn;
  }
}

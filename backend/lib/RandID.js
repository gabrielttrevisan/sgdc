const BASE = "5jC1PaVNmDEcsFd2BGr4WgZi6wq8KkLAueRnvMtJ0x7hXbOQyplzSTU9oHI3fY";

export class RandID extends String {
  constructor(length = 8) {
    const array = new Uint8ClampedArray(length);

    crypto.getRandomValues(array);

    const indexes = Array.from(array).map((number) => number % BASE.length);
    const id = indexes.map((index) => BASE[index]).join("");

    super(id);
  }
}

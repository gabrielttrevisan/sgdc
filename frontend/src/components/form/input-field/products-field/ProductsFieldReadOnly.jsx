import { useImperativeHandle, useState } from "react";

import "./ProductsField.css";

/**
 * @typedef {Object} ProductsFieldRef
 * @prop {(products: any[]) => void} fill
 */

/**
 * @typedef {Object} ProductsFieldProps
 * @prop {import("react").Ref<ProductsFieldRef>} [ref]
 * @prop {import("react").ComponentType} [ExtraFields]
 */

/**
 * @param {ProductsFieldProps} props
 */
export default function ProductsFieldReadOnly({ ref, ExtraFields }) {
  const [products, setProducts] = useState([]);

  useImperativeHandle(
    ref,
    () => ({
      fill(items) {
        setProducts(items);
      },
    }),
    [],
  );

  return (
    <div className="products-field products-field--readonly">
      <div className="products-field__list">
        {products.length ? (
          products.map((item) => (
            <div className="products-field__list-item" key={item.id}>
              <div>{item.name}</div>

              <div className="products-field__list-item-left">
                {ExtraFields && <ExtraFields {...item} />}
              </div>
            </div>
          ))
        ) : (
          <>Nenhum produto selecionado</>
        )}
      </div>
    </div>
  );
}

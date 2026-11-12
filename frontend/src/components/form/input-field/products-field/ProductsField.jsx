import { useImperativeHandle } from "react";
import { AddLargeIcon } from "../../../../components/icons/AddLargeIcon";
import { useListStorage } from "../../../../store/list/useListStorage";
import { LargeCloseIcon } from "../../../../components/icons/LargeCloseIcon";

import "./ProductsField.css";

/**
 * @typedef {Object} ProductsFieldRef
 * @prop {any[]} products
 */

/**
 * @typedef {Object} ProductsFieldProps
 * @prop {import("react").Ref<ProductsFieldRef>} [ref]
 * @prop {VoidFunction} [onAddProduct]
 * @prop {string} [listId]
 * @prop {import("react").ReactNode} [label]
 * @prop {import("react").ReactNode} [buttonLabel]
 * @prop {import("react").ComponentType} [ExtraFields]
 * @prop {import("react").ComponentType} [ProductLabel]
 */

/**
 * @param {ProductsFieldProps} props
 */
export default function ProductsField({
  ref,
  label = "Produtos",
  buttonLabel = "Adicionar Produtos",
  listId,
  ExtraFields,
  onAddProduct,
  ProductLabel,
}) {
  const { items, remove } = useListStorage(listId);

  useImperativeHandle(
    ref,
    () => ({
      get products() {
        return items;
      },
    }),
    [items],
  );

  return (
    <div className="products-field">
      <header>
        <label className="input-field pill pill--purple-label pill--small">
          {label}
        </label>

        <button
          type="button"
          className="button-block --solid --primary"
          onClick={onAddProduct}
        >
          <AddLargeIcon />
          <span>{buttonLabel}</span>
        </button>
      </header>

      <div className="products-field__list">
        {items.length ? (
          items.map((item) => (
            <div className="products-field__list-item" key={item.id}>
              {ProductLabel ? (
                <ProductLabel {...item} />
              ) : (
                <div>{item.name}</div>
              )}

              <div className="products-field__list-item-left">
                {ExtraFields && <ExtraFields {...item} />}

                <button
                  type="button"
                  className="button-block --danger"
                  onClick={() => remove(item.id)}
                >
                  <LargeCloseIcon />
                </button>
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

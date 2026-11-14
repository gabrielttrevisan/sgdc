import { useImperativeHandle } from "react";
import { AddLargeIcon } from "../icons/AddLargeIcon";
import { useListStorage } from "../../store/list/useListStorage";
import { LargeCloseIcon } from "../icons/LargeCloseIcon";

import "./ListField.css";

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
 * @prop {"normal"|"combined"} [variant]
 * @prop {string} [noItemSelectedMessage]
 */

/**
 * @param {ProductsFieldProps} props
 */
export default function ListField({
  ref,
  listId,
  ExtraFields,
  onAddProduct,
  ProductLabel,
  variant = "normal",
  buttonLabel,
  label,
  noItemSelectedMessage = "Nenhum item selecionado",
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

  const isNormal = variant === "normal";

  return (
    <div className={`list-field list-field--${variant}`}>
      <header>
        {isNormal && (
          <label className="input-field pill pill--purple-label pill--small">
            {label}
          </label>
        )}

        <button
          type="button"
          className="list-field__add-button button-block --solid --primary"
          onClick={onAddProduct}
        >
          <AddLargeIcon />
          <span>{buttonLabel}</span>
        </button>
      </header>

      <div className="list-field__list">
        {items.length ? (
          items.map((item) => (
            <div className="list-field__list-item" key={item.id}>
              {ProductLabel ? (
                <ProductLabel {...item} />
              ) : (
                <div>{item.name}</div>
              )}

              <div className="list-field__list-item-left">
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
          <>{noItemSelectedMessage}</>
        )}
      </div>
    </div>
  );
}

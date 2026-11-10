import { useImperativeHandle, useState } from "react";
import { AddLargeIcon } from "../../../components/icons/AddLargeIcon";
import { useNavigate } from "react-router";
import { useListStorage } from "../../../store/list/useListStorage";
import getSafeListId from "../../../store/list/getSafeListId";
import { LargeCloseIcon } from "../../../components/icons/LargeCloseIcon";

/**
 * @typedef {Object} ProductsFieldRef
 * @prop {any[]} products
 */

/**
 * @typedef {Object} ProductsFieldProps
 * @prop {import("react").Ref<ProductsFieldRef>} [ref]
 * @prop {string} [listPreffix]
 * @prop {string} [listId]
 * @prop {import("react").ReactNode} [label]
 * @prop {import("react").ReactNode} [buttonLabel]
 */

/**
 * @param {ProductsFieldProps} props
 */
export default function ProductsField({
  ref,
  listPreffix = "products-to-donate",
  label = "Produtos",
  buttonLabel = "Adicionar Produtos",
  listId,
}) {
  const [currentListId] = useState(
    listId ? getSafeListId(listId) : `${listPreffix}:${crypto.randomUUID()}`,
  );
  const { items, remove } = useListStorage(listId);
  const navigate = useNavigate();

  useImperativeHandle(
    ref,
    () => ({
      get products() {
        return items;
      },
    }),
    [items],
  );

  const onAddProduct = () =>
    navigate("/produtos/selecionar", {
      state: {
        from: location.pathname + location.search,
        listId: currentListId,
      },
    });

  return (
    <div className="donated-products-field">
      <header>
        <label className="input-field">{label}</label>

        <button className="button button--solid" onClick={onAddProduct}>
          <AddLargeIcon />
          <span>{buttonLabel}</span>
        </button>
      </header>

      {items.length &&
        items.map(({ id, name }) => (
          <div key={id}>
            <div>{name}</div>

            <button type="button" onClick={() => remove(id)}>
              <LargeCloseIcon />
            </button>
          </div>
        ))}
    </div>
  );
}

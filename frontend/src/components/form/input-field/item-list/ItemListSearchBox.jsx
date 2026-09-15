import { useImperativeHandle, useRef, useState } from "react";
import { VisuallyHidden } from "../../../accessibility/visually-hidden/VisuallyHidden";
import Toast from "../../../toast/ToastStorage";
import { SearchIcon } from "../../../icons/SearchIcon";

import "./ItemListSearchBox.css";

/** @type {import("../../../../global").PageData<any>} */
const LIST_DEFAULT = {
  items: [],
  totalRecords: 0,
  page: 1,
  totalPages: 0,
  query: undefined,
};

/**
 * @template T
 * @param {ItemListSearchBoxProps<T>} props
 * @returns {import("react").JSX.Element}
 */
export function ItemListSearchBox({ searchService, onSelect, label, ref }) {
  const [state, setState] = useState({
    loading: false,
    list: LIST_DEFAULT,
    open: false,
  });
  /** @type {import("react").Ref<HTMLInputElement>} */
  const inputRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        setState({
          loading: false,
          list: LIST_DEFAULT,
          open: false,
        });
      },
    }),
    [],
  );

  return (
    <div className="checkbox-list-search-box">
      <div hidden={!state.open} className="checkbox-list-search-box__form">
        <input
          type="text"
          ref={inputRef}
          className="checkbox-list-search-box__input"
        />

        <div className="checkbox-list-search-box__result">
          {state.list.query ? (
            state.list.items.length === 0 ? (
              <strong>Nenhum resultado encontrado</strong>
            ) : (
              <>
                {state.list.items.map((item) => (
                  <button
                    type="button"
                    onClick={() => {
                      setState((prev) => ({
                        ...prev,
                        open: false,
                        list: LIST_DEFAULT,
                      }));
                      if (inputRef.current) inputRef.current.value = "";
                      onSelect(item);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </>
            )
          ) : null}
        </div>
      </div>

      <button
        type="button"
        className="checkbox-list-search-box__button"
        onClick={async () => {
          if (state.open) {
            if (!inputRef.current) {
              Toast.error(
                <>
                  <strong>Erro de Interface</strong>
                  <br />
                  <span>
                    Referência do <em>input</em> de busca não instanciada
                  </span>
                </>,
              );
              return;
            }

            const value = inputRef.current.value.trim();

            if (value.length < 3) {
              Toast.warn(
                <>
                  <strong>Atenção</strong>
                  <br />
                  <span>
                    Informe pelo menos 3 caracteres para realizar a busca
                  </span>
                </>,
              );
              return;
            }

            setState((prev) => ({ ...prev, loading: true }));

            const { data, error } = await searchService.list({
              query: value,
            });

            if (error) {
              Toast.error(
                <>
                  <strong>Erro ao buscar</strong>
                  <br />
                  <span>error.message</span>
                </>,
              );

              setState((prev) => ({ ...prev, loading: false }));
            } else {
              setState((prev) => ({ ...prev, list: data, loading: false }));
            }
          } else {
            setState((prev) => ({ ...prev, open: true }));
          }
        }}
      >
        <SearchIcon size={16} />
        <VisuallyHidden>Buscar {label.toLocaleLowerCase()}</VisuallyHidden>
      </button>
    </div>
  );
}

/**
 * @template T
 * @typedef {Object} ItemListSearchBoxProps
 * @prop {string} label
 * @prop {import("../../../../global").PaginatableService<T>} searchService
 * @prop {(item: T) => void} onSelect
 * @prop {VoidFunction} [onOpen]
 * @prop {VoidFunction} [onClose]
 */

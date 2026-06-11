import { ItemListSearchBox } from "./ItemListSearchBox";
import { useState, useRef, useEffect, useImperativeHandle } from "react";
import { useFormController } from "../../context/useFormController";
import { ErrorMessage } from "../../error-message/ErrorMessage";

import "./ItemListField.css";

/**
 * @template T
 * @param {ItemListFieldProps<T>} props
 * @returns
 */
export function ItemListField({
  name,
  required = false,
  label = "Items",
  searchService,
  Checkbox,
  parse,
  validate,
  ref,
  showSearch = true,
}) {
  const [state, setState] = useState({
    items: new Map(),
    disabled: false,
    changes: 0,
  });
  const controller = useFormController();
  const onInputRef = useRef(null);
  const searchRef = useRef(null);

  const fieldController = {
    clear() {
      setState((prev) => {
        return { ...prev, items: new Map(), changes: 0 };
      });
    },
    disable() {
      setState((prev) => {
        return { ...prev, disabled: true };
      });
    },
    enable() {
      setState((prev) => {
        return { ...prev, disabled: false };
      });
    },
    getFormData() {
      return Array.from(state.items.values());
    },
    onInput(callback) {
      onInputRef.current = callback;
    },
    setValidity(value) {},
    get value() {
      return Array.from(state.items.values());
    },
    set value(value) {
      if (Array.isArray(value)) {
        setState((prev) => {
          const newItems = new Map();

          value.forEach((v) => {
            const parsed = parse(v);

            newItems.set(parsed.key, parsed);
          });

          return { ...prev, items: newItems, changes: prev.changes + 1 };
        });
      }
    },
    fill(_mask, items) {
      if (Array.isArray(items)) {
        setState((prev) => {
          const newItems = new Map();

          for (const item of items) {
            const parsed = parse(item);
            newItems.set(parsed.key, parsed);
          }

          return { ...prev, items: newItems, changes: prev.changes + 1 };
        });
      }
    },
  };

  useEffect(() => {
    controller.registerField(
      name,
      {
        required,
        validate,
      },
      fieldController,
    );
  }, [controller, name, required, fieldController, validate]);

  useEffect(() => {
    if (onInputRef.current && state.changes > 1) onInputRef.current();
  }, [state]);

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        searchRef.current?.reset();
      },
    }),
    [searchRef],
  );

  return (
    <section className="checkbox-list-field input-field">
      <div className="checkbox-list-field__header">
        <h3>
          {label}
          {required ? (
            <span className="input-field__required">&nbsp;*</span>
          ) : null}
        </h3>

        {showSearch && (
          <ItemListSearchBox
            label={label}
            searchService={searchService}
            ref={searchRef}
            onSelect={(item) =>
              setState((prev) => {
                const parsed = parse(item);
                const { key } = parsed;

                if (prev.items.has(key)) {
                  return prev;
                }

                return {
                  ...prev,
                  items: new Map([...prev.items.entries(), [key, parsed]]),
                  changes: prev.changes + 1,
                };
              })
            }
          />
        )}
      </div>

      <div>
        {Array.from(state.items.values()).map((item) => {
          return (
            <Checkbox
              {...item}
              key={item.key}
              id={item.key}
              disabled={state.disabled}
              onRemove={() =>
                setState((prev) => {
                  prev.items.delete(item.key);

                  return {
                    ...prev,
                    items: new Map(prev.items.entries()),
                    changes: prev.changes + 1,
                  };
                })
              }
              onChange={(item) => {
                setState((prev) => {
                  if (!prev.items.has(item.key)) return prev;

                  prev.items.set(item.key, item);

                  return {
                    ...prev,
                    items: new Map(prev.items.entries()),
                    changes: prev.changes + 1,
                  };
                });
              }}
            />
          );
        })}
      </div>

      <ErrorMessage name={name} />
    </section>
  );
}

/**
 * @template T,U
 * @typedef {Object} ItemListFieldProps
 * @prop {string} name
 * @prop {boolean} [required]
 * @prop {string} [label]
 * @prop {import("../../../../global").PaginatableService<T>} searchService
 * @prop {string|(item: T) => U} parse
 * @prop {import("react").ElementType<ItemFieldProps<U>>} Checkbox
 * @prop {import("react").Ref<ItemListFieldRef>} [ref]
 * @prop {boolean} [showSearch]
 */

/**
 * @template T
 * @typedef {T} ItemFieldProps
 * @prop {(item: T) => void} onChange
 * @prop {VoidFunction} onRemove
 */

/**
 * @typedef {Object} ItemListFieldRef
 * @prop {VoidFunction} reset
 */

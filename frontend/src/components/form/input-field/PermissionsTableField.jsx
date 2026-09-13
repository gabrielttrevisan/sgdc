import { useRef, useState } from "react";
import { useRegisterField } from "../context/useRegisterField";
import { ErrorMessage } from "../error-message/ErrorMessage";
import Toast from "../../toast/ToastStorage";
import { VisuallyHidden } from "../../accessibility/visually-hidden/VisuallyHidden";

import "./PermissionsTableField.css";
import { AddLargeIcon } from "../../icons/AddLargeIcon";
import { CloseIconLarge } from "../../icons/CloseIconLarge";
import { useFormController } from "../context/useFormController";

/**
 * @typedef {Object} PermissionGroupAction
 * @prop {string} value
 * @prop {string} label
 */

/**
 * @typedef {Object} PermissionGroup
 * @prop {string} resource
 * @prop {string} label
 * @prop {PermissionGroupAction[]} actions
 * @prop {PermissionGroupAction[]} [minActions]
 */

/** @type {Record<string, PermissionGroupAction>} */
const PermissionGroupAction = {
  CREATE: { value: "create", label: "Cadastrar" },
  EDIT: { value: "edit", label: "Editar" },
  DELETE: { value: "delete", label: "Excluir" },
  VIEW: { value: "view", label: "Visualizar" },
  LIST: { value: "list", label: "Listar" },
  RESET: { value: "reset", label: "Redefinir" },
  RESTORE: { value: "restore", label: "Restaurar" },
  PAY: { value: "pay", label: "Pagar" },
};

/** @type {PermissionGroupAction[]} */
const MIN_PERMISSIONS = [
  PermissionGroupAction.VIEW,
  PermissionGroupAction.LIST,
];

/** @type {PermissionGroupAction[]} */
const COMMON_RESOURCE_ACTIONS = [
  PermissionGroupAction.CREATE,
  PermissionGroupAction.EDIT,
  PermissionGroupAction.DELETE,
];

/** @type {PermissionGroup[]} */
const PERMISSION_GROUPS = [
  {
    resource: "beneficiary",
    label: "Beneficiários",
    actions: COMMON_RESOURCE_ACTIONS,
  },
  {
    resource: "family",
    label: "Famílias",
    actions: COMMON_RESOURCE_ACTIONS,
  },
  {
    resource: "measuring_unit",
    label: "Unidades de medida",
    actions: COMMON_RESOURCE_ACTIONS,
  },
  {
    resource: "allocation_type",
    label: "Tipos de alocação",
    actions: COMMON_RESOURCE_ACTIONS,
  },
  {
    resource: "city",
    label: "Cidades",
    actions: COMMON_RESOURCE_ACTIONS,
  },
  {
    resource: "donor",
    label: "Doadores",
    actions: COMMON_RESOURCE_ACTIONS,
  },
  { resource: "product", label: "Produtos", actions: COMMON_RESOURCE_ACTIONS },
  { resource: "sala", label: "Salas", actions: COMMON_RESOURCE_ACTIONS },
  {
    resource: "volunteer",
    label: "Voluntários",
    actions: COMMON_RESOURCE_ACTIONS,
  },
  {
    resource: "user",
    label: "Usuários",
    actions: [
      ...COMMON_RESOURCE_ACTIONS,
      PermissionGroupAction.RESTORE,
      PermissionGroupAction.RESET,
    ],
  },
  {
    resource: "role",
    label: "Níveis de acesso",
    actions: [
      PermissionGroupAction.CREATE,
      PermissionGroupAction.EDIT,
      PermissionGroupAction.VIEW,
      PermissionGroupAction.LIST,
    ],
  },
  {
    resource: "bill",
    label: "Contas a Pagar",
    actions: [
      PermissionGroupAction.CREATE,
      PermissionGroupAction.EDIT,
      PermissionGroupAction.VIEW,
      PermissionGroupAction.LIST,
      PermissionGroupAction.PAY,
    ],
  },
  {
    resource: "dashboard",
    label: "Painel/Dashboard",
    actions: [PermissionGroupAction.VIEW],
    minActions: [],
  },
];

function parsePermissions(value) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

/**
 * @typedef {Object} SelectedPermission
 * @
 */

/**
 * @typedef {Object} PermissionsTableState
 * @prop {Record<string, { selected: PermissionGroupAction[]; available:PermissionGroupAction[] }>} permissions
 * @prop {PermissionGroup[]} availablePermissions
 */

export function PermissionsTableField({
  name = "permissions",
  required = true,
}) {
  const [state, setState] = useState({
    availablePermissions: PERMISSION_GROUPS,
    permissions: {},
  });
  const availablePermissionsRef = useRef(null);
  const controller = useFormController();

  /**
   * @param {PermissionsTableState} value
   * @returns {void}
   */
  const updateDataAttribute = (value) => {
    const field = controller.getFieldRef(name);

    if (!field?.element) {
      Toast.error("Não foi possível atualizar o valor das permissões");
      return;
    }

    field.element.dataset.value = JSON.stringify(
      Object.fromEntries(
        Object.entries(value.permissions).map(([resource, value]) => [
          resource,
          value.selected.map((action) => action.value),
        ]),
      ),
    );
  };

  const handleAppendCurrentPermission = () => {
    if (!availablePermissionsRef.current?.value) {
      Toast.error("Permissão inválida ou não encontrada");
      return;
    }

    const resource = availablePermissionsRef.current.value;
    const permission = state.availablePermissions.find(
      (perm) => perm.resource === resource,
    );

    if (!permission) {
      Toast.error("Permissão inválida ou não encontrada");
      return;
    }

    setState((prev) => {
      const newState = {
        ...prev,
        permissions: {
          ...prev.permissions,
          [resource]: prev.permissions[resource] ?? {
            selected: [...(permission.minActions ?? MIN_PERMISSIONS)],
            available: permission.actions,
            label: permission.label,
          },
        },
        availablePermissions: prev.availablePermissions.filter(
          (perm) => perm.resource !== resource,
        ),
      };

      updateDataAttribute(newState);

      return newState;
    });
  };

  const handleRemovePermissionFrom = (resource) => {
    setState((prev) => {
      const { [resource]: _, ...newPermissions } = prev.permissions;
      const restoredPermission = PERMISSION_GROUPS.find(
        (perm) => perm.resource === resource,
      );
      const newState = {
        ...prev,
        permissions: structuredClone(newPermissions),
        availablePermissions: [
          ...prev.availablePermissions,
          restoredPermission,
        ],
      };

      updateDataAttribute(newState);

      return newState;
    });
  };

  const handleSelectAction = (event, resource) => {
    setState((prev) => {
      const selectedActionValue = event.target.value;
      const selectedAction = prev.permissions[resource].available.find(
        (action) => action.value === selectedActionValue,
      );

      if (!selectedAction) {
        Toast.error("Ação inválida ou não encontrada");
        return prev;
      }

      const permissions = prev.permissions[resource];
      const newPermission = {
        ...permissions,
        selected: [...permissions.selected, selectedAction],
        available: permissions.available.filter(
          (action) => action.value !== selectedActionValue,
        ),
      };
      const newState = {
        ...prev,
        permissions: {
          ...prev.permissions,
          [resource]: newPermission,
        },
      };

      updateDataAttribute(newState);

      return newState;
    });
  };

  const handleDeselectAction = (target, resource) => {
    setState((prev) => {
      const targetResource = prev.permissions[resource];

      if (!targetResource) {
        Toast.error("Permissão inválida ou não encontrada");
        return prev;
      }

      const targetAction = targetResource.selected.find(
        (action) => action.value === target,
      );

      if (!targetAction) {
        Toast.error("Ação inválida ou não encontrada");
        return prev;
      }

      const newSelectedActions = targetResource.selected.filter(
        (action) => action.value !== target,
      );
      const newResource = {
        ...targetResource,
        selected: newSelectedActions,
        available: [...targetResource.available, targetAction],
      };
      const newState = {
        ...prev,
        permissions: {
          ...prev.permissions,
          [resource]: newResource,
        },
      };

      updateDataAttribute(newState);

      return newState;
    });
  };

  return (
    <div
      className="permissions-field input-field"
      data-field-type="permissions"
      data-value="{}"
      {...useRegisterField(name, {
        required,
        validate: (value) =>
          Object.keys(parsePermissions(value)).length > 0
            ? true
            : "Selecione ao menos uma permissão",
      })}
    >
      <div className="permissions-field__header">
        <label
          htmlFor="available-permissions"
          className="pill pill--purple-label"
        >
          Permissões
        </label>

        <div
          className="available-permissions__field"
          hidden={state.availablePermissions.length === 0}
        >
          <select
            id="available-permissions"
            className="available-permissions"
            name="available-permissions"
            ref={availablePermissionsRef}
          >
            {state.availablePermissions.map(({ resource, label }) => (
              <option value={resource} key={resource}>
                {label}
              </option>
            ))}
          </select>

          <button type="button" onClick={handleAppendCurrentPermission}>
            <VisuallyHidden>Adicionar permissão</VisuallyHidden>
            <AddLargeIcon size="12px" />
          </button>
        </div>
      </div>

      <div className="permissions-field__table">
        {Object.entries(state.permissions).map(
          ([resource, { label, available, selected }]) => (
            <div className="permissions-field__row" key={resource}>
              <label htmlFor={`${name}-${resource}`} className="permissions-field__row-left">{label}</label>

              <div className="permissions-field__row-right">
                <div className="permissions-field__row-right-selected">
                  {selected.map(({ value, label }) => (
                    <div
                      className="permissions-field__row-right-selected-item"
                      key={value}
                    >
                      <span>{label}</span>

                      <button
                        type="button"
                        onClick={() => handleDeselectAction(value, resource)}
                      >
                        <VisuallyHidden>
                          Remover ação da permissão
                        </VisuallyHidden>
                        <CloseIconLarge size="10px" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="permissions-field__row-right-actions">
                  <select
                    id={`${name}-${resource}`}
                    onChange={(e) => handleSelectAction(e, resource)}
                    hidden={available.length === 0}
                  >
                    <option value="">Adicionar uma Ação</option>

                    {available.map(({ label, value }) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemovePermissionFrom(resource)}
                  >
                    <VisuallyHidden>Remover permissão</VisuallyHidden>
                    <CloseIconLarge size="14px" />
                  </button>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      <ErrorMessage name={name} />
    </div>
  );
}

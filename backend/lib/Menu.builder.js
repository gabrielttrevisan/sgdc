import { RandID } from "./RandID.js";
import { PermissionHelper } from "./Permission.helper.js";

export class MenuBuilder {
  #menu = [];

  constructor(menu) {
    this.#menu = menu;
  }

  getMenu() {
    return this.#menu;
  }

  /** @param {PermissionHelper} permissions */
  static fromPermissions(permissions, userId) {
    const permissionsService = new PermissionHelper(permissions);
    const menuStructure = permissionsService.arrayBuilder();

    menuStructure
      .pushUnsafe({
        id: new RandID(),
        icon: "dashboard",
        title: "Dashboard",
        path: "/",
      })
      .pushByCategories(
        {
          id: new RandID(),
          title: "Donativos",
          icon: "box",
          subItems: permissionsService
            .arrayBuilder()
            .pushUnsafe(
              { id: new RandID(), title: "Donativos", path: "/donativos" },
              {
                id: new RandID(),
                title: "Arrecadações",
                path: "/arrecadacoes",
              },
              { id: new RandID(), title: "Doações", path: "/doacoes" },
              { id: new RandID(), title: "Descartes", path: "/descartes" },
              {
                id: new RandID(),
                title: "Locais de Armazenamento",
                path: "/locais-de-armazenamento",
              },
              { id: new RandID(), title: "Produtos", path: "/produtos" },
              { id: new RandID(), title: "Metas", path: "/metas" },
              {
                id: new RandID(),
                title: "Unidades de Medida",
                path: "/unidades-de-medida",
              },
            )
            .getArray(),
        },
        "measuring_unit",
        "allocation_type",
        "sala",
        "product",
      )
      .pushByCategories(
        {
          id: new RandID(),
          title: "Pessoas",
          icon: "people",
          subItems: [
            {
              id: new RandID(),
              title: "Beneficiários",
              path: "/beneficiarios",
            },
            { id: new RandID(), title: "Famílias", path: "/familias" },
            { id: new RandID(), title: "Doadores", path: "/doadores" },
            { id: new RandID(), title: "Voluntários", path: "/voluntarios" },
            { id: new RandID(), title: "Alocações", path: "/alocacoes" },
            {
              id: new RandID(),
              title: "Tipos de Alocação",
              path: "/tipos-de-alocacao",
            },
          ],
        },
        "beneficiary",
        "family",
        "donor",
        "volunteer",
      )
      .pushUnsafe({
        id: new RandID(),
        title: "Relatórios",
        icon: "file",
        subItems: [
          { id: new RandID(), title: "Doações", path: "/relatorios/doacoes" },
          {
            id: new RandID(),
            title: "Arrecadações",
            path: "/relatorios/arrecadacoes",
          },
          {
            id: new RandID(),
            title: "Doações x Arrecadações",
            path: "/relatorios/doacoes-x-arrecadações",
          },
          {
            id: new RandID(),
            title: "Atingimento de Metas",
            path: "/relatorios/metas",
          },
          {
            id: new RandID(),
            title: "Donativos a Vencer",
            path: "/relatorios/donativos",
          },
          {
            id: new RandID(),
            title: "Descartes",
            path: "/relatorios/descartes",
          },
        ],
      })
      .pushByCategories(
        {
          id: new RandID(),
          title: "Institucional",
          icon: "house",
          subItems: [
            { id: new RandID(), title: "Usuários", path: "/usuarios" },
            {
              id: new RandID(),
              title: "Níveis de Usuário",
              path: "/niveis-de-usuario",
            },
            {
              id: new RandID(),
              title: "Você",
              path: `/usuarios/${userId}`,
            },
            {
              id: new RandID(),
              title: "Contas a Pagar",
              path: "/contas-a-pagar",
            },
            { id: new RandID(), title: "Contas Pagas", path: "/contas-pagas" },
          ],
        },
        "user",
        "role",
        "bill",
      );

    return new MenuBuilder(menuStructure.getArray());
  }
}

import { useEffect, useState } from "react";
import BeneficiariesService from "./BeneficiariesService";
import "./Beneficiaries.css";
import { ActionList } from "../../components/action-list/ActionList";
import { DataGrid } from "../../components/data-grid/DataGrid";

export const Beneficiaries = () => {
  return (
    <DataGrid
      paginatableService={BeneficiariesService}
      singularName="beneficiário"
      pluralName="beneficiários"
      actionsConfig={[
        {
          type: "show",
          content: (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.00015 1.5C8.6962 1.5 10.9392 3.43988 11.4094 6C10.9392 8.5601 8.6962 10.5 6.00015 10.5C3.30406 10.5 1.06108 8.5601 0.59082 6C1.06108 3.43988 3.30406 1.5 6.00015 1.5ZM6.00015 9.5C8.11795 9.5 9.93015 8.026 10.3889 6C9.93015 3.97401 8.11795 2.5 6.00015 2.5C3.8823 2.5 2.07011 3.97401 1.61139 6C2.07011 8.026 3.8823 9.5 6.00015 9.5ZM6.00015 8.25C4.75749 8.25 3.75013 7.24265 3.75013 6C3.75013 4.75736 4.75749 3.75 6.00015 3.75C7.24275 3.75 8.25015 4.75736 8.25015 6C8.25015 7.24265 7.24275 8.25 6.00015 8.25ZM6.00015 7.25C6.6905 7.25 7.25015 6.69035 7.25015 6C7.25015 5.30965 6.6905 4.75 6.00015 4.75C5.3098 4.75 4.75013 5.30965 4.75013 6C4.75013 6.69035 5.3098 7.25 6.00015 7.25Z"
                  fill="white"
                />
              </svg>
            </>
          ),
          onAction: console.log,
        },
        {
          type: "edit",
          content: (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.44975 3.42727L8.57105 5.54861L3.62132 10.4984H1.5V8.37701L6.44975 3.42727ZM7.15685 2.72017L8.2175 1.65951C8.4128 1.46425 8.72935 1.46425 8.9246 1.65951L10.3389 3.07372C10.5341 3.26898 10.5341 3.58557 10.3389 3.78083L9.27815 4.84149L7.15685 2.72017Z"
                  fill="white"
                />
              </svg>

              <span>Editar</span>
            </>
          ),
          onAction: console.log,
        },
        {
          type: "donate",
          content: (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.08597 5.49995L3.7575 3.17153L4.4646 2.46442L8.00016 5.99995L4.4646 9.5355L3.7575 8.8284L6.08592 6.49995L1.50002 6.5L1.5 5.5L6.08597 5.49995ZM9.00001 9.4999V2.49993H10V9.4999H9.00001Z"
                  fill="white"
                />
              </svg>

              <span>Doar</span>
            </>
          ),
          onAction: console.log,
        },
        {
          type: "delete",
          content: (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 3H11V4H10V10.5C10 10.7761 9.77615 11 9.5 11H2.5C2.22386 11 2 10.7761 2 10.5V4H1V3H3.5V1.5C3.5 1.22386 3.72386 1 4 1H8C8.27615 1 8.5 1.22386 8.5 1.5V3ZM9 4H3V10H9V4ZM4.5 5.5H5.5V8.5H4.5V5.5ZM6.5 5.5H7.5V8.5H6.5V5.5ZM4.5 2V3H7.5V2H4.5Z"
                  fill="white"
                />
              </svg>

              <span>Deletar</span>
            </>
          ),
          onAction: console.log,
        },
      ]}
    />
  );

  /* return (
    <table className="data-grid --beneficiaries">
      <tbody>
        {page.map((item) => (
          <tr key={item.nationalId} className="beneficiary__row">
            <td className="beneficiary__col --name">{item.name}</td>
            <td className="beneficiary__col --national-id">
              {item.nationalId}
            </td>
            <td className="beneficiary__col --has-request">
              {item.hasOpenRequest ? "SIM" : "NÃO"}
            </td>
            <td className="beneficiary__col --actions">
              <ActionList
                target={item}
                actions={[
                  {
                    type: "show",
                    content: (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.00015 1.5C8.6962 1.5 10.9392 3.43988 11.4094 6C10.9392 8.5601 8.6962 10.5 6.00015 10.5C3.30406 10.5 1.06108 8.5601 0.59082 6C1.06108 3.43988 3.30406 1.5 6.00015 1.5ZM6.00015 9.5C8.11795 9.5 9.93015 8.026 10.3889 6C9.93015 3.97401 8.11795 2.5 6.00015 2.5C3.8823 2.5 2.07011 3.97401 1.61139 6C2.07011 8.026 3.8823 9.5 6.00015 9.5ZM6.00015 8.25C4.75749 8.25 3.75013 7.24265 3.75013 6C3.75013 4.75736 4.75749 3.75 6.00015 3.75C7.24275 3.75 8.25015 4.75736 8.25015 6C8.25015 7.24265 7.24275 8.25 6.00015 8.25ZM6.00015 7.25C6.6905 7.25 7.25015 6.69035 7.25015 6C7.25015 5.30965 6.6905 4.75 6.00015 4.75C5.3098 4.75 4.75013 5.30965 4.75013 6C4.75013 6.69035 5.3098 7.25 6.00015 7.25Z"
                            fill="white"
                          />
                        </svg>
                      </>
                    ),
                    onAction: console.log,
                  },
                  {
                    type: "edit",
                    content: (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.44975 3.42727L8.57105 5.54861L3.62132 10.4984H1.5V8.37701L6.44975 3.42727ZM7.15685 2.72017L8.2175 1.65951C8.4128 1.46425 8.72935 1.46425 8.9246 1.65951L10.3389 3.07372C10.5341 3.26898 10.5341 3.58557 10.3389 3.78083L9.27815 4.84149L7.15685 2.72017Z"
                            fill="white"
                          />
                        </svg>

                        <span>Editar</span>
                      </>
                    ),
                    onAction: console.log,
                  },
                  {
                    type: "donate",
                    content: (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.08597 5.49995L3.7575 3.17153L4.4646 2.46442L8.00016 5.99995L4.4646 9.5355L3.7575 8.8284L6.08592 6.49995L1.50002 6.5L1.5 5.5L6.08597 5.49995ZM9.00001 9.4999V2.49993H10V9.4999H9.00001Z"
                            fill="white"
                          />
                        </svg>

                        <span>Doar</span>
                      </>
                    ),
                    onAction: console.log,
                  },
                  {
                    type: "delete",
                    content: (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.5 3H11V4H10V10.5C10 10.7761 9.77615 11 9.5 11H2.5C2.22386 11 2 10.7761 2 10.5V4H1V3H3.5V1.5C3.5 1.22386 3.72386 1 4 1H8C8.27615 1 8.5 1.22386 8.5 1.5V3ZM9 4H3V10H9V4ZM4.5 5.5H5.5V8.5H4.5V5.5ZM6.5 5.5H7.5V8.5H6.5V5.5ZM4.5 2V3H7.5V2H4.5Z"
                            fill="white"
                          />
                        </svg>

                        <span>Deletar</span>
                      </>
                    ),
                    onAction: console.log,
                  },
                ]}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ); */
};

import { useNavigate } from "react-router";
import { authStore, useAuth } from "../../store/Auth.store";
import "./UserControls.css";

export function UserControls() {
  const user = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const abbr = getUserAbbr(user.name);
  const name = getUserName(user.name);

  const handleSignOut = () => {
    authStore.signOut();
  };

  const handleSettings = () => {
    navigate("/usuarios/" + user.id);
  };

  return (
    <div className="nav-user-info">
      <div className="nav-user-info__abbr">{abbr}</div>

      <div className="nav-user-info__data">
        <p className="nav-user-info__name">{name}</p>

        <div className="nav-user-info__actions">
          <button
            className="nav-user-info__action-settings"
            onClick={handleSettings}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="currentColor"
            >
              <path d="M12 14V16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM14.5946 18.8115C14.5327 18.5511 14.5 18.2794 14.5 18C14.5 17.7207 14.5327 17.449 14.5945 17.1886L13.6029 16.6161L14.6029 14.884L15.5952 15.4569C15.9883 15.0851 16.4676 14.8034 17 14.6449V13.5H19V14.6449C19.5324 14.8034 20.0116 15.0851 20.4047 15.4569L21.3971 14.8839L22.3972 16.616L21.4055 17.1885C21.4673 17.449 21.5 17.7207 21.5 18C21.5 18.2793 21.4673 18.551 21.4055 18.8114L22.3972 19.3839L21.3972 21.116L20.4048 20.543C20.0117 20.9149 19.5325 21.1966 19.0001 21.355V22.5H17.0001V21.3551C16.4677 21.1967 15.9884 20.915 15.5953 20.5431L14.603 21.1161L13.6029 19.384L14.5946 18.8115ZM18 19.5C18.8284 19.5 19.5 18.8284 19.5 18C19.5 17.1716 18.8284 16.5 18 16.5C17.1716 16.5 16.5 17.1716 16.5 18C16.5 18.8284 17.1716 19.5 18 19.5Z"></path>
            </svg>
            Você
          </button>

          <button
            className="nav-user-info__action-sign-out"
            onClick={handleSignOut}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="currentColor"
            >
              <path d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z"></path>
            </svg>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

function getUserAbbr(name) {
  if (!name || typeof name !== "string" || name.trim() === "") return "UD";

  const [firstName, ...rest] = name.split(/\s+/);

  if (rest.length) {
    const lastName = rest[rest.length - 1];

    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  return `${firstName[0]}${firstName[firstName.length - 1]}`.toUpperCase();
}

function getUserName(name) {
  if (!name || typeof name !== "string" || name.trim() === "")
    return "Usuário Desconhecido";

  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.pop();
  const middleNames = rest.length
    ? " " +
      rest
        .map((n) => {
          if (n.length <= 3) return n;

          return `${n[0]}.`;
        })
        .join(" ")
    : "";

  return `${firstName}${middleNames} ${lastName}`.trim();
}

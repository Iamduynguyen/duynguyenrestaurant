export default function getAuth() {
  if (!!localStorage.getItem("token") || !!sessionStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
}

export function getKey(key) {
  if (!!localStorage.getItem(key) || !!sessionStorage.getItem(key)) {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } else {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("role");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("name");
  sessionStorage.removeItem("role");
}

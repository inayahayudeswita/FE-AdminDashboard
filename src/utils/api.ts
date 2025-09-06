export const loginUser = async (username: string, password: string) => {
  if (username === "admin" && password === "admin123") {
    return { token: "123456" };
  } else {
    throw new Error("Username atau Password Salah!");
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

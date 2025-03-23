export const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.role : null;
};

export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};

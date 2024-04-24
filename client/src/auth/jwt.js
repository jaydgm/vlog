
// sets and saves jwt of user to 
// local storage
export const setJwt = (jwt) => {

    if (!jwt) {
        return "Missing jwt token";
    }

    localStorage.setItem("jwt", `Bearer ${jwt}`)
}
// clears local storage
export const clearJwt = () => {
    localStorage.clear();
}

// gets jwt in local storage
export const getJwt = () => {
    const jwt = localStorage.getItem("jwt");
    return jwt
}
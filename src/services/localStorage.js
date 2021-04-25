import cookie from "js-cookie";

// Set in Cookie
export const setCookie = (key, value) => {
    if (window !== "undefined") {
        cookie.set(key, value, {
            // 1 Day
            expires: 1,
        });
    }
};
// remove from cookie
export const removeCookie = (key) => {
    if (window !== "undefined") {
        cookie.remove(key, {
            expires: 1,
        });
    }
};

// Get from cookie such as stored token
// Will be useful when we need to make request to server with token
export const getCookie = (key) => {
    if (window !== "undefined") {
        return cookie.get(key);
    }
};

// Set in local storage
export const setLocalStorage = (key, value) => {
    if (window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const getLocalStorage = (key) => {
    if (window !== "undefined") {
        return localStorage.getItem(key);
    }
};

// Remove from local storage
export const removeLocalStorage = (key) => {
    if (window !== "undefined") {
        localStorage.removeItem(key);
    }
};

// Auth enticate user by passing data to cookie and local storage during signin
export const authenticate = (response, next) => {
    console.log("AUTHENTICATE HELPER ON SIGNIN RESPONSE", response);
    setCookie("token", response.data.token);
    setLocalStorage("user", response.data.user);
    next();
};

// Access user info from localstorage
export const isAuth = () => {
    if (window !== "undefined") {
        const cookieChecked = getCookie("token");
        if (cookieChecked) {
            if (localStorage.getItem("user")) {
                return JSON.parse(localStorage.getItem("user"));
            } else {
                return false;
            }
        }
    }
};

export const signOut = (next) => {
    removeCookie("token");
    removeLocalStorage("user");
    next();
};

export const updateUser = (user) => {
    console.log("UPDATE USER IN LOCAL STORAGE HELPERS");
    if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
    }
};
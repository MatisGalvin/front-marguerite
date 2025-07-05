// On next JS localStorage is undefined during server side processing.
//So we have to do a check this code is ignored , whe running server side
export const getSafeLocalStorage = () => {
    if (typeof window !== "undefined") {
      return localStorage;
    }
    return null;
  };
  
// User session
export const setUserAccessToken = (userAccessToken: string) => {
  localStorage.setItem("userAccessToken", userAccessToken);
};

export const getUserAccessToken = () => {
  return localStorage.getItem("userAccessToken");
};

export const removeUserAccessToken = () => {
  localStorage.removeItem("userAccessToken");
};

export const setUserDetails = (userDetails: Record<string, any>) => {
  localStorage.setItem("userDetails", JSON.stringify(userDetails));
};

export const getUserDetails = () => {
  return localStorage.getItem("userDetails");
};

export const removeUserDetails = () => {
  localStorage.removeItem("userDetails");
};

export const logout = () => {
  removeUserAccessToken();
  removeUserDetails();
};

// // src/context/authHelpers.js

// // ✅ Logout helper function
// export const logout = () => {
//   // Remove authentication data
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');


//   // Redirect to login page
//   window.location.href = '/login';
// };

// // ✅ Optional helper to save login info
// export const saveAuthData = (token, user) => {
//   localStorage.setItem('token', token);
//   localStorage.setItem('user', JSON.stringify(user));
// };

// // ✅ Optional helper to get user data
// export const getAuthData = () => {
//   const token = localStorage.getItem('token');
//   const user = JSON.parse(localStorage.getItem('user') || 'null');
//   return { token, user };
// };

 const validashionShema = ({ email, password }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "Invalid email format" };
    }
  
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{};:'",.<>/?\\|`~+=_-]).{8,}$/;
  
    if (!strongPasswordRegex.test(password)) {
      return {
        success: false,
        message:
          "Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      };
    }
  
    return { success: true }; // All good!
  };
  
  module.exports = {
    validashionShema,
  };
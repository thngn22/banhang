export const specialCharacterRegex = /^[a-zA-Z\s]+$/;

export const specialCharacterRegex2 = /^[a-zA-Z\s\d]+$/;

export const formatPhoneNumber = /^\d{10,11}$/;

export const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const descReviewStart = [
  "Very bad",
  "Bad",
  "Normal",
  "Good",
  "Very good",
];

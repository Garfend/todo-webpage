export const Validator = {
  isEmpty: str => !str || str.trim() === '',
  isEmail: str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
};

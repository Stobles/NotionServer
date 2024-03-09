export function removeSpacesAndSpecialChars(str: string) {
  return str.replace(/[\s~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, '');
}

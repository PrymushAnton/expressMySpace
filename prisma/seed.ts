import parsePhoneNumberFromString from "libphonenumber-js"

const result = parsePhoneNumberFromString("+380 50 232 23 6512")
console.log(result?.country)
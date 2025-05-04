
import { UserAuthPayload, UserRegPayloadTwoPasswords } from "./types"
import userRepository from "./userRepository"
import parsePhoneNumberFromString from "libphonenumber-js"
import isEmail from "validator/lib/isEmail"
import { REGEX } from "../constants/constants"
import {hash, compare} from "bcryptjs"
import { capitalizeWords } from "../tools/capitalizeWords"
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config/token";

const moment = require("moment")

async function reg(data: UserRegPayloadTwoPasswords){
    const {name, surname, email, phoneNumber, birthDate, password, confirmPassword} = data
    
    const numberResult = parsePhoneNumberFromString(phoneNumber)

    if (!numberResult) return {status: "error", message: "Некоректний номер телефону"}

    const userPhone = await userRepository.getUserByPhoneNumber(numberResult.number)
    if (userPhone) return {status: "error", message: "Користувач з таким номером телефону вже існує"}

    const newEmail = email.trim()
    if (!isEmail(newEmail)) return {status: "error", message: "Некоректна пошта"}

    const userEmail = await userRepository.getUserByEmail(newEmail)
    if (userEmail) return {status: "error", message: "Користувач з такою поштою вже існує"}

    if (!name) return {status: "error", message: "Некоректне ім'я"}
    if (name.length < 2 || name.length > 50) return {status: "error", message: "Некоректне ім'я"}
    if (!REGEX.test(name)) return {status: "error", message: "Некоректне ім'я"}
    const newName = capitalizeWords(name.trim())


    if (!surname) return {status: "error", message: "Некоректне прізвище"}
    if (surname.length < 2 || surname.length > 50) return {status: "error", message: "Некоректне прізвище"}
    if (!REGEX.test(surname)) return {status: "error", message: "Некоректне прізвище"}
    const newSurname = capitalizeWords(surname.trim())

    const date = new Date(birthDate)
    if (isNaN(date.getTime())) return {status: "error", message: "Некоректна дата народження"}
    const dateNow = new Date()
    if (date.getFullYear() > dateNow.getFullYear()) return {status: "error", message: "Некоректна дата народження"}
    if (date.getFullYear() < 1900) return {status: "error", message: "Некоректна дата народження"}
    
    if (!password) return {status: "error", message: "Введіть пароль"}
    if (password.length < 8) return {status: "error", message: "Пароль повинен містити не менше 8 символів"}
    if (password.length > 64) return {status: "error", message: "Пароль повинен містити не більше 64 символів"}
    if (!(/[A-Z]/.test(password))) return { status: "error", message: "Пароль повинен містити хоча б одну велику літеру."}
    if (!(/[a-z]/.test(password))) return { status: "error", message: "Пароль повинен містити хоча б одну маленьку літеру."}
    if (!(/\d/.test(password))) return { status: "error", message: "Пароль повинен містити хоча б одну цифру."}
    if (!(/[!@#$%^&*(),.?":{}|<>]/.test(password))) return { status: "error", message: "Пароль повинен містити хоча б один спеціальний символ."}
    if (password !== confirmPassword) return {status: "error", message: "Паролі не співпадають"}

    const hashedPassword = await hash(password, 10)
    const hashedData = {
        name: newName,
        surname: newSurname,
        email: newEmail,
        phoneNumber: numberResult.number,
        birthDate: date,
        password: hashedPassword
    }

    const user = await userRepository.createUser(hashedData)
    if (!user) return {status: "error", message: "Помилка при реєстрації"}


    const token = sign({id: user.id}, SECRET_KEY, { expiresIn: "7d" });

    return { status: "success", data: token };
}

async function auth(data: UserAuthPayload){
    const {phoneNumber, email, password} = data

    let user
    if (phoneNumber) {
        const numberResult = parsePhoneNumberFromString(phoneNumber)
        if (!numberResult) return {status: "error", message: "Некоректний номер телефону"}

        user = await userRepository.getUserByPhoneNumber(phoneNumber)
    } else if (email) {
        const newEmail = email.trim()
        if (!isEmail(newEmail)) return {status: "error", message: "Некоректна пошта"}

        user = await userRepository.getUserByEmail(email)
    }

    if (!user) return {status: "error", message: "Такого користувача не існує"}

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) return {status: "error", message: "Невірний пароль"}
    const token = sign({id: user.id}, SECRET_KEY, { expiresIn: "7d" });
    return { status: "success", data: token };
}

async function me(id: number){
    const user = await userRepository.getUserById(id)
    if (!user) return {status: "error", message: "Такого користувача не існує"}
    return { status: "success", data: user }
}

const userService = {
    reg: reg,
    auth:auth,
    me:me
}

export default userService
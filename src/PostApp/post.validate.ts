import * as yup from "yup";

export const PostValidation = {
    post: yup.object({
        title: yup
            .string()
            .required("Це поле обов'язкове")
            .max(32, "Довжина повинна бути менше або 32"),
        text: yup
            .string()
            .required("Це поле обов'язкове")
            .max(1024, "Довжина повинна бути менше або 1024"),
        existingTags: yup
            .array()
            .of(
                yup
                    .string()
                    .max(24, "Довжина повинна бути менше або 24")
            ),
        newTags: yup
            .array()
            .of(
                yup
                    .string()
                    .max(24, "Довжина повинна бути менше або 24")
            ),
    }),
};

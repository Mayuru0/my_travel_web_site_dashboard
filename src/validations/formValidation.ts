import * as Yup from "yup";

export const myFormValidationSchema = Yup.object({
  name: Yup.string().required("නම අවශ්‍යයි"),
  email: Yup.string().email("වලංගු Email එකක් ලබාදෙන්න").required("Email අවශ්‍යයි"),
});

import * as yup from 'yup';

export const userSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(50).required(),
  firstName: yup.string().min(2).max(60).notRequired(),
  lastName: yup.string().min(2).max(60).notRequired(),
});

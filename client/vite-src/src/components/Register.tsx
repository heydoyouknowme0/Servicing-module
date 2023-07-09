import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

interface State {
  successful: boolean;
  message: string;
}

interface FormValues {
  username: string;
  email: string;
  password: string;
  enableRequest: boolean;
}

const Register = () => {
  const [state, setState] = useState<State>({
    successful: false,
    message: "",
  });

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "The username must be at least 3 characters.")
      .max(20, "The username must be at most 20 characters.")
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .min(6, "The password must be at least 6 characters.")
      .max(40, "The password must be at most 40 characters.")
      .required("This field is required!"),
  });

  const handleRegister = async (formValues: FormValues) => {
    const { username, email, password, enableRequest } = formValues;

    try {
      const roles = enableRequest ? true : false;

      const response = await AuthService.register(
        username,
        email,
        password,
        roles
      );
      setState({
        successful: true,
        message: response.data.message,
      });
    } catch (error: any) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      setState({
        successful: false,
        message: resMessage,
      });
    }
  };

  const { successful, message } = state;

  const initialValues: FormValues = {
    username: "",
    email: "",
    password: "",
    enableRequest: false,
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="avatar_2x.png"
          alt="profile-img"
          className="profile-img-card mb-4"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <>
                <div className="form-floating">
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder=" "
                  />
                  <label htmlFor="username">Username</label>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-floating">
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder=" "
                  />
                  <label htmlFor="email">Email</label>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-floating mb-3">
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder=" "
                  />
                  <label htmlFor="password">Password</label>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group mb-3">
                  <div className="form-check">
                    <Field
                      type="checkbox"
                      id="enableRequest"
                      name="enableRequest"
                      className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor="enableRequest">
                      Enable Request
                    </label>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 pt-2"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}

            {message && (
              <div className="form-group mb-3">
                <div
                  className={
                    successful ? "alert alert-success" : "alert alert-danger"
                  }
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;

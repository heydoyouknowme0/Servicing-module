import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";

interface LoginValues {
  username: string;
  password: string;
}

interface LoginProps {
  onLoginConfirmed: () => void;
}

const Login = ({ onLoginConfirmed }: LoginProps) => {
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      navigate("/profile");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = (formValues: LoginValues) => {
    const { username, password } = formValues;

    setMessage("");
    setFormLoading(true);

    AuthService.login(username, password)
      .then(() => {
        onLoginConfirmed();
        navigate("/profile");
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setFormLoading(false);
        setMessage(resMessage);
      });
  };

  const initialValues: LoginValues = {
    username: "",
    password: "",
  };

  return (
    <>
      <div className="card card-container">
        <img
          src="avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="form-floating mt-3">
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
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary w-100 my-2 py-2"
                disabled={formLoading}
              >
                {formLoading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default Login;

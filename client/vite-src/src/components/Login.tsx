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
  const [loading, setLoading] = useState(false);
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
    <div className="col-md-12">
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
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage
                name="username"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="alert alert-danger"
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading || formLoading}
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
    </div>
  );
};

export default Login;

import { FormEvent, useRef } from "react";
import { Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import "./SignIn.css";

export default function SignIn() {
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const { signInError: error, login } = useAuth();

  function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (emailRef.current?.value !== undefined && passwordRef.current?.value) {
      login(emailRef.current.value, passwordRef.current.value);
    }
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={signIn}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          {error !== undefined ? <Alert>{error}</Alert> : null}
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              required
              ref={emailRef as unknown as string}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              required
              ref={passwordRef as unknown as string}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-right mt-2">
            Need an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </form>
    </div>
  );
}

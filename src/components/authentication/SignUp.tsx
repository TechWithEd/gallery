import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { addDoc } from "@firebase/firestore";
import React, { FormEvent, useRef, useState } from "react";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/firebase";
import "./SignUp.css";

export default function SignUp() {
  const emailRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const confirmPasswordRef = useRef<HTMLInputElement>();
  const {
    signUpError: error,
    setSignUpError: setError,
    signup,
    currentUser,
  } = useAuth();

  async function signUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      emailRef.current?.value !== undefined &&
      passwordRef.current?.value !== undefined &&
      confirmPasswordRef.current?.value !== undefined
    ) {
      if (passwordRef.current.value !== confirmPasswordRef.current.value) {
        setError("Passwords do not match");
        return;
      }
      signup(emailRef.current.value, passwordRef.current.value);
    }
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={signUp}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
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
          <div className="form-group mt-3">
            <label>Confirmation Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter confirmation password"
              required
              ref={confirmPasswordRef as unknown as string}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-right mt-2">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

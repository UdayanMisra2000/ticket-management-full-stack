import React, { useState, useContext } from 'react';
import PasswordValidator from 'password-validator';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { UserContext } from "../UserContext";
import 'react-toastify/dist/ReactToastify.css';
import logo from "../Images/logo_full.png";
import img1 from "../Images/Login.png";
import "./login.css";

// Password validation schema
const passwordSchema = new PasswordValidator();
passwordSchema
    .is().min(8)          // Minimum length 8
    .is().max(100)        // Maximum length 100
    .has().uppercase()    // Must have at least one uppercase letter
    .has().lowercase()    // Must have at least one lowercase letter
    .has().digits(1)      // Must have at least one digit
    .has().symbols()      // Must have at least one special character
    .has().not().spaces(); // Should not have spaces

// Map validation errors
const passwordErrorMessages = {
    min: "at least 8 characters",
    max: "no more than 100 characters",
    uppercase: "at least one uppercase letter",
    lowercase: "at least one lowercase letter",
    digits: "at least one digit",
    symbols: "at least one special character",
    spaces: "no spaces",
};

function validatePassword(password) {
    const validationErrors = passwordSchema.validate(password, { list: true });
    if (validationErrors.length > 0) {
        return `Password must have ${validationErrors.map(err => passwordErrorMessages[err]).join(", ")}.`;
    }
    return null;
}

function SignUp() {
    const navigate = useNavigate();
    const { setUserId } = useContext(UserContext); // Correctly destructure setUserId from context
    const [agree, setAgree] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        // Validate form fields
        if (!(form.firstName && form.lastName && form.email && form.password && form.confirmPassword)) {
            setError("All fields are required.");
            return;
        }

        const passwordError = validatePassword(form.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!agree) {
            setError("You must agree to the Terms of Use and Privacy Policy.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const data = await response.json();
                setUserId(data.user.id); // Save user ID in context
                localStorage.setItem("token", data.token); // Save token in local storage
                toast.success("Registration successful! Redirecting..."); // Show success toast
                setTimeout(() => {
                    navigate(`/member`); // Redirect after a short delay
                }, 2000);
                setForm({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }); // Reset form
                setAgree(false); // Reset checkbox
            } else {
                const data = await response.json();
                setError(data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="auth-container">
            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            
            {/* TOP-LEFT: LOGO */}
            <div className="logo-container">
                <img src={logo} alt="Hubly Logo" className="logo" />
            </div>
            
            {/* LEFT: FORM */}
            <div className="auth-form-container">
                <div className="form-header">
                    <h1>Register</h1>
                    <span className="signin-link">
                        <Link to="/login">Sign in instead</Link>
                    </span>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        placeholder="First Name"
                        onChange={handleChange}
                    />
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        placeholder="Last Name"
                        onChange={handleChange}
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        placeholder="Email"
                        onChange={handleChange}
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        placeholder="Password"
                        onChange={handleChange}
                    />
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        placeholder="Confirm Password"
                        onChange={handleChange}
                    />
                    {/* TERMS CHECKBOX */}
                    <div className="terms-checkbox">
                        <input
                            type="checkbox"
                            id="agree"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                        />
                        <label htmlFor="agree">
                            By creating an account, I agree to our{" "}
                            <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a> and{" "}
                            <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                        </label>
                    </div>
                    {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                    <button type="submit">Create an Account</button>
                </form>
            </div>
            
            {/* RIGHT: IMAGE */}
            <div className="auth-image-container">
                <img src={img1} alt="Login Illustration" className="auth-image" />
            </div>
        </div>
    );
}

export default SignUp;
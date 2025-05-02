import React from "react";
import "./HomePage.css";
import logo from "../Images/logo.png";
import logoFull from "../Images/logo_full.png";
import play from "../Images/play.png";
import calendar from "../Images/calendar.png";
import profile from "../Images/Profile Image.png";
import img1 from "../Images/Frame 1.png";
import img2 from "../Images/Frame 2.png";
import img3 from "../Images/Frame 3.png";
import icons from "../Images/icons.png";
import icons2 from "../Images/icons2.png";
import { useNavigate } from "react-router-dom";
import ChatBot from "../Components/ChatBot";


export default function HomePage() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignUp = () => {
    navigate("/signup");
  }
  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
            <img src={logo} alt="Hubly Logo" className="logo" />
          <span className="logo-text">Hubly</span>
        </div>
        <div className="nav-buttons">
          <button onClick={handleLogin} className="login-button">Login</button>
          <button onClick={handleSignUp} className="signup-button">Sign up</button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h1 className="hero-title">
            Grow Your Business Faster with Hubly CRM
          </h1>
          <p className="hero-description">
            Manage leads, automate workflows, and close deals effortlessly—all in one powerful platform.
          </p>
          <div className="hero-actions">
            <button className="get-started">Get started</button>
            <button className="watch-video">
              <img src={play} alt="play icon" className="play-icon"/>
              <span><strong>Watch Video</strong></span>
            </button>
          </div>
        </div>

        {/* Image & Widgets Placeholder */}
          <div className="hero-image">
            <div className="widget-top">
              <img src={profile} alt="profile" className="user-icon"/>
              <div className="user-info">
                <p className="user-joined" style={{alignContent:"center"}}>Jerry Calzoni <span style={{ color: "blue" }}>joined</span> Swimming <br/> <span style={{ fontSize: "small", color: "grey" }}> Class 9:22 AM</span></p>
              </div>
            </div>
            <img src={img1} alt="center" className="widget-center"/>
            <img src={calendar} alt="calendar" className="widget-bottom-left"/>
            <img src={img2} alt="sales-report" className="widget-bottom-right"/>
          </div>
              </div>

              {/* Partners */}
      <div className="partners">
        {['Adobe', 'elastic', 'Opendoor', 'Airtable', 'elastic', 'Framer'].map((brand, i) => (
          <div key={i} className="partner-name">
            {brand}
          </div>
        ))}
      </div>

      {/* CRM Info Section */}
      <section className="crm-section">
        <h2 className="section-heading">At its core, Hubly is a robust CRM solution.</h2>
        <p className="section-description">
          Hubly helps businesses streamline customer interactions, track leads, and automate tasks—saving you time and maximizing revenue.
          Whether you're a startup or an enterprise, Hubly adapts to your needs, giving you the tools to scale efficiently.
        </p>

        <div className="crm-platform-box">
          <div className="platform-text">
            <h3>MULTIPLE PLATFORMS TOGETHER!</h3>
            <p>Email communication is a breeze with our fully integrated, drag & drop email builder.</p> <br/><br/><br/>
            <p><strong>CLOSE</strong>: Capture leads using our landing pages, surveys, forms, calendars, inbound phone system & more!</p><br/><br/>
            <p><strong>NURTURE</strong>:Capture leads using our landing pages, surveys, forms, calendars, inbound phone system & more!</p>
          </div>
          <div className="platform-image-placeholder">
          <img src={icons} alt="icons" className="platform-icons"/>
          <img src={img3} alt="diagram" className="platform-image"/>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2 className="section-heading">We have plans for everyone!</h2>
        <p className="section-description">
          We started with a strong foundation, then simply built all of the sales and marketing tools ALL businesses need under one platform.
        </p>

        <div className="pricing-cards">
          <div className="pricing-card">
            <h2>STARTER</h2>
            <p>Best for local businesses needing to improve their online reputation.</p>
            <p className="price">$199 <span>/monthly</span></p>
            <p><strong>What's included</strong></p>
            <ul>
              <li>Unlimited Users</li>
              <li>CRM Messaging</li>
              <li>Reputation Management</li>
              <li>GMB Call Tracking</li>
              <li>24/7 Award Winning Support</li>
            </ul>
            <button className="pricing-button">SIGN UP FOR STARTER</button>
          </div>

          <div className="pricing-card">
            <h2>GROW</h2>
            <p>Best for all businesses that want to take full control of their marketing automation and track their leads, click to close.</p>
            <p className="price">$399 <span>/monthly</span></p>
            <p><strong>What's included</strong></p>
            <ul>
              <li>Pipeline Management</li>
              <li>Marketing Automation Campaigns</li>
              <li>Live Call Transfer</li>
              <li>Embed-able Form Builder</li>
              <li>Reputation Management</li>
              <li>24/7 Award Winning Support</li>
            </ul>
            <button className="pricing-button">SIGN UP FOR GROW</button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-columns">
        <div className="footer-logo">
          <img src={logoFull} alt="logo" className="footer-logo-placeholder"/>
        </div>
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li>Universal checkout</li>
              <li>Payment workflows</li>
              <li>Observability</li>
              <li>UpliftAI</li>
              <li>Apps & integrations</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Why Primer</h4>
            <ul>
              <li>Expand to new markets</li>
              <li>Boost payment success</li>
              <li>Improve conversion rates</li>
              <li>Reduce payments fraud</li>
              <li>Recover revenue</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Developers</h4>
            <ul>
              <li>Primer Docs</li>
              <li>API Reference</li>
              <li>Payment methods guide</li>
              <li>Service status</li>
              <li>Community</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li>Blog</li>
              <li>Success stories</li>
              <li>News room</li>
              <li>Terms</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li>Careers</li>
            </ul>
          </div>
        </div>
        <img src={icons2} alt="icons" className="footer-socials"/>
      </footer>
      <div className="chatbot-wrapper">
      <ChatBot/>
      </div>
      
    </div>
  );
}

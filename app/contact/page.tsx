"use client";

import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import '../../styles/globals.css';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message.');
      }

      setSubmitted(true);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="contactform">
        {!submitted ? (
          <>
            <h2>Get in Touch</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Name:</label>
              <input id="name" type="text" required value={formData.name} onChange={handleChange} />
              <label htmlFor="email">Email:</label>
              <input id="email" type="email" required value={formData.email} onChange={handleChange} />
              <label htmlFor="message">Message:</label>
              <textarea id="message" rows={4} required value={formData.message} onChange={handleChange}></textarea>
              <button type="submit">Send</button>
            </form>
            {error && <p className="error">{error}</p>}
          </>
        ) : (
          <div className="thank-you-message">
            <h2>Thank you for your message!</h2>
            <p>I will get back to you shortly.</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

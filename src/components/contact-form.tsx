"use client";
import { useState } from "react";
export function ContactForm() {
  const [message, setMessage] = useState("");
  return <form className="contact-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const name = String(data.get("name") ?? "").trim(); const text = String(data.get("message") ?? "").trim(); if (name.length < 2 || text.length < 10) { setMessage("Enter a name of at least 2 characters and a message of at least 10 characters, excluding surrounding spaces."); return; } setMessage("Your entries passed this local check. Nothing was sent or saved. Message delivery is not connected yet."); }}>
    <p className="form-notice"><strong>Frontend-only demo.</strong> This form checks your entries in your browser. It does not send or save messages.</p>
    <label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" minLength={2} maxLength={100} required/>
    <label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required/>
    <label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" minLength={10} maxLength={5000} rows={6} required/>
    <button className="button primary" type="submit">Check entries locally <span>→</span></button><p role="status" aria-live="polite">{message}</p>
  </form>;
}

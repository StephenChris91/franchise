"use client";

import { useState } from "react";
import {
  TextInput,
  Textarea,
  Label,
  Button,
} from "flowbite-react";

export default function CounsellingForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      alert("✅ Your message has been sent successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      alert(`❌ Failed to submit: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" flex flex-col gap-6"
    >
        <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto text-gray-800">
        Counselling{" "}
        <span className="text-[#af601a]">Form</span>
      </h1>
      <div>
        <Label htmlFor="name" value="Full Name" className="text-black"/>
        <TextInput
          id="name"
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          required
          className="bg-gray-50 dark:bg-gray-50 rounded-sm"
        />
      </div>

      <div>
        <Label htmlFor="email" value="Email Address" />
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
          className="rounded-sm"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone" value="Phone Number" />
        <TextInput
          id="phone"
          name="phone"
          placeholder="+234 812 345 6789"
          value={form.phone}
          onChange={handleChange}
          className="rounded-sm"
        />
      </div>

      <div>
        <Label htmlFor="subject" value="Subject" />
        <TextInput
          id="subject"
          name="subject"
          placeholder="e.g. Marriage, Depression, Spiritual Growth"
          value={form.subject}
          onChange={handleChange}
          className="rounded-sm"
        />
      </div>

      <div>
        <Label htmlFor="message" value="Message" />
        <Textarea
          id="message"
          name="message"
          placeholder="What do you need counselling about? Please, share in details
"
          rows={5}
          value={form.message}
          onChange={handleChange}
          required
          className="rounded-sm"
        />
      </div>

      <Button
        type="submit"
        className="cursor-pointer bg-gray-800 rounded-sm"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </form>
  );
}

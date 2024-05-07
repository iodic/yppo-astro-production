import React, { useState } from "react";

const ContactPageComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      "/api/postmark",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );
    const responseData = await response.text();
    setResponseMessage(responseData);

    setFormData({
      name: "",
      email: "",
      reason: "",
      message: "",
    });
  };

  return (
    <section className="section pt-0">
      <div className="container">
        <div className="row">
          <div className="md:col-6 mx-auto">
            <form method="POST" onSubmit={handleSubmit}>
              <div className="form-group mb-5">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-5">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-5">
                <label className="form-label" htmlFor="reason">
                  Type of inquiry
                </label>
                <select
                  name="reason"
                  id="reason"
                  className="form-select"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                >
                  <option value="">Please select</option>
                  <option value="cr">Conflict resolution</option>
                  <option value="m">Mediation</option>
                  <option value="gi">General inquiry</option>
                </select>
              </div>

              <div className="form-group mb-5">
                <label className="form-label" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="form-control h-[150px]"
                  id="message"
                  name="message"
                  cols="30"
                  rows="10"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button className="btn btn-primary block w-full" type="submit">
                Send Message
              </button>
            </form>
            {responseMessage && (
              <div className="mt-4 text-green-600">{responseMessage}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPageComponent;

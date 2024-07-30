import React, { useState } from "react";

const ContactPageComponent = ({ fieldData }) => {
  const { nameObject, emailObject, messageObject, buttonString } = fieldData;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    const response = await fetch("/api/postmark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const responseData = await response.text();
    setResponseMessage(responseData);

    setFormData({
      name: "",
      email: "",
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
                  {nameObject?.fieldName ? nameObject.fieldName : ""}
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="name"
                  name="name"
                  placeholder={
                    nameObject?.placeholder ? nameObject.placeholder : ""
                  }
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-5">
                <label className="form-label" htmlFor="email">
                  {emailObject?.fieldName ? emailObject.fieldName : ""}
                </label>
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  name="email"
                  placeholder={
                    emailObject?.placeholder ? emailObject.placeholder : ""
                  }
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-5">
                <label className="form-label" htmlFor="message">
                  {messageObject?.fieldName ? messageObject.fieldName : ""}
                </label>
                <textarea
                  className="form-control h-[150px]"
                  id="message"
                  name="message"
                  cols="30"
                  rows="10"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={
                    messageObject?.placeholder ? messageObject.placeholder : ""
                  }
                  required
                ></textarea>
              </div>

              <button className="btn btn-primary block w-full" type="submit">
                {buttonString}
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

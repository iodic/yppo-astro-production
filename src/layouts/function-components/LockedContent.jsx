import React from "react";

const LockedContent = () => {
  return (
    <div className="container lg:gx-5 row items-center" id="hidden-paywall">
      <div className="lg:col-7 lg:order-1">
        <div className="relative">
          <img
            className="w-full object-contain"
            alt="service"
            width="473"
            height="286"
            src="/images/mascots/conflict-guide.png"
          />
        </div>
      </div>
      <div className="mt-6 lg:col-5 lg:mt-0 lg:order-0">
        <div className="text-container">
          <h2 id="paywall-info" className="lg:text-4xl mb-4">
            Looks like your account needs an upgrade
          </h2>
          <p className="mb-4">
            Please access your account to upgrade in order to view our courses.
          </p>
          <a
            className="btn btn-outline-header mt-8"
            href="https://yppousers.websitetotal.com/users/sign_in"
            title="Let's go!"
          >
            Let's go!
          </a>
        </div>
      </div>
    </div>
  );
};

export default LockedContent;

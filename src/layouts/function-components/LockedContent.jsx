import React from "react";

const LockedContent = () => {
  return (
    <div class="container lg:gx-5 row items-center" id="hidden-paywall">
      <div class="lg:col-7 lg:order-1">
        <div class="relative">
          <img
            class="w-full object-contain"
            alt="service"
            width="473"
            height="286"
            src="/images/mascots/conflict-guide.png"
          />
        </div>
      </div>
      <div class="mt-6 lg:col-5 lg:mt-0 lg:order-0">
        <div class="text-container">
          <h2 id="paywall-info" class="lg:text-4xl mb-4">
            Looks like your account needs an upgrade
          </h2>
          <p class="mb-4">
            Please access your account to upgrade in order to view our courses.
          </p>
          <a
            class="btn btn-outline-header mt-8"
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

import React, { useEffect, useState } from "react";

import { sanityFetch } from "@/lib/utils/sanityFetch";
import { getClientId, getRedirectUri, getBaseUri } from "@/helper/auth";

const LockedContent = ({ lang }) => {
  const [pageContent, setPageContent] = useState([]);

  const clientId = getClientId();
  const redirectUri = getRedirectUri();
  const baseUri = getBaseUri();

  const handleButtonClick = () => {
    localStorage.setItem("yppoCurrentUrl", window.location.href);
  };

  const authorizationUri = `${baseUri}/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=public`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await sanityFetch({
          type: "authorization",
          lang,
          object: `{
            authorizationBanner,
        }`,
        });

        setPageContent(pageData);
      } catch (error) {
        console.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const { authorizationBanner } = pageContent[0] || {};
  const { title, description, buttonText } = authorizationBanner || {};

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
            {title ? title : "Looks like your account needs an upgrade"}
          </h2>
          <p className="mb-4">
            {description
              ? description
              : "Please access your account to upgrade in order to view our courses."}
          </p>
          <a
            className="btn btn-outline-header mt-8"
            onClick={handleButtonClick}
            href={authorizationUri}
            title="Let's go!"
          >
            {buttonText ? buttonText : "Let's go!"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LockedContent;

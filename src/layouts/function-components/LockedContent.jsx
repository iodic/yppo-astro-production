import React, { useEffect, useMemo, useState } from "react";

import { sanityFetch } from "@/lib/utils/sanityFetch";
import { getClientId, getRedirectUri, getBaseUri } from "@/helper/auth";
import { returnStatusMsg } from "@/helper/helper";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "../portable-text-components";

const LockedContent = ({ lang }) => {
  const [pageContent, setPageContent] = useState([]);
  const [status, setStatus] = useState([]);

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
        const statusMessage = await returnStatusMsg();

        const pageData = await sanityFetch({
          type: "authorization",
          lang,
          object: `{
              ${
                statusMessage === "free"
                  ? `authorizationBannerPaid { ..., "image": image.asset->url, },`
                  : `authorizationBanner { ..., "image": image.asset->url, },`
              }
            }`,
        });

        setStatus(statusMessage);
        setPageContent(pageData);
      } catch (error) {
        console.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const { authorizationBanner, authorizationBannerPaid } = pageContent[0] || {};

  const { title, description, image, buttonText } = useMemo(() => {
    return authorizationBanner || authorizationBannerPaid || {};
  }, [authorizationBanner, authorizationBannerPaid]);

  return (
    <div
      className="container lg:gx-5 row items-center hidden-paywall"
      id="hidden-paywall"
    >
      {image && (
        <div className="lg:col-7 lg:order-1 hidden-paywall-image-container">
          <div className="relative">
            <img
              className="w-full object-contain"
              alt=""
              width="473"
              height="286"
              src={image}
            />
          </div>
        </div>
      )}

      <div className="mt-6 lg:col-5 lg:mt-0 lg:order-0 hidden-paywall-text-container">
        <div className="text-container">
          <h2 id="paywall-info" className="lg:text-4xl mb-4">
            {title ? title : "Looks like your account needs an upgrade"}
          </h2>
          <div className="mb-4">
            {description ? (
              <PortableText
                value={description}
                components={portableTextComponents}
              />
            ) : (
              "Please access your account to upgrade in order to view our courses."
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockedContent;

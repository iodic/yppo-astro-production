import { useEffect, useMemo, useState } from "react";
import { sanityFetch } from "@/lib/utils/sanityFetch";
import { PortableText } from "@portabletext/react";

import portableTextComponents from "@/layouts/portable-text-components";
import SigninSlider from "@/layouts/function-components/SigninSlider.jsx";
import SanityConflictInitial from "@/layouts/function-components/SanityConflictInitial.jsx";

export const ConflictGuideContent = ({ lang }) => {
  const changeConflictGuideState = (newState) => {
    const conflictGuideState = JSON.parse(
      localStorage.getItem("conflict-guide-state") || "{}",
    );

    localStorage.setItem(
      "conflict-guide-state",
      JSON.stringify({ ...conflictGuideState, ...newState }),
    );
  };

  const getConflictGuideState = (key, defaultValue) => {
    const conflictGuideState = JSON.parse(
      localStorage.getItem("conflict-guide-state") || "{}",
    );

    if (
      conflictGuideState &&
      typeof conflictGuideState === "object" &&
      conflictGuideState[key] !== null &&
      conflictGuideState[key] !== undefined
    ) {
      return conflictGuideState[key];
    }

    if (defaultValue !== undefined) {
      return defaultValue;
    }
  };

  const [conflictGuidePageData, setConflictGuidePageData] = useState();
  const [showIntro, setShowIntro] = useState(
    getConflictGuideState("showIntro", true),
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await sanityFetch({
        type: "conflictGuidePage",
        lang,
        object: `{
            title,
            introSection {
              ...,
              "introMobileImage": introMobileImage.asset->url,
            },
            signInSliderContent
        }`,
      });

      if (data?.length) {
        setConflictGuidePageData(data[0]);
      }
    };

    fetchData();

    $(".conflict-guide-form").slideDown(300);

    $(".conflict-guide-form").slideUp(300);

    setTimeout(() => {
      $(".conflict-guide-form").slideDown(300);
    }, 300);
  }, []);

  useEffect(() => {
    changeConflictGuideState({ showIntro });
  }, [showIntro]);

  const introSection = useMemo(() => {
    return conflictGuidePageData?.introSection;
  }, [conflictGuidePageData]);

  const signInSliderContent = useMemo(() => {
    return conflictGuidePageData?.signInSliderContent;
  }, [conflictGuidePageData]);

  const handlePageChange = (callback) => {
    $(".conflict-guide-form").slideUp(300);

    $("html, body").animate({ scrollTop: 0 }, "400");

    if (callback) {
      setTimeout(() => {
        callback();
      }, 300);
    }

    setTimeout(
      () => {
        $(".conflict-guide-form").slideDown(300);
      },
      callback ? 600 : 300,
    );
  };

  return (
    <section>
      <div className="container max-w-full">
        <div className="row">
          <div className="min-h-[580px] bg-white py-8 lg:col-6 lg:py-[64px]">
            {introSection && (
              <div className="conflict-guide-form mx-auto w-full max-w-[480px]">
                {showIntro ? (
                  <div className="form-wrapper form-0">
                    {introSection.introMobileImage && (
                      <img
                        className="mb-8 w-20 block lg:hidden"
                        src={introSection.introMobileImage}
                        alt=""
                      />
                    )}

                    {introSection.introTitle && (
                      <PortableText
                        value={introSection.introTitle}
                        components={portableTextComponents}
                      />
                    )}
                    {introSection.introDescription && (
                      <PortableText
                        value={introSection.introDescription}
                        components={portableTextComponents}
                      />
                    )}

                    {introSection.introButtonText && (
                      <button
                        className="go btn btn-primary mt-10 block w-full"
                        onClick={() =>
                          handlePageChange(() => setShowIntro(false))
                        }
                        href="#"
                      >
                        {introSection.introButtonText}
                      </button>
                    )}
                  </div>
                ) : (
                  <SanityConflictInitial
                    lang={lang}
                    handlePageChange={handlePageChange}
                    showIntro={() => setShowIntro(true)}
                    getConflictGuideState={getConflictGuideState}
                    changeConflictGuideState={changeConflictGuideState}
                  />
                )}
              </div>
            )}
          </div>

          <SigninSlider title={signInSliderContent?.title} />
        </div>
      </div>
    </section>
  );
};

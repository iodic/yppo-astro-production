import { sanityFetch } from "@/lib/utils/sanityFetch";
import { PortableText } from "@portabletext/react";
import portableTextComponents from "@/layouts/portable-text-components";

import SigninSlider from "@/layouts/function-components/SigninSlider.jsx";
import SanityConflictInitial from "@/layouts/function-components/SanityConflictInitial.jsx";
import { useEffect, useMemo, useState } from "react";

export const ConflictGuideContent = ({ lang }) => {
  const [conflictGuidePageData, setConflictGuidePageData] = useState();
  const [showIntro, setShowIntro] = useState(true);

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

    $(".form-wrapper").slideDown(300);

    $(".go").on("click", function (e) {
      $(this)
        .parents(".form-wrapper")
        .slideUp("300", function () {
          $("html, body").animate({ scrollTop: 0 }, "400");
        });

      e.preventDefault();
    });
  }, []);

  const introSection = useMemo(() => {
    return conflictGuidePageData?.introSection;
  }, [conflictGuidePageData]);

  const signInSliderContent = useMemo(() => {
    return conflictGuidePageData?.signInSliderContent;
  }, [conflictGuidePageData]);

  return (
    <section>
      <div className="container max-w-full">
        <div className="row">
          <div className="min-h-[580px] bg-white py-8 lg:col-6 lg:py-[64px]">
            {introSection && (
              <div className="mx-auto w-full max-w-[480px]">
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
                        onClick={() => setShowIntro(false)}
                        href="#"
                      >
                        {introSection.introButtonText}
                      </button>
                    )}
                  </div>
                ) : (
                  <SanityConflictInitial lang={lang} />
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

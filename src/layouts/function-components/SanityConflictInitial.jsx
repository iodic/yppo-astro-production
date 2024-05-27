import React, { useState, useEffect } from "react";
import { sanityFetch } from "@/lib/utils/sanityFetch";

import SanityConflictPost from "@/layouts/function-components/SanityConflictPost.jsx";

const SanityConflictInitial = ({ lang, handlePageChange, showIntro }) => {
  const [pageData, setPageData] = useState([]);

  const [answer, setAnswer] = useState("");
  const [submitFormAnswer, setSubmitFormAnswer] = useState("");
  const [sanityInitialPosts, setSanityInitialPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageContent = await sanityFetch({
          type: "conflictGuidePage",
          lang,
          object: `{
              generalText
            }`,
        });

        setPageData(pageContent);
      } catch (error) {
        console.error("Error fetching page data");
      }
    };

    fetchData();
  }, []);

  const { generalText } = pageData[0] || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialPosts = await sanityFetch({
          type: "conflictType",
          lang,
          query: "initialQuestion == true",
          object: `{
            ...,
            'conflictType': conflictType[]->{
              slug,
              title
            },
        }`,
        });

        setSanityInitialPosts(initialPosts);
      } catch (error) {
        setError("Error fetching initial posts");
      }
    };

    fetchData();
  }, []);

  const backToIntro = () => {
    showIntro();
    setAnswer("");
    setSubmitFormAnswer("");
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}

      {submitFormAnswer ? (
        <SanityConflictPost
          initialId={submitFormAnswer}
          backToInitialForm={() =>
            handlePageChange(() => setSubmitFormAnswer(""))
          }
          handlePageChange={handlePageChange}
          lang={lang}
          backToIntro={backToIntro}
        />
      ) : (
        sanityInitialPosts.length > 0 && (
          <div className="form-wrapper form-1 mt-4">
            {generalText?.introIssueTitle && (
              <h2 className="mb-8 font-normal">
                {generalText?.introIssueTitle}
              </h2>
            )}

            {sanityInitialPosts.map((post) => (
              <div
                className="form-group flex w-full items-baseline rounded"
                key={post._id}
              >
                <input
                  type="radio"
                  name="issue-type"
                  id={post._id}
                  className="top-[3px] relative"
                  onChange={() => setAnswer(post._id)}
                />
                <label
                  className="ml-2 real-deal chapter-choice"
                  htmlFor={post._id}
                >
                  {post.title}
                </label>
              </div>
            ))}

            <div className="form-navigation clear-both">
              <button
                className="go btn btn-primary mt-10 block float-right"
                onClick={() =>
                  handlePageChange(() => setSubmitFormAnswer(answer || ""))
                }
              >
                {generalText?.nextButtonText
                  ? generalText?.nextButtonText
                  : "Next"}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SanityConflictInitial;

import React, { useState, useEffect } from "react";
import { sanityFetch } from "@/lib/utils/sanityFetch";
import { checkStatus } from "src/helper/helper.ts";
import { sanityClient } from "sanity:client";

import SanityConflictPost from "@/layouts/function-components/SanityConflictPost.jsx";

const SanityConflictInitial = ({
  lang,
  handlePageChange,
  showIntro,
  getConflictGuideState,
  changeConflictGuideState,
}) => {
  const [pageData, setPageData] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [submitFormAnswer, setSubmitFormAnswer] = useState(
    getConflictGuideState("submitFormAnswer", null),
  );
  const [sanityInitialPosts, setSanityInitialPosts] = useState([]);
  const [error, setError] = useState(null);
  const [lockedPosts, setLockedPosts] = useState([]);

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
          pipe: "order(orderRank)",
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

  useEffect(() => {
    changeConflictGuideState({
      submitFormAnswer: submitFormAnswer
        ? {
            _id: submitFormAnswer?._id,
            title: submitFormAnswer?.title,
          }
        : null,
    });
  }, [submitFormAnswer]);

  useEffect(() => {
    setLockedPosts([]);

    const checkPosts = async () => {
      const ids = [];

      for (const post of sanityInitialPosts) {
        const isUnlocked = await checkStatus(
          post?.status,
          post?.enableChapterForPreview,
        );

        if (!isUnlocked) {
          ids.push(post._id);
        }

        if (post?.answers?.length) {
          const queries = post.answers.reduce(
            (prev, curr, index) =>
              `${prev}${prev.length ? "," : ""} "${index}": *[_type == 'conflictType' && _id == '${curr._ref}'][0]`,
            "",
          );

          const loadedAnswers = await sanityClient.fetch(`{ ${queries} }`);
          let isAllContentLocked = true;

          for (let answer of Object.values(loadedAnswers)) {
            const isAnswerUnlocked = await checkStatus(
              answer?.status,
              answer?.enableChapterForPreview,
            );

            if (isAnswerUnlocked) {
              isAllContentLocked = false;
            }
          }

          if (isAllContentLocked) {
            ids.push(post._id);
          }
        }
      }

      setLockedPosts(ids);
    };

    checkPosts();
  }, [sanityInitialPosts]);

  const backToIntro = () => {
    showIntro();
    setAnswer(null);
    setSubmitFormAnswer(null);
    localStorage.setItem("conflict-guide-state", "null");
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}

      {submitFormAnswer?._id ? (
        <SanityConflictPost
          initialState={submitFormAnswer}
          backToInitialForm={() =>
            handlePageChange(() => setSubmitFormAnswer(null))
          }
          handlePageChange={handlePageChange}
          lang={lang}
          backToIntro={backToIntro}
          getConflictGuideState={getConflictGuideState}
          changeConflictGuideState={changeConflictGuideState}
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
              <div className="relative" key={post._id}>
                <div
                  className="form-group flex w-full items-baseline rounded"
                  key={post._id}
                  onClick={() => setAnswer(post)}
                >
                  <input
                    type="radio"
                    name="issue-type"
                    id={post._id}
                    className="top-[3px] relative"
                    checked={answer?._id === post._id}
                  />
                  <label
                    className="ml-2 real-deal chapter-choice"
                    htmlFor={post._id}
                  >
                    {post.title}
                  </label>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {lockedPosts.includes(post._id) && (
                    <img src="/images/icons/lock.svg" className="w-6" />
                  )}
                </div>
              </div>
            ))}

            <div className="form-navigation clear-both">
              <button
                className="go btn btn-primary mt-10 block float-right disabled:bg-none disabled:bg-gray-300 disabled:hover:shadow-none disabled:cursor-default"
                disabled={!answer?._id}
                onClick={() =>
                  handlePageChange(() => setSubmitFormAnswer(answer || null))
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

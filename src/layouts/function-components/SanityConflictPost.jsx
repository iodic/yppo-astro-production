import React, { useState, useEffect } from "react";
import { sanityFetch } from "@/lib/utils/sanityFetch";
import { SanityConflictPostChoices } from "@/layouts/function-components/SanityConflictPostChoices.jsx";
import { SanityConflictPostChapter } from "@/layouts/function-components/SanityConflictPostChapter.jsx";
import { checkStatus } from "src/helper/helper.ts";
import LockedContent from "./LockedContent";

const SanityConflictPost = ({ initialId, backToInitialForm, lang }) => {
  const [pageData, setPageData] = useState([]);

  const [sanityPost, setSanityPost] = useState(null);
  const [choices, setChoices] = useState([]);
  const [articleType, setArticleType] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedChoice, setConfirmedChoice] = useState(initialId);
  const [selectedChapter, setSelectedChapter] = useState();
  const [currentRepeaterIndex, setCurrentRepeaterIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [postStatus, setPostStatus] = useState(null);

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

  const fetchChoiceData = async () => {
    try {
      setIsLoading(true);

      const loadedPost = await sanityFetch({
        type: "conflictType",
        query: `_id == '${confirmedChoice}'`,
        lang,
      });

      setSanityPost(loadedPost[0]);

      if (loadedPost && loadedPost[0]) {
        const status = await checkStatus(loadedPost[0]?.status);
        setPostStatus(status);
      }

      const fetchedChoices = [];
      if (loadedPost[0].answers?.length) {
        for (const answer of loadedPost[0].answers) {
          const loadedPost = await sanityFetch({
            type: "conflictType",
            query: `_id == '${answer._ref}'`,
          });

          fetchedChoices.push(loadedPost[0]);
        }

        setChoices(fetchedChoices);
      }

      if (loadedPost[0].articleType) {
        setArticleType(true);
      } else {
        setArticleType(false);
      }
    } catch (error) {
      setError("Error fetching post");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (confirmedChoice) {
      setPostStatus(null);
      fetchChoiceData();
    }
  }, [confirmedChoice]);

  useEffect(() => {
    if (selectedChapter) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          setPostStatus(null);

          const loadedPost = await sanityFetch({
            type: "conflictType",
            query: `_id == '${selectedChapter}'`,
            lang,
          });

          if (loadedPost && loadedPost[0]) {
            const status = await checkStatus(loadedPost[0]?.status);
            setPostStatus(status);
          }

          setSanityPost(loadedPost[0]);
        } catch (error) {
          setError("Error fetching post");
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedChapter]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRepeaterIndex]);

  const reloadPage = () => {
    window.location.reload();
  };

  const nextChapter = () => {
    window.scrollTo(0, 0);

    const selectedChapterIndex = choices.findIndex(
      (choice) => choice._id === selectedChapter,
    );

    if (
      selectedChapterIndex >= 0 &&
      choices.length - 1 > selectedChapterIndex &&
      choices[selectedChapterIndex + 1]
    ) {
      setSelectedChapter(choices[selectedChapterIndex + 1]._id);
      setCurrentRepeaterIndex(0);

      return;
    }

    reloadPage();
  };

  const backToChapters = () => {
    window.scrollTo(0, 0);

    setSelectedChapter();
    fetchChoiceData();
  };

  const handleLockedContentBack = () => {
    if (selectedChapter) {
      setSelectedChapter();
      fetchChoiceData();
    } else {
      backToInitialForm();
    }
  };

  return (
    <div>
      {!postStatus && !isLoading && (
        <>
          <LockedContent lang={lang} client:load />

          <button
            className="go go-back btn float-left border-0 pl-0 pr-0"
            onClick={handleLockedContentBack}
          >
            {generalText?.backButtonText
              ? generalText?.backButtonText
              : "← Back"}
          </button>
        </>
      )}
      {error && !isLoading && (
        <div className="form-navigation mt-10 mb-10 float-left w-full">
          <button
            className="go btn btn-primary block float-right w-40"
            onClick={reloadPage}
          >
            {generalText?.finishButtonText
              ? generalText?.finishButtonText
              : "Finish"}
          </button>
        </div>
      )}
      {postStatus && !error && !isLoading && (
        <div className="form-wrapper form-2 mt-4">
          <h2 className="mb-8 font-normal">{sanityPost?.title}</h2>
          {selectedChapter ? (
            <SanityConflictPostChapter
              generalText={generalText}
              sanityPost={sanityPost}
              currentRepeaterIndex={currentRepeaterIndex}
              isLastChapter={
                choices.length &&
                choices.findIndex(
                  (choice) => choice?._id === selectedChapter,
                ) ===
                  choices.length - 1
              }
              setCurrentRepeaterIndex={setCurrentRepeaterIndex}
              nextChapter={nextChapter}
              backToChapters={backToChapters}
            />
          ) : (
            <SanityConflictPostChoices
              generalText={generalText}
              choices={choices}
              articleType={articleType}
              confirmedChoice={confirmedChoice}
              selectedChapter={selectedChapter}
              setConfirmedChoice={setConfirmedChoice}
              setSelectedChapter={setSelectedChapter}
              backToInitialForm={backToInitialForm}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SanityConflictPost;

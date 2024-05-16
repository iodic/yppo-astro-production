import React, { useState, useEffect, useMemo } from "react";
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
  const [initialContentViewed, setInitialContentViewed] = useState(false);
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
        }
      };

      fetchData();
    }
  }, [selectedChapter]);

  const isInitialContent = useMemo(() => {
    return Boolean(
      !selectedChapter &&
        !initialContentViewed &&
        (sanityPost?.content || sanityPost?.contentRepeater?.length),
    );
  }, [selectedChapter, sanityPost, initialContentViewed]);

  const isLastChapter = useMemo(() => {
    return Boolean(
      choices.length &&
        selectedChapter &&
        choices.findIndex((choice) => choice?._id === selectedChapter) ===
          choices.length - 1,
    );
  }, [choices, selectedChapter]);

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

  const handleChoicesBackAction = () => {
    window.scrollTo(0, 0);

    if (initialId !== confirmedChoice) {
      setConfirmedChoice(initialId);

      return;
    }

    if (initialContentViewed) {
      setInitialContentViewed(false);

      return;
    }

    backToInitialForm();
  };

  return (
    <div>
      {postStatus !== null && !postStatus && !error && (
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
      {error && (
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
      {postStatus && !error && (
        <div className="form-wrapper form-2 mt-4">
          <h2 className="mb-8 font-normal">{sanityPost?.title}</h2>
          {selectedChapter || isInitialContent ? (
            <SanityConflictPostChapter
              generalText={generalText}
              sanityPost={sanityPost}
              currentRepeaterIndex={currentRepeaterIndex}
              isLastChapter={isLastChapter}
              isInitialContent={isInitialContent}
              initialContentViewed={initialContentViewed}
              setInitialContentViewed={setInitialContentViewed}
              setCurrentRepeaterIndex={setCurrentRepeaterIndex}
              nextChapter={nextChapter}
              backToChapters={backToChapters}
              backToInitialForm={backToInitialForm}
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
              handleBackAction={handleChoicesBackAction}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SanityConflictPost;

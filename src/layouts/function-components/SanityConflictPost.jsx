import React, { useState, useEffect, useMemo, useCallback } from "react";
import { sanityFetch } from "@/lib/utils/sanityFetch";
import { SanityConflictPostChoices } from "@/layouts/function-components/SanityConflictPostChoices.jsx";
import { SanityConflictPostChapter } from "@/layouts/function-components/SanityConflictPostChapter.jsx";
import { BackBlockButton } from "@/layouts/function-components/BackBlockButton.jsx";
import { checkStatus } from "src/helper/helper.ts";
import LockedContent from "./LockedContent";
import { sanityClient } from "sanity:client";

const SanityConflictPost = ({
  initialId,
  backToInitialForm,
  lang,
  handlePageChange,
  backToIntro,
  getConflictGuideState,
  changeConflictGuideState,
}) => {
  const [pageData, setPageData] = useState([]);

  const [sanityPost, setSanityPost] = useState(null);
  const [choices, setChoices] = useState([]);
  const [subChoices, setSubChoices] = useState([]);
  const [articleType, setArticleType] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedChoice, setConfirmedChoice] = useState(
    getConflictGuideState("confirmedChoice", initialId),
  );
  const [selectedChapter, setSelectedChapter] = useState(
    getConflictGuideState("selectedChapter", null),
  );
  const [selectedSubChapter, setSelectedSubChapter] = useState(
    getConflictGuideState("selectedSubChapter", null),
  );
  const [currentRepeaterIndex, setCurrentRepeaterIndex] = useState(
    getConflictGuideState("currentRepeaterIndex", 0),
  );
  const [initialContentViewed, setInitialContentViewed] = useState(
    getConflictGuideState("initialContentViewed", false),
  );
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

      if (!selectedChapter && !selectedSubChapter) {
        setSanityPost(loadedPost[0]);
      }

      if (loadedPost && loadedPost[0]) {
        const status = await checkStatus(loadedPost[0]?.status);
        setPostStatus(status);
      }

      if (loadedPost[0].answers?.length) {
        const queries = loadedPost[0].answers.reduce(
          (prev, curr, index) =>
            `${prev}${prev.length ? "," : ""} "${index}": *[_type == 'conflictType' && _id == '${curr._ref}'][0]`,
          "",
        );

        const loadedAnswers = await sanityClient.fetch(`{ ${queries} }`);

        setChoices(Object.values(loadedAnswers));
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

  const fetchChapterData = async (selectedChapter, fetchSubChoices) => {
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

      if (fetchSubChoices) {
        if (loadedPost[0].answers?.length) {
          const queries = loadedPost[0].answers.reduce(
            (prev, curr, index) =>
              `${prev}${prev.length ? "," : ""} "${index}": *[_type == 'conflictType' && _id == '${curr._ref}'][0]`,
            "",
          );

          const loadedAnswers = await sanityClient.fetch(`{ ${queries} }`);

          setSubChoices(Object.values(loadedAnswers));
        } else {
          setSubChoices([]);
        }
      }

      if (
        (!selectedSubChapter && fetchSubChoices) ||
        (selectedSubChapter && !fetchSubChoices)
      ) {
        setSanityPost(loadedPost[0]);
      }
    } catch (error) {
      setError("Error fetching post");
    }
  };

  useEffect(() => {
    changeConflictGuideState({ confirmedChoice });

    if (confirmedChoice) {
      setPostStatus(null);
      fetchChoiceData();
    }
  }, [confirmedChoice]);

  useEffect(() => {
    changeConflictGuideState({ selectedChapter });

    if (selectedChapter) {
      setInitialContentViewed(true);
      fetchChapterData(selectedChapter, true);
    } else {
      fetchChoiceData();
    }
  }, [selectedChapter]);

  useEffect(() => {
    changeConflictGuideState({ selectedSubChapter });

    if (selectedSubChapter) {
      fetchChapterData(selectedSubChapter);
    }
  }, [selectedSubChapter]);

  useEffect(() => {
    changeConflictGuideState({ initialContentViewed });
  }, [initialContentViewed]);

  const isInitialContent = useMemo(() => {
    return Boolean(
      !selectedChapter &&
      !initialContentViewed &&
      (sanityPost?.content || sanityPost?.contentRepeater?.length),
    );
  }, [selectedChapter, sanityPost, initialContentViewed]);

  const isLastChapter = useMemo(() => {
    return Boolean(
      choices?.length &&
      selectedChapter &&
      choices.findIndex((choice) => choice?._id === selectedChapter) ===
      choices.length - 1,
    );
  }, [choices, selectedChapter]);

  const isLastSubChapter = useMemo(() => {
    return Boolean(
      subChoices?.length &&
      selectedSubChapter &&
      subChoices.findIndex((choice) => choice?._id === selectedSubChapter) ===
      subChoices?.length - 1,
    );
  }, [subChoices, selectedSubChapter]);

  const selectedChapterNumber = useMemo(() => {
    if (selectedChapter && choices?.length) {
      return choices.findIndex((choice) => choice._id === selectedChapter) + 1;
    }
  }, [selectedChapter, choices]);

  const selectedSubChapterNumber = useMemo(() => {
    if (selectedSubChapter && subChoices?.length) {
      return (
        subChoices.findIndex((choice) => choice._id === selectedSubChapter) + 1
      );
    }
  }, [selectedSubChapter, subChoices]);

  useEffect(() => {
    changeConflictGuideState({ currentRepeaterIndex });

    handlePageChange();
  }, [currentRepeaterIndex]);

  const reloadPage = () => {
    localStorage.removeItem("conflict-guide-state");
    window.location.reload();
  };

  const nextSubChapter = () => {
    const selectedSubChapterIndex = subChoices.findIndex(
      (choice) => choice._id === selectedSubChapter,
    );

    if (
      selectedSubChapterIndex >= 0 &&
      subChoices?.length - 1 > selectedSubChapterIndex &&
      subChoices[selectedSubChapterIndex + 1]
    ) {
      setSelectedSubChapter(subChoices[selectedSubChapterIndex + 1]._id);
      setCurrentRepeaterIndex(0);

      return;
    } else {
      setSelectedSubChapter();
      setCurrentRepeaterIndex(0);
      nextChapter();
    }
  };

  const nextChapter = useCallback(() => {
    const selectedChapterIndex = choices.findIndex(
      (choice) => choice._id === selectedChapter,
    );

    if (
      selectedChapterIndex >= 0 &&
      choices?.length - 1 > selectedChapterIndex &&
      choices[selectedChapterIndex + 1]
    ) {
      setSelectedChapter(choices[selectedChapterIndex + 1]._id);
      setCurrentRepeaterIndex(0);

      return;
    }

    reloadPage();
  }, [selectedChapter, choices, selectedSubChapter, subChoices]);

  const leaveSubChapters = () => {
    const lastChapterRepeaterIndex =
      choices.find((choice) => choice._id === selectedChapter)?.contentRepeater
        ?.length - 1;

    fetchChapterData(selectedChapter);
    setCurrentRepeaterIndex(lastChapterRepeaterIndex || 0);
    setSelectedSubChapter();
  };

  const backToChapters = () => {
    setSelectedChapter();
    setSelectedSubChapter();
    setSubChoices();
    setCurrentRepeaterIndex(0);
  };

  const handleLockedContentBack = () => {
    if (selectedSubChapter) {
      leaveSubChapters();

      return;
    }

    if (selectedChapter) {
      backToChapters();

      return;
    }

    handleChoicesBackAction();
  };

  const handleChoicesBackAction = () => {
    setCurrentRepeaterIndex(0);

    if (initialId !== confirmedChoice) {
      setConfirmedChoice(initialId);

      return;
    }

    if (
      initialContentViewed &&
      (sanityPost?.content || sanityPost?.contentRepeater?.length)
    ) {
      setInitialContentViewed(false);

      return;
    }

    setConfirmedChoice();
    backToInitialForm();
  };

  const handleBackBlockClick = () => {
    setCurrentRepeaterIndex(0);

    handlePageChange(() => {
      if (selectedChapter) {
        backToChapters();
        setSanityPost(null);
      } else {
        backToIntro();
      }
    });
  };

  return (
    <div className="conflict-post-container">
      {postStatus !== null && !postStatus && !error && (
        <>
          <BackBlockButton
            text={generalText?.toConflictGuideText}
            onClick={() => handlePageChange(backToIntro)}
            className="!mb-8"
          />

          <LockedContent lang={lang} client:load />

          <button
            className="go go-back btn float-left border-0 pl-0 pr-0"
            onClick={() => handlePageChange(handleLockedContentBack)}
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
          <BackBlockButton
            text={
              Boolean(selectedChapter)
                ? generalText?.toOverviewText
                : generalText?.toConflictGuideText
            }
            onClick={handleBackBlockClick}
            arrow={Boolean(selectedChapter)}
          />
          {sanityPost?.titlePrefix && isInitialContent && (
            <span className="text-sm font-normal uppercase">
              {sanityPost?.titlePrefix}
            </span>
          )}

          {selectedChapter && choices?.length && (
            <span className="text-sm font-normal uppercase">
              {`${generalText?.chapterText ? generalText?.chapterText : "Chapter"} ${selectedChapterNumber}${selectedSubChapterNumber ? `.${selectedSubChapterNumber}` : ""}`}
            </span>
          )}

          <h2 className="mb-8 font-normal">{sanityPost?.title}</h2>
          {selectedChapter || isInitialContent ? (
            <SanityConflictPostChapter
              generalText={generalText}
              sanityPost={sanityPost}
              currentRepeaterIndex={currentRepeaterIndex}
              isLastChapter={isLastChapter}
              isLastSubChapter={isLastSubChapter}
              isInitialContent={isInitialContent}
              initialContentViewed={initialContentViewed}
              setInitialContentViewed={setInitialContentViewed}
              setCurrentRepeaterIndex={setCurrentRepeaterIndex}
              nextChapter={nextChapter}
              nextSubChapter={nextSubChapter}
              backToChapters={backToChapters}
              leaveSubChapters={leaveSubChapters}
              backToInitialForm={backToInitialForm}
              handlePageChange={handlePageChange}
              subChoices={subChoices}
              selectedSubChapter={selectedSubChapter}
              setSelectedSubChapter={setSelectedSubChapter}
              selectedChapterNumber={selectedChapterNumber}
              setConfirmedChoice={setConfirmedChoice}
            />
          ) : (
            <SanityConflictPostChoices
              generalText={generalText}
              choices={choices}
              articleType={articleType}
              selectedChapter={selectedChapter}
              setConfirmedChoice={(choice) =>
                handlePageChange(() => setConfirmedChoice(choice))
              }
              setSelectedChapter={(chapter) =>
                handlePageChange(() => setSelectedChapter(chapter))
              }
              handleBackAction={() => handlePageChange(handleChoicesBackAction)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SanityConflictPost;

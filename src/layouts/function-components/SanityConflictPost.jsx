import React, { useState, useEffect, useMemo, useCallback } from "react";
import { sanityFetch } from "@/lib/utils/sanityFetch";
import { SanityConflictPostChoices } from "@/layouts/function-components/SanityConflictPostChoices.jsx";
import { SanityConflictPostChapter } from "@/layouts/function-components/SanityConflictPostChapter.jsx";
import { BackBlockButton } from "@/layouts/function-components/BackBlockButton.jsx";
import { checkStatus } from "src/helper/helper.ts";
import LockedContent from "./LockedContent";
import { sanityClient } from "sanity:client";

const SanityConflictPost = ({
  initialState,
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
    getConflictGuideState("confirmedChoice", initialState),
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
  const [currentSubRepeaterIndex, setCurrentSubRepeaterIndex] = useState(
    getConflictGuideState("currentSubRepeaterIndex", 0),
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
        query: `_id == '${confirmedChoice?._id}'`,
        lang,
      });

      if (!selectedChapter?._id && !selectedSubChapter?._id) {
        setSanityPost(loadedPost[0]);
      }

      if (loadedPost && loadedPost[0]) {
        const status = await checkStatus(
          loadedPost[0]?.status,
          loadedPost[0]?.enableChapterForPreview,
        );
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
        query: `_id == '${selectedChapter?._id}'`,
        lang,
      });

      if (loadedPost && loadedPost[0]) {
        const status = await checkStatus(
          loadedPost[0]?.status,
          loadedPost[0]?.enableChapterForPreview,
        );
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
        (!selectedSubChapter?._id && fetchSubChoices) ||
        (selectedSubChapter?._id && !fetchSubChoices)
      ) {
        setSanityPost(loadedPost[0]);
      }
    } catch (error) {
      setError("Error fetching post");
    }
  };

  useEffect(() => {
    changeConflictGuideState({
      confirmedChoice: confirmedChoice
        ? {
            _id: confirmedChoice?._id,
            title: confirmedChoice?.title,
          }
        : null,
    });

    if (confirmedChoice?._id) {
      setPostStatus(null);
      fetchChoiceData();
    }
  }, [confirmedChoice]);

  useEffect(() => {
    changeConflictGuideState({
      selectedChapter: selectedChapter
        ? {
            _id: selectedChapter?._id,
            title: selectedChapter?.title,
          }
        : null,
      currentRepeaterIndex: 0,
    });

    if (selectedChapter?._id) {
      setInitialContentViewed(true);
      fetchChapterData(selectedChapter, true);
    } else {
      fetchChoiceData();
    }
  }, [selectedChapter]);

  useEffect(() => {
    changeConflictGuideState({
      selectedSubChapter: selectedSubChapter
        ? {
            _id: selectedSubChapter?._id,
            title: selectedSubChapter?.title,
          }
        : null,
      currentSubRepeaterIndex: 0,
    });

    if (selectedSubChapter?._id) {
      fetchChapterData(selectedSubChapter);
    }
  }, [selectedSubChapter]);

  useEffect(() => {
    changeConflictGuideState({ initialContentViewed });
  }, [initialContentViewed]);

  const isInitialContent = useMemo(() => {
    return Boolean(
      !selectedChapter?._id &&
        !initialContentViewed &&
        (sanityPost?.content || sanityPost?.contentRepeater?.length),
    );
  }, [selectedChapter, sanityPost, initialContentViewed]);

  const isLastChapter = useMemo(() => {
    return Boolean(
      choices?.length &&
        selectedChapter?._id &&
        choices.findIndex((choice) => choice?._id === selectedChapter?._id) ===
          choices.length - 1,
    );
  }, [choices, selectedChapter]);

  const isLastSubChapter = useMemo(() => {
    return Boolean(
      subChoices?.length &&
        selectedSubChapter?._id &&
        subChoices.findIndex(
          (choice) => choice?._id === selectedSubChapter?._id,
        ) ===
          subChoices?.length - 1,
    );
  }, [subChoices, selectedSubChapter]);

  const selectedChapterNumber = useMemo(() => {
    if (selectedChapter?._id && choices?.length) {
      return (
        choices.findIndex((choice) => choice._id === selectedChapter?._id) + 1
      );
    }
  }, [selectedChapter, choices]);

  const selectedSubChapterNumber = useMemo(() => {
    if (selectedSubChapter?._id && subChoices?.length) {
      return (
        subChoices.findIndex(
          (choice) => choice._id === selectedSubChapter?._id,
        ) + 1
      );
    }
  }, [selectedSubChapter, subChoices]);

  useEffect(() => {
    if (currentRepeaterIndex > 0) {
      changeConflictGuideState({ currentRepeaterIndex });
    }

    handlePageChange();
  }, [currentRepeaterIndex]);

  useEffect(() => {
    if (currentSubRepeaterIndex > 0) {
      changeConflictGuideState({ currentSubRepeaterIndex });
    }

    handlePageChange();
  }, [currentSubRepeaterIndex]);

  const reloadPage = () => {
    localStorage.removeItem("conflict-guide-state");
    window.location.reload();
  };

  const nextSubChapter = () => {
    const selectedSubChapterIndex = subChoices.findIndex(
      (choice) => choice._id === selectedSubChapter?._id,
    );

    if (
      selectedSubChapterIndex >= 0 &&
      subChoices?.length - 1 > selectedSubChapterIndex &&
      subChoices[selectedSubChapterIndex + 1]
    ) {
      setSelectedSubChapter(subChoices[selectedSubChapterIndex + 1]);
      setCurrentSubRepeaterIndex(0);

      return;
    } else {
      setSelectedSubChapter(null);
      setCurrentSubRepeaterIndex(0);
      nextChapter();
    }
  };

  const nextChapter = useCallback(() => {
    const selectedChapterIndex = choices.findIndex(
      (choice) => choice._id === selectedChapter?._id,
    );

    if (
      selectedChapterIndex >= 0 &&
      choices?.length - 1 > selectedChapterIndex &&
      choices[selectedChapterIndex + 1]?._id
    ) {
      setSelectedChapter(choices[selectedChapterIndex + 1]);
      setCurrentSubRepeaterIndex(0);
      setCurrentRepeaterIndex(0);

      return;
    }

    reloadPage();
  }, [selectedChapter, choices, selectedSubChapter, subChoices]);

  const leaveSubChapters = () => {
    fetchChapterData(selectedChapter);
    setSelectedSubChapter(null);
  };

  const backToChapters = () => {
    setSelectedChapter(null);
    setSelectedSubChapter(null);
    setSubChoices();
    setCurrentSubRepeaterIndex(0);
    setCurrentRepeaterIndex(0);
  };

  const handleLockedContentBack = () => {
    if (selectedSubChapter?._id) {
      leaveSubChapters();

      return;
    }

    if (selectedChapter?._id) {
      backToChapters();

      return;
    }

    handleChoicesBackAction();
  };

  const handleChoicesBackAction = () => {
    setCurrentSubRepeaterIndex(0);
    setCurrentRepeaterIndex(0);

    if (confirmedChoice?._id && initialState?._id !== confirmedChoice?._id) {
      setConfirmedChoice(initialState);

      return;
    }

    if (
      initialContentViewed &&
      (sanityPost?.content || sanityPost?.contentRepeater?.length)
    ) {
      setInitialContentViewed(false);

      return;
    }

    setConfirmedChoice(null);
    backToInitialForm();
  };

  const handleBackBlockClick = () => {
    setCurrentSubRepeaterIndex(0);
    setCurrentRepeaterIndex(0);

    handlePageChange(() => {
      if (selectedChapter?._id) {
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
              Boolean(selectedChapter?._id)
                ? generalText?.toOverviewText
                : generalText?.toConflictGuideText
            }
            onClick={handleBackBlockClick}
            arrow={Boolean(selectedChapter?._id)}
          />

          {sanityPost?.titlePrefix && isInitialContent && (
            <span className="text-sm font-normal uppercase">
              {sanityPost?.titlePrefix}
            </span>
          )}

          {selectedChapter?._id && choices?.length && (
            <span className="text-sm font-normal uppercase">
              {`${generalText?.chapterText ? generalText?.chapterText : "Chapter"} ${selectedChapterNumber}${selectedSubChapterNumber ? `.${selectedSubChapterNumber}` : ""}`}
            </span>
          )}

          <h2 className="mb-8 font-normal">{sanityPost?.title}</h2>
          {sanityPost?.tableTitle && articleType && (
            <p className="text-sm font-normal uppercase mb-3">
              {sanityPost?.tableTitle}
            </p>
          )}
          {selectedChapter?._id || isInitialContent ? (
            <SanityConflictPostChapter
              generalText={generalText}
              sanityPost={sanityPost}
              currentRepeaterIndex={currentRepeaterIndex}
              currentSubRepeaterIndex={currentSubRepeaterIndex}
              isLastChapter={isLastChapter}
              isLastSubChapter={isLastSubChapter}
              isInitialContent={isInitialContent}
              initialContentViewed={initialContentViewed}
              setInitialContentViewed={setInitialContentViewed}
              setCurrentRepeaterIndex={setCurrentRepeaterIndex}
              setCurrentSubRepeaterIndex={setCurrentSubRepeaterIndex}
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

import { useMemo, useState } from "react";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import SanityVideoComponent from "@/layouts/function-components/SanityVideoComponent.jsx";
import { SanityConflictPostChoices } from "@/layouts/function-components/SanityConflictPostChoices.jsx";
import TradeOff from "@/layouts/function-components/TradeOff.jsx";
import portableTextComponents from "../portable-text-components";
import { sanityClient } from "sanity:client";

export const SanityConflictPostChapter = ({
  generalText,
  sanityPost,
  currentRepeaterIndex,
  currentSubRepeaterIndex,
  isLastChapter,
  isLastSubChapter,
  isInitialContent,
  initialContentViewed,
  setInitialContentViewed,
  setCurrentRepeaterIndex,
  setCurrentSubRepeaterIndex,
  nextChapter,
  nextSubChapter,
  backToChapters,
  leaveSubChapters,
  backToInitialForm,
  handlePageChange,
  subChoices,
  selectedSubChapter,
  setSelectedSubChapter,
  selectedChapterNumber,
  setConfirmedChoice,
}) => {
  const builder = imageUrlBuilder(sanityClient);

  const [isFinishAction, setIsFinishAction] = useState(false);

  const isRepeaterContent = useMemo(() => {
    return sanityPost?.contentRepeater?.length;
  }, [sanityPost]);

  const {
    prosSection,
    consSection,
    blocks,
    content,
    videoUrl,
    videoPoster,
    videoTranscriptRepeater,
  } = useMemo(() => {
    return sanityPost
      ? isRepeaterContent
        ? sanityPost.contentRepeater[
            selectedSubChapter ? currentSubRepeaterIndex : currentRepeaterIndex
          ]
        : sanityPost
      : {};
  }, [sanityPost, currentRepeaterIndex, currentSubRepeaterIndex]);

  const nextButtonText = useMemo(() => {
    setIsFinishAction(false);

    if (!isInitialContent) {
      if (
        isLastChapter &&
        ((selectedSubChapter?._id && isLastSubChapter) ||
          !selectedSubChapter?._id)
      ) {
        if (
          (isRepeaterContent &&
            sanityPost?.contentRepeater?.length - 1 ===
              (selectedSubChapter
                ? currentSubRepeaterIndex
                : currentRepeaterIndex)) ||
          !isRepeaterContent
        ) {
          setIsFinishAction(true);

          return generalText?.finishButtonText
            ? generalText?.finishButtonText
            : "Finish";
        }
      } else {
        if (
          (isRepeaterContent &&
            sanityPost?.contentRepeater?.length - 1 ===
              (selectedSubChapter
                ? currentSubRepeaterIndex
                : currentRepeaterIndex)) ||
          !isRepeaterContent
        ) {
          return generalText?.nextChapterText
            ? generalText?.nextChapterText
            : "Next chapter";
        }
      }
    }

    return generalText?.nextButtonText ? generalText?.nextButtonText : "Next";
  }, [sanityPost, currentRepeaterIndex, currentSubRepeaterIndex]);

  const handleNextAction = () => {
    if (
      isInitialContent &&
      ((sanityPost?.contentRepeater?.length &&
        sanityPost?.contentRepeater?.length - 1 ===
          (selectedSubChapter
            ? currentSubRepeaterIndex
            : currentRepeaterIndex)) ||
        sanityPost?.content)
    ) {
      setInitialContentViewed(true);
      setCurrentSubRepeaterIndex(0);
      setCurrentRepeaterIndex(0);

      return;
    }

    if (
      sanityPost?.contentRepeater?.length &&
      sanityPost?.contentRepeater?.length - 1 >
        (selectedSubChapter ? currentSubRepeaterIndex : currentRepeaterIndex)
    ) {
      if (selectedSubChapter) {
        setCurrentSubRepeaterIndex(currentSubRepeaterIndex + 1);
      } else {
        setCurrentRepeaterIndex(currentRepeaterIndex + 1);
      }

      return;
    }

    if (selectedSubChapter?._id) {
      nextSubChapter();
    } else {
      nextChapter();
    }
  };

  const handleBackAction = () => {
    setIsFinishAction(false);

    if (
      sanityPost?.contentRepeater?.length &&
      (selectedSubChapter ? currentSubRepeaterIndex : currentRepeaterIndex) > 0
    ) {
      if (selectedSubChapter) {
        setCurrentSubRepeaterIndex(currentSubRepeaterIndex - 1);
      } else {
        setCurrentRepeaterIndex(currentRepeaterIndex - 1);
      }

      return;
    }

    if (!initialContentViewed) {
      setConfirmedChoice(null);
      backToInitialForm();

      return;
    }

    if (selectedSubChapter?._id) {
      leaveSubChapters();
    } else {
      backToChapters();
    }
  };

  return (
    <>
      <div>
        {prosSection && <TradeOff content={prosSection} type="PROS" />}
        {consSection && <TradeOff content={consSection} type="CONS" />}
      </div>
      <div>
        <PortableText
          value={isRepeaterContent ? blocks : content}
          components={portableTextComponents}
        />
        {videoUrl && videoPoster && (
          <div>
            <SanityVideoComponent
              videoUrl={videoUrl}
              videoPoster={builder.image(videoPoster).url()}
              videoTranscriptRepeater={videoTranscriptRepeater}
              generalText={generalText}
              client:load
            />
          </div>
        )}
      </div>
      {Boolean(
        !selectedSubChapter?._id &&
          subChoices?.length &&
          sanityPost?.contentRepeater?.length >= 0 &&
          sanityPost?.contentRepeater?.length - 1 ===
            (selectedSubChapter
              ? currentSubRepeaterIndex
              : currentRepeaterIndex),
      ) && (
        <SanityConflictPostChoices
          generalText={generalText}
          choices={subChoices}
          articleType={true}
          selectedChapter={selectedSubChapter}
          selectedChapterNumber={selectedChapterNumber}
          setSelectedChapter={(chapter) =>
            handlePageChange(() => setSelectedSubChapter(chapter))
          }
        />
      )}
      <div className="form-navigation clear-both">
        {Boolean(
          !subChoices?.length ||
            (subChoices?.length && selectedSubChapter?._id),
        ) && (
          <button
            className="go btn btn-primary block float-right"
            onClick={() => handlePageChange(handleNextAction, isFinishAction)}
          >
            {nextButtonText}
          </button>
        )}

        <button
          className="go btn float-left border-0 pl-0 pr-0"
          onClick={() => handlePageChange(handleBackAction)}
        >
          {generalText?.backButtonText ? generalText?.backButtonText : "← Back"}
        </button>
      </div>
    </>
  );
};

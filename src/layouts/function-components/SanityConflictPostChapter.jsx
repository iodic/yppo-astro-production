import { useMemo } from "react";
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
  isLastChapter,
  isLastSubChapter,
  isInitialContent,
  initialContentViewed,
  setInitialContentViewed,
  setCurrentRepeaterIndex,
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
}) => {
  const builder = imageUrlBuilder(sanityClient);

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
        ? sanityPost.contentRepeater[currentRepeaterIndex]
        : sanityPost
      : {};
  }, [sanityPost, currentRepeaterIndex]);

  const nextButtonText = useMemo(() => {
    if (!isInitialContent) {
      if (
        isLastChapter &&
        ((selectedSubChapter && isLastSubChapter) || !selectedSubChapter)
      ) {
        if (
          (isRepeaterContent &&
            sanityPost?.contentRepeater?.length - 1 === currentRepeaterIndex) ||
          !isRepeaterContent
        ) {
          return generalText?.finishButtonText
            ? generalText?.finishButtonText
            : "Finish";
        }
      } else {
        if (
          (isRepeaterContent &&
            sanityPost?.contentRepeater?.length - 1 === currentRepeaterIndex) ||
          !isRepeaterContent
        ) {
          return generalText?.nextChapterText
            ? generalText?.nextChapterText
            : "Next chapter";
        }
      }
    }

    return generalText?.nextButtonText ? generalText?.nextButtonText : "Next";
  }, [sanityPost, currentRepeaterIndex]);

  const handleNextAction = () => {
    if (
      isInitialContent &&
      ((sanityPost?.contentRepeater?.length &&
        sanityPost?.contentRepeater?.length - 1 === currentRepeaterIndex) ||
        sanityPost?.content)
    ) {
      setInitialContentViewed(true);
      setCurrentRepeaterIndex(0);

      return;
    }

    if (
      sanityPost?.contentRepeater?.length &&
      sanityPost?.contentRepeater?.length - 1 > currentRepeaterIndex
    ) {
      setCurrentRepeaterIndex(currentRepeaterIndex + 1);

      return;
    }

    if (selectedSubChapter) {
      nextSubChapter();
    } else {
      nextChapter();
    }
  };

  const handleBackAction = () => {
    if (sanityPost?.contentRepeater?.length && currentRepeaterIndex > 0) {
      setCurrentRepeaterIndex(currentRepeaterIndex - 1);

      return;
    }

    if (!initialContentViewed) {
      backToInitialForm();

      return;
    }

    if (selectedSubChapter) {
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
        !selectedSubChapter &&
          subChoices?.length &&
          sanityPost?.contentRepeater?.length >= 0 &&
          sanityPost?.contentRepeater?.length - 1 === currentRepeaterIndex,
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
        <button
          className="go btn btn-primary block float-right"
          onClick={() => handlePageChange(handleNextAction)}
        >
          {nextButtonText}
        </button>
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

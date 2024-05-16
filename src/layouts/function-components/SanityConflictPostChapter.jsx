import { useMemo } from "react";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import SanityVideoComponent from "@/layouts/function-components/SanityVideoComponent.jsx";
import TradeOff from "@/layouts/function-components/TradeOff.jsx";
import portableTextComponents from "../portable-text-components";
import { sanityClient } from "sanity:client";

export const SanityConflictPostChapter = ({
  generalText,
  sanityPost,
  currentRepeaterIndex,
  isLastChapter,
  isInitialContent,
  initialContentViewed,
  setInitialContentViewed,
  setCurrentRepeaterIndex,
  nextChapter,
  backToChapters,
  backToInitialForm,
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
      if (isLastChapter) {
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
    window.scrollTo(0, 0);

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

    nextChapter();
  };

  const handleBackAction = () => {
    window.scrollTo(0, 0);

    if (sanityPost?.contentRepeater?.length && currentRepeaterIndex > 0) {
      setCurrentRepeaterIndex(currentRepeaterIndex - 1);

      return;
    }

    if (!initialContentViewed) {
      backToInitialForm();

      return;
    }

    backToChapters();
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
            />
          </div>
        )}
      </div>
      <div className="form-navigation clear-both">
        <button
          className="go btn btn-primary block float-right"
          onClick={handleNextAction}
        >
          {nextButtonText}
        </button>
        <button
          className="go btn float-left border-0 pl-0 pr-0"
          onClick={handleBackAction}
        >
          {generalText?.backButtonText ? generalText?.backButtonText : "← Back"}
        </button>
      </div>
    </>
  );
};

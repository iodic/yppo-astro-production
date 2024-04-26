import React, { useState, useEffect } from "react";
import { sanityClient } from "sanity:client";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import SanityVideoComponent from "@/layouts/function-components/SanityVideoComponent.jsx";
import TradeOff from "@/layouts/function-components/TradeOff.jsx";
import portableTextComponents from "../portable-text-components";

const SanityConflictPost = ({ initialId }) => {
  const [id, setId] = useState(initialId);
  const [sanityPost, setSanityPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [sanityPostAnswers, setSanityPostAnswers] = useState([]);
  const [guideEnd, setGuideEnd] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showBlockContent, setShowBlockContent] = useState(false);
  const [articleType, setArticleType] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentRepeaterIndex, setCurrentRepeaterIndex] = useState(0);

  const builder = imageUrlBuilder(sanityClient);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const loadedPost = await sanityClient.fetch(
            `*[_type == 'conflictType' && _id == '${id}'][0]`,
          );

          setSanityPost(loadedPost);

          const fetchedAnswers = [];
          if (loadedPost.hasOwnProperty("answers")) {
            for (const element of loadedPost.answers) {
              const loadedPost = await sanityClient.fetch(
                `*[_type == 'conflictType' && _id == '${element._ref}'][0]`,
              );
              fetchedAnswers.push(loadedPost);
            }
            setSanityPostAnswers(fetchedAnswers);
          }

          setGuideEnd(
            !loadedPost?.answers && !loadedPost?.contentRepeater?.length,
          );

          if (loadedPost.content) {
            setShowBlockContent(false);
          } else {
            setShowBlockContent(true);
          }

          if (loadedPost.articleType) {
            setArticleType(true);
          } else {
            setArticleType(false);
          }

          localStorage.setItem("latestConflictType", id);

          setLoading(false);
          setShouldRender(true);
        } catch (error) {
          setError("Error fetching post");
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [!loading, currentRepeaterIndex]);

  const reloadPage = () => {
    localStorage.setItem("latestConflictType", "");
    window.location.reload();
  };

  if (!shouldRender) {
    return null;
  }

  if (error) {
    return (
      <div className="form-navigation mt-10 mb-10 float-left w-full">
        <button
          className="go go-forward btn btn-primary block float-right w-40 "
          onClick={reloadPage}
        >
          Finish
        </button>
      </div>
    );
  }

  if (!sanityPost) {
    return null;
  }

  const handleNextButtonClick = () => {
    const conflictTypeHistory =
      JSON.parse(localStorage.getItem("conflictTypeHistory")) || [];
    conflictTypeHistory.push(id);
    localStorage.setItem(
      "conflictTypeHistory",
      JSON.stringify(conflictTypeHistory),
    );
    if (answer) {
      setId(answer);
      setShowBlockContent(false);
      setSanityPostAnswers([]);
    }
  };

  const handleBackAction = () => {
    const conflictTypeHistory =
      JSON.parse(localStorage.getItem("conflictTypeHistory")) || [];

    const previousPage = conflictTypeHistory.pop();

    if (0 === conflictTypeHistory.length) {
      localStorage.setItem("latestConflictType", "");
      window.location.reload();
    }
    localStorage.setItem(
      "conflictTypeHistory",
      JSON.stringify(conflictTypeHistory),
    );

    setId(previousPage);
    setShowBlockContent(false);
    setSanityPostAnswers([]);
  };

  function calculateReadTime(content) {
    let fullText = "";
    if (content) {
      content.map((text) => (fullText += text.children[0].text));
      if (fullText) {
        const wordsPerMinute = 180;
        const words = fullText.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes + " min";
      }
    }
  }

  const isRepeaterContent = sanityPost.contentRepeater?.length;
  const hiddenClass = showBlockContent && !isRepeaterContent ? "" : "hidden";
  const hiddenContent = showBlockContent && !isRepeaterContent ? "hidden" : "";
  let prosSection,
    consSection,
    blocks,
    videoUrl,
    videoPoster,
    videoTranscriptRepeater;

  if (sanityPost) {
    if (isRepeaterContent) {
      prosSection =
        sanityPost.contentRepeater[currentRepeaterIndex]?.prosSection;
      consSection =
        sanityPost.contentRepeater[currentRepeaterIndex]?.consSection;
      blocks = sanityPost.contentRepeater[currentRepeaterIndex]?.blocks;
      videoUrl = sanityPost.contentRepeater[currentRepeaterIndex]?.videoUrl;
      videoPoster =
        sanityPost.contentRepeater[currentRepeaterIndex]?.videoPoster;
      videoTranscriptRepeater =
        sanityPost.contentRepeater[currentRepeaterIndex]
          ?.videoTranscriptRepeater;
    } else {
      prosSection = sanityPost.prosSection;
      consSection = sanityPost.consSection;
      blocks = sanityPost.content;
      videoUrl = sanityPost.videoUrl;
      videoPoster = sanityPost.videoPoster;
      videoTranscriptRepeater = sanityPost.videoTranscriptRepeater;
    }
  }

  return (
    <div>
      <div
        className="form-wrapper form-2 mt-4"
        key={`sanityPost_${sanityPost._id}`}
      >
        <h2 className="mb-8 font-normal">{sanityPost.title}</h2>
        {sanityPost && (
          <>
            <div className={`${hiddenContent}`}>
              {prosSection && <TradeOff content={prosSection} type="PROS" />}
              {consSection && <TradeOff content={consSection} type="CONS" />}
            </div>
            <div className={`${hiddenContent}`}>
              <PortableText
                value={blocks}
                components={portableTextComponents}
              />
              {videoUrl && videoPoster && (
                <div className={`${hiddenContent}`}>
                  <SanityVideoComponent
                    videoUrl={videoUrl}
                    videoPoster={builder.image(videoPoster).url()}
                    videoTranscriptRepeater={videoTranscriptRepeater}
                  />
                </div>
              )}
              {guideEnd ||
              (isRepeaterContent &&
                currentRepeaterIndex ===
                  sanityPost.contentRepeater.length - 1) ? (
                <div className="form-navigation mt-10 mb-10 float-left w-full">
                  <button
                    className="go go-forward btn btn-primary block float-right w-40 "
                    onClick={reloadPage}
                  >
                    Finish
                  </button>
                  <button
                    className="go go-back btn float-left border-0 pl-0 pr-0"
                    onClick={() =>
                      isRepeaterContent && currentRepeaterIndex > 0
                        ? setCurrentRepeaterIndex(currentRepeaterIndex - 1)
                        : handleBackAction()
                    }
                  >
                    ← Back
                  </button>
                </div>
              ) : (
                <div className="form-navigation clear-both">
                  <button
                    className={`go go-forward btn btn-primary block float-right w-40 ${hiddenContent}`}
                    onClick={() =>
                      isRepeaterContent &&
                      currentRepeaterIndex <
                        sanityPost.contentRepeater.length - 1
                        ? setCurrentRepeaterIndex(currentRepeaterIndex + 1)
                        : setShowBlockContent(true)
                    }
                  >
                    Next
                  </button>
                  <button
                    className={`go go-back btn float-left border-0 pl-0 pr-0 ${hiddenContent}`}
                    onClick={() =>
                      isRepeaterContent && currentRepeaterIndex > 0
                        ? setCurrentRepeaterIndex(currentRepeaterIndex - 1)
                        : handleBackAction()
                    }
                  >
                    ← Back
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        {showBlockContent &&
          sanityPostAnswers.map((post, index) => (
            <div key={`root_${post._id}`}>
              {articleType ? (
                <div key={`nest_${post._id}`}>
                  <div
                    className={`form-group reading-group flex items-start w-full rounded ${selectedAnswer === post._id ? "card-highlight" : ""}`}
                    key={`question_${post._id}`}
                  >
                    <span className="lg:top-1 relative w-7 min-w-7 h-7 flex items-center justify-center border-2 border-circle-gray rounded-full text-center bg-white">
                      {index + 1}
                    </span>
                    <label className="ml-2 grow" htmlFor={post._id}>
                      {post.title}
                      <span className="text-sm block">
                        {calculateReadTime(post.content)}
                      </span>
                    </label>
                    <input
                      type="radio"
                      name="issue-type"
                      id={post._id}
                      className="hidden"
                      onChange={() => {
                        setAnswer(post._id);
                        setSelectedAnswer(post._id);
                      }}
                    />
                    <span className="font-semibold text-xl leading-normal">
                      &gt;
                    </span>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          ))}
      </div>
      <div className="form-navigation clear-both">
        <button
          className={`go go-forward btn btn-primary block float-right w-40 ${hiddenClass}`}
          onClick={() => (guideEnd ? reloadPage() : handleNextButtonClick())}
        >
          {guideEnd ? "Finish" : "Next"}
        </button>
        <button
          className={`go go-back btn float-left border-0 pl-0 pr-0 ${hiddenClass}`}
          onClick={() => handleBackAction()}
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default SanityConflictPost;

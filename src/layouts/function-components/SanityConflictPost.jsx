import React, { useState, useEffect } from "react";
import { sanityClient } from "sanity:client";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import SanityVideoComponent from "@/layouts/function-components/SanityVideoComponent.jsx";
import TradeOff from "@/layouts/function-components/TradeOff.jsx";

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
          } else {
            setGuideEnd(true);
          }

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
  }, [!loading]);

  const reloadPage = () => {
    window.location.reload();
  };

  if (!shouldRender) {
    return null;
  }

  if (error) {
    return (
      <div className="form-navigation mt-10 mb-10 float-left w-full">
        <a
          className="go go-forward btn btn-primary block float-right w-40"
          href="#"
          onClick={reloadPage}
        >
          Finish
        </a>
      </div>
    );
  }

  if (!sanityPost) {
    return null;
  }

  const handleNextButtonClick = () => {
    if (answer) {
      setId(answer);
      setShowBlockContent(false);
      setSanityPostAnswers([]);
    }
  };

  const hiddenClass = showBlockContent ? "" : "hidden";
  const hiddenContent = showBlockContent ? "hidden" : "";

  return (
    <div>
      <div className="form-wrapper form-2 mt-4">
        <h2 className="mb-8 font-normal">{sanityPost.title}</h2>
        <div className={`${hiddenContent}`}>
          {sanityPost.prosSection && (
            <TradeOff content={sanityPost.prosSection} type="PROS" />
          )}
          {sanityPost.consSection && (
            <TradeOff content={sanityPost.consSection} type="CONS" />
          )}
        </div>
        {sanityPost.content && (
          <>
            <BlockContent
              blocks={sanityPost.content}
              className={`${hiddenContent}`}
            />
            {sanityPost && sanityPost.videoUrl && sanityPost.videoPoster && (
              <div className={`${hiddenContent}`}>
                <SanityVideoComponent
                  videoUrl={sanityPost.videoUrl}
                  videoPoster={builder.image(sanityPost.videoPoster).url()}
                />
              </div>
            )}
            {!guideEnd ? (
              <div className="form-navigation clear-both">
                <button
                  className={`go go-forward btn btn-primary mt-10 block float-right w-40 ${hiddenContent}`}
                  onClick={() => setShowBlockContent(true)}
                >
                  Next
                </button>
              </div>
            ) : (
              <div className="form-navigation mt-10 mb-10 float-left w-full">
                <a
                  className="go go-forward btn btn-primary block float-right w-40"
                  href="#"
                  onClick={reloadPage}
                >
                  Finish
                </a>
              </div>
            )}
          </>
        )}
        {showBlockContent &&
          sanityPostAnswers.map((post) => (
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
      </div>
      <div className="form-navigation clear-both">
        <button
          className={`go go-forward btn btn-primary mt-10 block float-right w-40 ${hiddenClass}`}
          onClick={() => handleNextButtonClick()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SanityConflictPost;

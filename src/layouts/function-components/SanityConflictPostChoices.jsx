import { useEffect, useState } from "react";
import { checkStatus } from "src/helper/helper.ts";

export const SanityConflictPostChoices = ({
  generalText,
  choices,
  articleType,
  selectedChapter,
  setConfirmedChoice,
  setSelectedChapter,
  handleBackAction,
  selectedChapterNumber,
}) => {
  const [selectedChoice, setSelectedChoice] = useState();
  const [lockedChoices, setLockedChoices] = useState([]);

  const handleNextAction = () => {
    if (!articleType) {
      setConfirmedChoice(selectedChoice);
    }
  };

  useEffect(() => {
    setLockedChoices([]);

    const checkChoices = async () => {
      const ids = [];

      for (const choice of choices) {
        const isNotLocked = await checkStatus(choice?.status, choice?.enableChapterForPreview);

        if (!isNotLocked) {
          ids.push(choice._id);
        }
      }

      setLockedChoices(ids);
    };

    checkChoices();
  }, [choices]);

  return (
    <>
      {choices.map(
        (post, index) =>
          post && (
            <div className="relative" key={`root_${post._id}`}>
              {articleType ? (
                <div key={`nest_${post._id}`}>
                  <div
                    className={`form-group reading-group flex items-center w-full rounded ${selectedChoice === post._id ? "card-highlight" : ""}`}
                    key={`question_${post._id}`}
                  >
                    <span className="relative w-10 min-w-10 h-10 flex items-center justify-center border-2 border-circle-gray rounded-full text-center bg-white">
                      {selectedChapterNumber && (
                        <span>{selectedChapterNumber}.</span>
                      )}
                      {index + 1}
                    </span>
                    <label className="ml-2 grow" htmlFor={post._id}>
                      {post.title}
                    </label>
                    <input
                      type="radio"
                      name="issue-type"
                      id={post._id}
                      className="hidden"
                      onChange={() => {
                        setSelectedChoice(post._id);

                        if (articleType && !selectedChapter) {
                          setSelectedChapter(post._id);
                        }
                      }}
                    />
                    {!lockedChoices.includes(post._id) && (
                      <span className="font-semibold text-xl leading-normal">
                        &gt;
                      </span>
                    )}
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
                    onChange={() => setSelectedChoice(post._id)}
                  />
                  <label
                    className="ml-2 real-deal chapter-choice"
                    htmlFor={post._id}
                  >
                    {post.title}
                  </label>
                </div>
              )}
              {lockedChoices.includes(post._id) && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <img src="/images/icons/lock.svg" className="w-6" />
                </div>
              )}
            </div>
          ),
      )}
      <div className="form-navigation clear-both">
        {!articleType && (
          <button
            className="go btn btn-primary block float-right"
            onClick={handleNextAction}
          >
            {generalText?.nextButtonText ? generalText?.nextButtonText : "Next"}
          </button>
        )}
        {handleBackAction && (
          <button
            className="go btn float-left border-0 pl-0 pr-0"
            onClick={handleBackAction}
          >
            {generalText?.backButtonText
              ? generalText?.backButtonText
              : "← Back"}
          </button>
        )}
      </div>
    </>
  );
};

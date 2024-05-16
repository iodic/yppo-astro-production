import { useState } from "react";
import { calculateReadTime } from "src/helper/helper.ts";

export const SanityConflictPostChoices = ({
  generalText,
  choices,
  articleType,
  selectedChapter,
  setConfirmedChoice,
  setSelectedChapter,
  backToInitialForm,
}) => {
  const [selectedChoice, setSelectedChoice] = useState();

  const handleNextAction = () => {
    if (!articleType) {
      setConfirmedChoice(selectedChoice);
    }

    if (articleType && !selectedChapter) {
      setSelectedChapter(selectedChoice);
    }

    window.scrollTo(0, 0);
  };

  return (
    <>
      {choices.map(
        (post, index) =>
          post && (
            <div key={`root_${post._id}`}>
              {articleType ? (
                <div key={`nest_${post._id}`}>
                  <div
                    className={`form-group reading-group flex items-start w-full rounded ${selectedChoice === post._id ? "card-highlight" : ""}`}
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
                        setSelectedChoice(post._id);
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
            </div>
          ),
      )}
      <div className="form-navigation clear-both">
        <button
          className="go btn btn-primary block float-right w-40"
          onClick={handleNextAction}
        >
          {generalText?.nextButtonText ? generalText?.nextButtonText : "Next"}
        </button>
        <button
          className="go btn float-left border-0 pl-0 pr-0"
          onClick={backToInitialForm}
        >
          {generalText?.backButtonText ? generalText?.backButtonText : "← Back"}
        </button>
      </div>
    </>
  );
};

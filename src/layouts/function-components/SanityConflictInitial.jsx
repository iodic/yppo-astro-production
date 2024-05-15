import React, { useState, useEffect } from "react";
import SanityConflictPost from "@/layouts/function-components/SanityConflictPost.jsx";
import { sanityFetch } from "@/lib/utils/sanityFetch";

const SanityConflictInitial = ({ lang }) => {
  const [answer, setAnswer] = useState("");
  const [submitFormAnswer, setSubmitFormAnswer] = useState("");
  const [sanityInitialPosts, setSanityInitialPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialPosts = await sanityFetch({
          type: "conflictType",
          lang,
          query: "initialQuestion == true",
          object: `{
            ...,
            'conflictType': conflictType[]->{
              slug,
              title
            },
        }`,
        });

        setSanityInitialPosts(initialPosts);
      } catch (error) {
        setError("Error fetching initial posts");
      }
    };

    fetchData();

    const latestStorage = localStorage.getItem("latestConflictType");
    if (latestStorage) {
      setSubmitFormAnswer(latestStorage);
    }
  }, []);

  const handleNextButtonClick = () => {
    if (answer) {
      localStorage.setItem("conflictTypeHistory", JSON.stringify([answer]));
      setSubmitFormAnswer(answer);
      setSanityInitialPosts([]);
    }
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      {submitFormAnswer ? (
        <SanityConflictPost
          initialId={submitFormAnswer}
          lang={lang}
          client:load
        />
      ) : (
        sanityInitialPosts.length > 0 && (
          <div className="form-wrapper hidden form-1 mt-4">
            <h2 className="mb-8 font-normal">What's the issue about?</h2>
            {sanityInitialPosts.map((post) => (
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

            <div className="form-navigation clear-both">
              <button
                className="go go-forward btn btn-primary mt-10 block float-right w-40"
                onClick={handleNextButtonClick}
              >
                Next
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SanityConflictInitial;

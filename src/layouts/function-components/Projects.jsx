import { useEffect, useState } from "react";
import { sanityClient } from "sanity:client";
import { sanityFetch } from "@/utils/sanityFetch";

const Projects = ({ lang } = {}) => {
  const [selectedConflictType, setSelectedConflictType] = useState();
  const [projects, setProjects] = useState([]);
  const [conflictChoices, setConflictChoices] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const projectsData = await sanityFetch(
        "wiki",
        lang,
        "en",
        `| order(orderRank){
            ...,
            'conflictType': conflictType[]->{
              slug,
              title
            },
        }`,
      );

      setProjects(projectsData);

      const posts = await sanityClient.fetch(
        `*[_type == 'conflictType'] | order(_createdAt desc)`,
      );
      const fetchedConflictChoices = {};

      for (let post of posts) {
        if (post?.answers?.length) {
          const queries = post.answers.reduce(
            (prev, curr, index) =>
              `${prev}${prev.length ? "," : ""} "${index}": *[_type == 'conflictType' && _id == '${curr._ref}'][0]`,
            "",
          );

          const loadedAnswers = await sanityClient.fetch(`{ ${queries} }`);

          for (let answer of Object.values(loadedAnswers)) {
            if (post?.slug?.current) {
              if (
                Array.isArray(fetchedConflictChoices[post.slug.current]) &&
                fetchedConflictChoices[post.slug.current].length
              ) {
                fetchedConflictChoices[post.slug.current].push(answer);
              } else {
                fetchedConflictChoices[post.slug.current] = [answer];
              }
            }
          }
        }
      }

      setConflictChoices(fetchedConflictChoices);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedConflictType) {
    }
  }, [selectedConflictType]);

  return (
    <div className="col-12">
      <div className="row">
        {projects &&
          projects.map((project, index) => (
            <div className="col-12" key={index}>
              <div className="flex items-center space-x-6 rounded-lg bg-[#fafafa] px-6 py-8 mt-6">
                <div className="relative inline-flex h-24 w-24 items-center justify-center p-3">
                  <span className="project-icon text-2xl font-semibold text-[#FA7398]">
                    {index + 1}
                  </span>
                  <svg
                    className="absolute left-0 top-0 h-full w-full"
                    width="90"
                    height="90"
                    viewBox="0 0 90 90"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.1"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M42.8833 0.00928958C63.2143 -0.38584 82.2759 11.853 88.3264 31.1979C94.1797 49.9121 84.027 68.9907 68.0244 80.3913C52.4387 91.4948 31.5679 93.9094 16.0849 82.6642C0.66775 71.4667 -3.27813 50.9537 2.58684 32.8642C8.48561 14.6704 23.699 0.382132 42.8833 0.00928958Z"
                      fill="#FFCC99"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 className="h5 font-primary">{project.title}</h3>
                  <p className="mt-4">{project.description}</p>
                  <ol
                    className="subitems list-decimal list-outside pl-5 mb-3"
                    key={`${index}_${project._id}`}
                  >
                    {project.conflictType &&
                      project.conflictType.map((conflict) => (
                        <li key={conflict.slug.current}>
                          {Object.keys(conflictChoices).length &&
                            !conflictChoices[conflict.slug.current]?.length ? (
                            <a
                              className="toggle cursor-pointer hover:text-[#f3873c]"
                              href={`wiki/${conflict.slug.current}`}
                            >
                              {conflict.title}
                            </a>
                          ) : (
                            <a
                              className="toggle cursor-pointer hover:text-[#f3873c]"
                              onClick={() => {
                                setSelectedConflictType(
                                  selectedConflictType === conflict.slug.current
                                    ? undefined
                                    : conflict.slug.current,
                                );
                              }}
                            >
                              {conflict.title}
                            </a>
                          )}

                          {Boolean(
                            conflict.slug.current === selectedConflictType &&
                            Object.keys(conflictChoices).length,
                          ) && (
                              <ol className="subitems list-decimal list-inside">
                                {Boolean(
                                  conflictChoices[selectedConflictType]?.length,
                                ) &&
                                  conflictChoices[selectedConflictType].map(
                                    ({ title, slug }) => (
                                      <li key={slug.current}>
                                        <a
                                          className="toggle cursor-pointer hover:text-[#f3873c]"
                                          href={`wiki/${slug.current}`}
                                        >
                                          {title}
                                        </a>
                                      </li>
                                    ),
                                  )}
                              </ol>
                            )}
                        </li>
                      ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Projects;

import React, { useEffect, useState } from "react";

import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "sanity:client";
import { sanityFetch } from "@/lib/utils/sanityFetch";

import { checkStatus } from "src/helper/helper.ts";

import { PortableText } from "@portabletext/react";
import portableTextComponents from "../portable-text-components";

import TradeOff from "@/layouts/function-components/TradeOff.jsx";
import SanityVideoComponent from "@/layouts/function-components/SanityVideoComponent.jsx";
import LockedContent from "@/layouts/function-components/LockedContent.jsx";

import { FaRegFolder } from "react-icons/fa";

const WikiSingle = ({ post, lang }) => {
  const [postStatus, setPostStatus] = useState(null);
  const [pageData, setPageData] = useState([]);
  const [isContentRepeater, setIsContentRepeater] = useState(false);

  useEffect(() => {
    const fetchPostStatus = async () => {
      const status = await checkStatus(post?.status);
      setPostStatus(status);
    };

    fetchPostStatus();

    setIsContentRepeater(post?.contentRepeater?.length > 0);
  }, [post]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageContent = await sanityFetch({
          type: "wikiPage",
          lang,
          object: `{
              generalText,
            }`,
        });

        setPageData(pageContent);
      } catch (error) {
        console.error("Error fetching page data");
      }
    };

    fetchData();
  }, [lang]);

  const { generalText } = pageData[0] || {};

  const builder = imageUrlBuilder(sanityClient);

  return postStatus ? (
    <section className="section blog-single">
      <div className="container">
        <div className="row justify-center">
          <div className="mt-10 max-w-[810px] lg:col-9">
            <h1 className="h2">{post.title}</h1>
            <div className="mb-5 mt-6 flex items-center space-x-2">
              <ul className="mb-4">
                {post.tags &&
                  post.tags.map((tag, index) => (
                    <li key={index} className="mr-4 inline-block">
                      <FaRegFolder className="mr-2 -mt-1 inline-block" />
                      {tag}
                      {index !== post.tags.length - 1 && ", "}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="content">
              {isContentRepeater ? (
                post.contentRepeater.map(
                  (
                    {
                      prosSection,
                      consSection,
                      blocks,
                      videoUrl,
                      videoPoster,
                      videoTranscriptRepeater,
                    },
                    index,
                  ) => (
                    <div key={index} className={index > 0 ? "mt-8" : ""}>
                      {prosSection && (
                        <TradeOff content={prosSection} type="PROS" />
                      )}
                      {consSection && (
                        <TradeOff content={consSection} type="CONS" />
                      )}
                      <PortableText
                        value={blocks}
                        components={portableTextComponents}
                      />
                      {videoUrl && videoPoster && (
                        <SanityVideoComponent
                          videoUrl={videoUrl}
                          videoPoster={builder.image(videoPoster).url()}
                          videoTranscriptRepeater={videoTranscriptRepeater}
                          generalText={generalText}
                          client:load
                        />
                      )}
                    </div>
                  ),
                )
              ) : (
                <div>
                  {post.prosSection && (
                    <TradeOff content={post.prosSection} type="PROS" />
                  )}
                  {post.consSection && (
                    <TradeOff content={post.consSection} type="CONS" />
                  )}
                  {post && post.content && (
                    <PortableText value={post.content} />
                  )}
                  {post.videoUrl && post.videoPoster && (
                    <SanityVideoComponent
                      videoUrl={post.videoUrl}
                      videoPoster={builder.image(post.videoPoster).url()}
                      videoTranscriptRepeater={post.videoTranscriptRepeater}
                      generalText={generalText}
                      client:load
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  ) : (
    <LockedContent lang={lang} client:load />
  );
};

export default WikiSingle;

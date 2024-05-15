import React, { useEffect, useState } from "react";
import { FaRegFolder } from "react-icons/fa";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import TradeOff from "@/layouts/function-components/TradeOff.jsx";
import SanityVideoComponent from "@/layouts/function-components/SanityVideoComponent.jsx";
import LockedContent from "@/layouts/function-components/LockedContent.jsx";
import { checkStatus } from "src/helper/helper.ts";
import portableTextComponents from "../portable-text-components";
import { sanityClient } from "sanity:client";

const Post = ({ post }) => {
  const [postStatus, setPostStatus] = useState(null);
  const [isContentRepeater, setIsContentRepeater] = useState(false);

  useEffect(() => {
    const fetchPostStatus = async () => {
      const status = await checkStatus(post?.status);
      setPostStatus(status);
    };

    fetchPostStatus();

    setIsContentRepeater(post?.contentRepeater?.length > 0);
  }, [post]);

  const builder = imageUrlBuilder(sanityClient);

  if (!postStatus) {
    return null;
  }

  return (
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
  );
};

export default Post;

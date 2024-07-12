import config from "@/config/config.json";

const divideCoursesData = (posts = [], lang: string) => {
  const localPosts = posts?.filter((post: any) => post.language === lang);
  const additionalPosts = posts?.filter(
    (post: any) =>
      post.language !== lang &&
      !(
        localPosts.map((localPost: any) => localPost?.slug?.current) || []
      ).includes(post?.slug?.current),
  );

  const totalPages =
    lang === "en"
      ? Math.ceil(localPosts.length / config.settings.pagination)
      : Math.max(
          Math.ceil(localPosts.length / config.settings.pagination),
          Math.ceil(additionalPosts.length / config.settings.pagination),
        );

  return { localPosts, additionalPosts, totalPages };
};

export default divideCoursesData;

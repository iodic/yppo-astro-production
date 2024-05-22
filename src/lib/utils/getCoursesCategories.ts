const getCoursesCategories = (posts: []) => {
  let postTagsArrays = posts?.map((post: any) => post.tags);
  let allCategories: object[] = [];

  postTagsArrays?.map((tagArray: any[]) => {
    tagArray?.map((tagItem) => {
      const uniqueObject = allCategories?.some((object) =>
        Object.keys(object).includes(tagItem.tagSlug?.current),
      );

      if (!uniqueObject) {
        allCategories.push({ [`${tagItem.tagSlug?.current}`]: tagItem?.tag });
      }
    });
  });

  return allCategories;
};

export default getCoursesCategories;

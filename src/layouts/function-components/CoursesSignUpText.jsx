import { PortableText } from "@portabletext/react";
import portableTextComponents from "../portable-text-components";

const CoursesSignUpText = ({ content }) => {
  return <PortableText value={content} components={portableTextComponents} />;
};

export default CoursesSignUpText;

import { PortableText } from "@portabletext/react";
import portableTextComponents from "../portable-text-components";

const PrivacyPolicyPortableText = ({ content }) => {
  return <PortableText value={content} components={portableTextComponents} />;
};

export default PrivacyPolicyPortableText;

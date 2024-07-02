const EmComponent = ({ children }) => <em>{children}</em>;

const StrongComponent = ({ children }) => <strong>{children}</strong>;

const CodeComponent = ({ children }) => <code>{children}</code>;

const UnderlineComponent = ({ children }) => (
  <span style={underlineStyle}>{children}</span>
);

const StrikeThroughComponent = ({ children }) => <del>{children}</del>;

const LinkComponent = ({ children, value }) => {
  const { blank, href } = value;
  const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
  return (
    <a
      href={value?.href}
      target={target}
      rel={target === "_blank" ? "noindex nofollow" : ""}
    >
      {children}
    </a>
  );
};

export default {
  em: EmComponent,
  strong: StrongComponent,
  code: CodeComponent,
  underline: UnderlineComponent,
  "strike-through": StrikeThroughComponent,
  link: LinkComponent,
};

const EmComponent = ({ children }) => <em>{children}</em>;

const StrongComponent = ({ children }) => <strong>{children}</strong>;

const CodeComponent = ({ children }) => <code>{children}</code>;

const UnderlineComponent = ({ children }) => (
  <span style={underlineStyle}>{children}</span>
);

const StrikeThroughComponent = ({ children }) => <del>{children}</del>;

const LinkComponent = ({ children, value }) => (
  <a href={value?.href}>{children}</a>
);

export default {
  em: EmComponent,
  strong: StrongComponent,
  code: CodeComponent,
  underline: UnderlineComponent,
  "strike-through": StrikeThroughComponent,
  link: LinkComponent,
};

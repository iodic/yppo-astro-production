const NormalComponent = ({ children }) => <p>{children}</p>;

const BlockquoteComponent = ({ children }) => (
  <blockquote>{children}</blockquote>
);

const H1Component = ({ children }) => (
  <h1 className="mb-4 font-normal">{children}</h1>
);

const H2Component = ({ children }) => (
  <h2 className="mb-8 font-normal">{children}</h2>
);

const H3Component = ({ children }) => (
  <h3 className="mb-8 font-normal">{children}</h3>
);

const H4Component = ({ children }) => <h4>{children}</h4>;

const H5Component = ({ children }) => <h5>{children}</h5>;

const H6Component = ({ children }) => <h6>{children}</h6>;

export default {
  normal: NormalComponent,
  blockquote: BlockquoteComponent,
  h1: H1Component,
  h2: H2Component,
  h3: H3Component,
  h4: H4Component,
  h5: H5Component,
  h6: H6Component,
};

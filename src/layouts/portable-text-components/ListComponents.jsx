const BulletComponent = ({ children }) => {
  return (
    <ul className="portable-ul-component list-disc list-outside pl-6 mb-3">
      {children}
    </ul>
  );
};

const NumberListComponent = ({ children }) => {
  return <ol className="list-outside pl-6 mb-3">{children}</ol>;
};

export default {
  bullet: BulletComponent,
  number: NumberListComponent,
};

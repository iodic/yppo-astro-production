const BulletItemComponent = ({ children }) => {
  return <li>{children}</li>;
};

const NumberItemComponent = ({ children }) => {
  return <li>{children}</li>;
};

export default {
  bullet: BulletItemComponent,
  number: NumberItemComponent,
};

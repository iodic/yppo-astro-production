export const BackBlockButton = ({ text, arrow, onClick, className }) => (
  <button
    onClick={onClick}
    className={`flex items-center jump-back py-1 px-3 w-full text-left transition-all mb-6 bg-sky-100 ${arrow ? "hover:pl-2" : "justify-between"} ${className ? className : ""}`}
  >
    {arrow && (
      <img src="/images/icons/back-arrow.svg" className="w-5 mt-1 mr-1"></img>
    )}
    {text}
    {!arrow && <img src="/images/icons/close.svg" className="w-3"></img>}
  </button>
);

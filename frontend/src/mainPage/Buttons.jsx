function Buttons({ children, type = "button", onClick, variant = "primary", className = "" }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} px-3 py-2 me-2 ${className}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Buttons;

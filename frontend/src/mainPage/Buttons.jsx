function Buttons({
  children,
  type = "button",
  onClick,
  variant = "primary",
  className = "",
  style = {},
  onMouseEnter,
  onMouseLeave,
  ...props
}) {
  return (
    <button
      type={type}
      className={`${className}`}
      style={{
        backgroundColor: "transparent",
        border: "none",
        padding: "0",
        color: "inherit",
        cursor: "pointer",
        font: "inherit",
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}

export default Buttons;

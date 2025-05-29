import * as React from "react";

export function Tabs({ value, onValueChange, children, className = "" }) {
  const [current, setCurrent] = React.useState(value);

  React.useEffect(() => {
    setCurrent(value);
  }, [value]);

  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (child.type.displayName === "TabsList") {
          return React.cloneElement(child, { value: current, onValueChange: onValueChange || setCurrent });
        }
        if (child.type.displayName === "TabsContent") {
          return current === child.props.value ? child : null;
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, value, onValueChange, className = "" }) {
  return (
    <div className={`flex gap-2 border-b mb-4 ${className}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          isActive: child.props.value === value,
          onClick: () => onValueChange(child.props.value),
        })
      )}
    </div>
  );
}
TabsList.displayName = "TabsList";

export function TabsTrigger({ children, value, isActive, onClick, className = "" }) {
  return (
    <button
      className={`px-4 py-2 border-b-2 transition-colors ${isActive ? "border-blue-500 font-semibold text-blue-700" : "border-transparent text-gray-500 hover:text-blue-700"} bg-transparent outline-none ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({ children }) {
  return <div>{children}</div>;
}
TabsContent.displayName = "TabsContent";

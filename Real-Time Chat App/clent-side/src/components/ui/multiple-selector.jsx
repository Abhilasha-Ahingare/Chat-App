import React from "react";

export const Option = React.memo(({ label, value, disabled }) => {
  return <div className={`option ${disabled ? "disabled" : ""}`}>{label}</div>;
});

const MultipleSelector = ({ defaultOptions = [], placeholder, emptyIndicator }) => {
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  return (
    <div className="multiple-selector">
      <div className="selector-input">{placeholder}</div>
      <div className="options-list">
        {!defaultOptions || defaultOptions.length === 0 ? (
          <div>{emptyIndicator}</div>
        ) : (
          defaultOptions.map((option, index) => (
            <Option
              key={option.value || `option-${index}`}
              label={option.label || ''}
              value={option.value}
              disabled={option.disabled}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MultipleSelector;

import React, { useState } from 'react';

/**
 * Accordion Component
 * Expandable/collapsible section container for settings and grouped content
 */
const Accordion = ({ items, defaultExpandedIndex = 0, allowMultiple = false }) => {
  const [expandedIndexes, setExpandedIndexes] = useState(
    allowMultiple ? [defaultExpandedIndex] : defaultExpandedIndex
  );

  const toggleAccordion = (index) => {
    if (allowMultiple) {
      setExpandedIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setExpandedIndexes(expandedIndexes === index ? -1 : index);
    }
  };

  const isExpanded = (index) => {
    return allowMultiple
      ? expandedIndexes.includes(index)
      : expandedIndexes === index;
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div
          key={index}
          className={`accordion-item ${isExpanded(index) ? 'expanded' : ''}`}
        >
          <button
            className="accordion-header"
            onClick={() => toggleAccordion(index)}
            aria-expanded={isExpanded(index)}
            aria-controls={`accordion-content-${index}`}
            type="button"
          >
            <span className="accordion-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="accordion-title">{item.title}</span>
            {item.badge && (
              <span className="accordion-badge" aria-label={`${item.badge} items`}>
                {item.badge}
              </span>
            )}
            <span className="accordion-chevron" aria-hidden="true">
              {isExpanded(index) ? '▲' : '▼'}
            </span>
          </button>

          <div
            id={`accordion-content-${index}`}
            className="accordion-content"
            style={{
              maxHeight: isExpanded(index) ? '5000px' : '0',
            }}
          >
            <div className="accordion-body">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;


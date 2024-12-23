import React from 'react';

function FrameAccordion({
    color,
    radius,
    title,
    content,
    isExpanded,
    onToggle,
  }: {
    color: string;
    radius: string;
    title: string;
    content: string;
    isExpanded: boolean;
    onToggle: () => void;
  }) {
    return (
      <div
        className={`overflow-hidden transition-all duration-300 border-[1px] border-[#FFFFFFA3] ${
          isExpanded ? 'mb-4 bg-gradient-to-r from-[#FFFFFF3D] to-[#FFFFFF14]' : 'mb-3'
        }`}
        style={{
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            borderBottomLeftRadius: isExpanded ? '8px' : radius,
            borderBottomRightRadius: isExpanded ? '8px' : radius,
            boxShadow: '1px 1px 2px rgba(255, 255, 255, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          className="flex justify-between items-center p-5 cursor-pointer border-[1px] border-[#FFFFFFA3] max-h-[99px]"
          onClick={onToggle}
          style={{
            background: `linear-gradient(to right, #FFFFFF3D, ${color})`,
            borderRadius: radius,
          }}
        >
          <div className="text-2xl font-bold text-white font-dmsans">{title}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className={`h-8 w-8 transition-transform duration-300  ${
              isExpanded ? 'rotate-90' : ''
            }`}
          >
            <path d="M10 19l7-7-7-7v14z" />
          </svg>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 flex items-start ${
            isExpanded ? 'opacity-100 min-h-0 p-5' : 'opacity-0 max-h-0 p-0'
          }`}
        >
          <div className="text-lg text-white font-dmsans">{content}</div>
        </div>
      </div>
    );
}  
  
export default FrameAccordion;

// how to use
// const [expandedId, setExpandedId] = useState<number | null>(null);

// const toggleExpandedId = (id: number) => {
//     setExpandedId(expandedId === id ? null : id);
// };

// <FrameAccordion
//     color="#4D06B0CC"
//     radius="8px"
//     title="Frame 1"
//     content="Content for Frame 1"
//     isExpanded={expandedId === 1}
//     onToggle={() => toggleExpandedId(1)}
// />
// <FrameAccordion
//     color="#E50000CC"
//     radius="8px"
//     title="Frame 2"
//     content="Content for Frame 2"
//     isExpanded={expandedId === 2}
//     onToggle={() => toggleExpandedId(2)}
// />

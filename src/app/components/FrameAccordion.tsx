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
// 'use client';
// import React, { useState } from 'react'
// import FrameAccordion from './components/FrameAccordion'

// const accordionData = [
//   { id: 1, title: 'Frame 1', content: 'Content 1', color: '#4D06B0CC', radius: '8px' },
//   { id: 2, title: 'Frame 2', content: 'Content 2', color: '#E50000CC', radius: '8px' },
//   { id: 3, title: 'Frame 3', content: 'Content 3', color: '#FFD700CC', radius: '8px' },
// ];

// function Home() {
// const [expandedId, setExpandedId] = useState<number | null>(null);

// const toggleExpandedId = (id: number) => {
//   setExpandedId(expandedId === id ? null : id);
// };


//   return (
//       <div className="flex flex-col max-w-2xl mx-auto">
//         {accordionData.map((item) => (
//           <FrameAccordion
//             key={item.id}
//             {...item}
//             isExpanded={expandedId === item.id}
//             onToggle={() => toggleExpandedId(item.id)}
//           />
//         ))}
//       </div>
//   )
// }

// export default Home
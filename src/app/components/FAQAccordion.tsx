'use client';
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";

interface FAQAccordionProps {
  q1: string;
  a1: string;
  q2?: string;
  a2?: string;
  q3?: string;
  a3?: string;
  q4?: string;
  a4?: string;
  q5?: string;
  a5?: string;
  q6?: string;
  a6?: string;
  q7?: string;
  a7?: string;
}

function FAQAccordion({
  q1,
  a1,
  q2,
  a2,
  q3,
  a3,
  q4,
  a4,
  q5,
  a5,
  q6,
  a6,
  q7,
  a7,
}: FAQAccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleToggle = (item: string) => {
    setOpenItem((prev) => (prev === item ? null : item));
  };

  const renderAccordionItem = (
    value: string,
    question?: string,
    answer?: string
  ) => {
    if (!question || !answer) return null;
    const isOpen = openItem === value;

    return (
      <AccordionItem value={value}>
        <AccordionTrigger
          isOpen={isOpen}
          onClick={() => handleToggle(value)} 
        >
          {question}
        </AccordionTrigger>
        <AccordionContent>{answer}</AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className="flex items-center justify-center">
      <Accordion type="single" collapsible className="w-[50%]">
        {renderAccordionItem("item-1", q1, a1)}
        {renderAccordionItem("item-2", q2, a2)}
        {renderAccordionItem("item-3", q3, a3)}
        {renderAccordionItem("item-4", q4, a4)}
        {renderAccordionItem("item-5", q5, a5)}
        {renderAccordionItem("item-6", q6, a6)}
        {renderAccordionItem("item-7", q7, a7)}
      </Accordion>
    </div>
  );
}

export default FAQAccordion;
'use client'
import React, { useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from './ui/accordion'

interface FAQAccordionProps {
  items: { question: string; answer: string }[]
}

function FAQAccordion({ items }: FAQAccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const handleToggle = (item: string) => {
    setOpenItem(prev => (prev === item ? null : item))
  }

  return (
    <div className="flex items-center justify-center">
      <Accordion type="single" collapsible className="w-[50%]">
        {items.map((item, index) => {
          const value = `item-${index + 1}`
          const isOpen = openItem === value

          return (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger
                isOpen={isOpen}
                onClick={() => handleToggle(value)}
                accType="faq">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

export default FAQAccordion

// how to use
// const faqItems = [
//   { question: "What is React?", answer: "React is a JavaScript library for building user interfaces." },
//   { question: "What is JSX?", answer: "JSX is a syntax extension for JavaScript, used with React to describe what the UI should look like." },
//   { question: "What is a component?", answer: "A component is a reusable piece of UI in React." },
//   { question: "What is state?", answer: "State is a way to manage changing data in a component." },
// ];

// <FAQAccordion items={faqItems} />

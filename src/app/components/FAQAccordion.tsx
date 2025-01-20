'use client'
import React from 'react'
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

  return (
    <div className="flex items-center justify-center w-full max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => {
          const value = `item-${index + 1}`

          return (
            <AccordionItem key={value} value={value} className="border-b border-gray-200">
              <AccordionTrigger accType='faq'
                className={`flex justify-between items-center p-4 w-full text-left text-lg font-medium`}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

export default FAQAccordion
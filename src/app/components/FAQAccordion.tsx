import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion'

function FAQAccordion() {
  return (
    <div className='flex items-center justify-center'>
      <Accordion type="single" collapsible className="w-[50%]">
        <AccordionItem value="item-1">
          <AccordionTrigger>Apa itu XXX?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Suspendisse venenatis efficitur nascetur ultrices morbi. Morbi nostra inceptos tincidunt nisi massa. Nostra nunc integer, interdum accumsan elementum interdum id. Primis sociosqu auctor vehicula suscipit vehicula sollicitudin sollicitudin.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Apa itu XXX?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Suspendisse venenatis efficitur nascetur ultrices morbi. Morbi nostra inceptos tincidunt nisi massa. Nostra nunc integer, interdum accumsan elementum interdum id. Primis sociosqu auctor vehicula suscipit vehicula sollicitudin sollicitudin.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Apa itu XXX?</AccordionTrigger>
          <AccordionContent>
            Lorem ipsum odor amet, consectetuer adipiscing elit. Suspendisse venenatis efficitur nascetur ultrices morbi. Morbi nostra inceptos tincidunt nisi massa. Nostra nunc integer, interdum accumsan elementum interdum id. Primis sociosqu auctor vehicula suscipit vehicula sollicitudin sollicitudin.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>  
  )
}

export default FAQAccordion
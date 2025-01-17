'use client'

import ComponentBox from '../ComponentBox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'

interface InformationItem {
  title: string
  datetime: string
  content: string
}

export default function Information({
  informations
}: {
  informations?: InformationItem[]
}) {
  return (
    <ComponentBox title="Pengumuman" center={false}>
      {!informations || informations.length === 0 ? (
        <div className="mb-2 mt-2 text-white/60">Belum ada informasi</div>
      ) : (
        <Accordion type="single" collapsible className="w-[100%] space-y-3">
          {informations.map((information, index) => (
            <AccordionItem
              key={index}
              value={String(index)}
              className="rounded-xl border border-[#E66DD0] bg-white/10 px-4 backdrop-blur-sm">
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <h2 className="text-[14px] font-semibold text-white">
                    {information.title}
                  </h2>
                  <p className="text-[10px] text-[#F5F5F5]">{information.datetime}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-[10px] leading-snug text-white">
                {information.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </ComponentBox>
  )
}

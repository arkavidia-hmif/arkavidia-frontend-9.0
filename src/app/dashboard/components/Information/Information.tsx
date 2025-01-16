'use client'

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
    <div className="border-1 countdownBox flex flex-col items-center justify-center gap-3 rounded-lg border border-white border-opacity-60 bg-gradient-to-br from-white/[0.24] to-white/[0.08] p-3 shadow-[0_0_10px_rgba(255,255,255,0.2)] backdrop-blur-md">
      <h1 className="font-teachers text-[20px] font-bold text-white">Pengumuman</h1>
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
    </div>
  )
}

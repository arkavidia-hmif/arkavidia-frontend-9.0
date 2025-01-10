import { Button } from "~/app/components/Button";
import { Check, X } from "lucide-react";
import Dropdown, { MenuItem } from "~/app/components/Dropdown";
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow, 
} from "~/app/components/Table";

type ComponentProps = {
    submissionType: "Final" | "Pre-eliminary";
    participantQualification: MenuItem[];
    submissionDocs: string[];
}

function SubmissionTable(
    {submissionDocs}: {finalist?: boolean, submissionDocs: string[]}
) {

    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead className="w-[300px]">Submission</TableHead>
                <TableHead>File</TableHead>
                <TableHead className="w-[300px]">Status</TableHead>
                </TableRow>
            </TableHeader>
                <TableBody>
                    {
                        submissionDocs.map((doc, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="text-left">{doc}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
        </Table>
    )
}

function SubmissionPart(
    {
        submissionType,
        participantQualification,
        submissionDocs
    }: ComponentProps
) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-[32px]">{submissionType}</h1>
                <div className="flex gap-5">
                    <Dropdown data={participantQualification} />
                    <div className="flex gap-2">
                        <Button variant={'outline'} size={'sm'}>
                            <X size={10} className="text-white" strokeWidth={3} />
                        </Button>
                        <Button size={'sm'}>
                            <Check size={10}  strokeWidth={3}/>
                        </Button>
                    </div>
                </div>
            </div>
            <SubmissionTable submissionDocs={submissionDocs} />
        </div>
    )
}

export default function Submission() {
    return (
        <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 shadow-lg px-[2rem] py-[3rem] font-dmsans">
            <div className="flex flex-col gap-[3rem]">
                <SubmissionPart 
                    submissionType="Pre-eliminary" 
                    participantQualification={[{id: 1, option: "Finalist"}, {id: 2, option: "Not Finalist"}]} 
                    submissionDocs={["Dokumen (PDF)", "Figma Prototype (Link)", "Video (Link)"]} 
                />
                <SubmissionPart 
                    submissionType="Final" 
                    participantQualification={[{id: 1, option: "Finalist"}, {id: 2, option: "Not Finalist"}]} 
                    submissionDocs={["Deck (PDF)", "Instagram (Link)"]}
                />
            </div>
        </div>
    )
}
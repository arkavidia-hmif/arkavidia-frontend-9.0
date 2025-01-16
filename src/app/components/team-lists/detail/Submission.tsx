"use client";

import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow, 
} from "~/app/components/Table";
import { TeamStatus } from "./TeamInfo";

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

export default function Submission() {
    return (
        <div className="rounded-lg border border-white/80 bg-gradient-to-r from-white/20 to-white/5 shadow-lg px-[2rem] pt-[1rem] pb-[4rem] font-dmsans">
            <div className="flex flex-col gap-[3rem]">
                <div className="flex flex-col gap-6">
                        <TeamStatus 
                            stage='Pre-eliminary'
                            qualifications={
                                [
                                    {id: 1, option: "Pass"}, 
                                    {id: 2, option: "Not Pass"},
                                    {id: 3, option: "On Review"},
                                ]
                            }
                            stageSuccess={['Pass']}
                            stageFailed={['Not Pass']} 
                        />
                        <SubmissionTable submissionDocs={["Dokumen (PDF)", "Figma Prototype (Link)", "Video (Link)"]} />
                    </div>
                <div className="flex flex-col gap-6">
                    <TeamStatus 
                        stage='Final'
                        qualifications={
                            [
                                {id: 1, option: "Juara 1"}, 
                                {id: 2, option: "Juara 2"},
                                {id: 3, option: "Juara 3"},
                                {id: 4, option: "Juara Harapan 1"},
                                {id: 5, option: "Juara Harapan 2"},
                                {id: 6, option: "Juara Harapan 3"},
                            ]
                        }
                        stageWin={['Juara 1', 'Juara 2', 'Juara 3']}
                        stageSuccess={['Juara Harapan 1', 'Juara Harapan 2', 'Juara Harapan 3']}
                    />
                    <SubmissionTable submissionDocs={["Deck (PDF)", "Instagram (Link)"]} />
                </div>
                
            </div>
        </div>
    )
}
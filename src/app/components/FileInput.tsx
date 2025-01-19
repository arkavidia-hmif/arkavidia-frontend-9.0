"use client"

import { ChangeEvent, useState, useCallback } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {useDropzone} from 'react-dropzone'
import axios from "axios";
import Image from "next/image";
import { X } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { cn } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast"
import { getPresignedLink, self } from "~/api/generated"
import useAxiosAuth from "~/lib/hooks/useAxiosAuth"
import { axiosInstance } from "~/lib/axios"

type MediaResponse = {
    presignedUrl: string,
    mediaUrl: string,
    expiresIn: number
}

export type uploadedFileState = {
    mediaID: string,
    fileName: string,
    mediaURL: string
}

type ComponentProps = {
    onUpload?: (e: uploadedFileState | null ) => void,
    className?: string,
    displaySucces?: boolean
}

function fileExt(filename: string) {
    const last_dot = filename.lastIndexOf('/')
    return filename.slice(last_dot + 1).toUpperCase()
}

function uploadedStatus(success?: boolean) {
    return (
        <>
            <div className="bg-white size-1 rounded-full" />
            <div className="flex gap-2 text-sm">
                <Image
                    src={cn(`/icons/fileinputassets/${success? "check_circle" : "error"}.svg`)}
                    alt="status icon"
                    width={20}
                    height={20}
                />
                <p>{success? "Completed" : "Failed"}</p>
            </div>
        </>
    )
}


export default function FileInput({onUpload, className, displaySucces}: ComponentProps) {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0)
    const [uploaded, setUploaded] = useState(false);
    const [isUploadSucces, setUploadSucces] = useState<boolean>(false);
    const { toast } = useToast()
    const axiosAuth = useAxiosAuth();
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if(acceptedFiles.length > 1) {
            toast({
                title: "File failed to upload",
                description: "Only single file allowed",
                variant: "destructive"
            })
            return;
        }

        setFile(acceptedFiles[0])
        try {
            await handleChange(acceptedFiles[0])
            setUploadSucces(true);
        } catch (err) {
            if (err instanceof Error) {
                toast({
                    title: "File failed to upload",
                    description: err.message
                })
            } else {
                toast({
                    title: "File failed to upload",
                    description: "Something happened"
                })
            }
            setUploadSucces(false);
        } finally {
            if (displaySucces) {
                setUploaded(true);
            } else {
                setUploaded(true);
                setFile(null);
            }
        }
      }, [])
    const {getRootProps, getInputProps, isDragActive, open} = useDropzone({onDrop})

    const handleChange = async (selectedFile:File) => {
        setFile(selectedFile);
        const getSelf = await self({
            client: axiosAuth
        });

        if (getSelf.error) {
            toast({
              title: 'Error',
              description: 'Gagal mengirimkan data',
              variant: 'destructive'
            })
        }

        if (getSelf.data) {
            const userId = getSelf.data.id
            const fileName = selectedFile.name
            const fileExt = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2)
            const formattedFileName = `${userId}-identity-card.${fileExt}`
            const getLink = await getPresignedLink({
                client: axiosAuth,
                query: {
                  bucket: 'kartu-identitas',
                  filename: formattedFileName
                }  
            })

            if (getLink.error) {
                toast({
                  title: 'Error',
                  description: 'Gagal melakukan upload data',
                  variant: 'destructive'
                })
              }
      
            if (getLink.data) {
                setUploaded(false);
                const upload = await axiosInstance.put({
                    url: getLink.data.presignedUrl,
                    body: selectedFile,
                    onUploadProgress: (progressEvent) => {
                        if(progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setProgress(percentCompleted)
                        }
                    }
                })
                
                if (upload.status === 200) {
                    onUpload && onUpload({
                        mediaID: getLink.data.mediaId,
                        fileName: formattedFileName,
                        mediaURL: getLink.data.mediaUrl
                    });
                }
            }

        }
    }

    const handleDelete = () => {
        setFile(null);
        onUpload && onUpload(null);
    }

    if(file !== null) {
        return (
            <div className={cn("border border-neutral-450 w-full p-[1rem] rounded-[12px]", className)}>
                <div className={cn("flex items-center justify-between", uploaded? '' : 'mb-2')}>
                    <div className="flex items-center gap-3 mr-4">
                        <Image
                            src={`/icons/fileinputassets/${fileExt(file.type)}.svg`}
                            alt="File icon"
                            width={50}
                            height={50}
                        />
                        <div className="font-dmsans">
                            <h1 className="font-semibold">{file?.name || "placeholder-file.pdf"}</h1>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm">{(file?.size || 0) * (progress / 100)} KB of {file?.size || 0} KB</h2>
                                {uploaded && uploadedStatus(isUploadSucces)}
                            </div>
                        </div>
                    </div>
                    {!uploaded && <X onClick={handleDelete} className="hover:cursor-pointer" strokeWidth={2.5}/>}
                    {uploaded && 
                        <Image
                            src="/icons/fileinputassets/delete.svg"
                            alt="File icon"
                            width={30}
                            height={30}
                            onClick={handleDelete}
                            className="hover:cursor-pointer"
                        />
                    }
                </div>
                {!uploaded && 
                    <ProgressBar progress={progress} isValueRightSided />
                }
            </div>
        );
    }
    else {
        return (
            <div 
                {...getRootProps()} 
                onClick={open} 
                className={cn(
                    "font-dmsans text-center w-fit bg-lilac-100 px-[4rem] py-[2rem] flex flex-col items-center border border-dashed border-purple-500 rounded-[8px] hover:cursor-pointer",
                    className
                )}
            >
                <input {...getInputProps()} />
                <Image
                    src="/icons/fileinputassets/cloud_upload.svg"
                    alt="File icon"
                    width={30}
                    height={30}
                    className="hover:cursor-pointer"
                />
                <div>
                    <h1 className="text-purple-500">
                        {!isDragActive && 
                            <>
                                <span className="font-bold underline">Click to upload</span> or drag and drop
                            </>
                        }
                        {isDragActive && 
                            <>
                                <span className="font-bold">Release!</span>
                            </>
                        }
                    </h1>
                    <div className="text-neutral-450">
                        <p>Supported formats: JPEG, PNG, PDF, DOCX</p>
                        <p>Maximum file size 20 MB</p>
                    </div>
                </div>
            </div>
        )
    }
}
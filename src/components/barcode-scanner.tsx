"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface BarcodeScannerProps {
    onResult: (result: string) => void
    onError?: (error: string) => void
}

export function BarcodeScanner({ onResult, onError }: BarcodeScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [loading, setLoading] = useState(true)
    const codeReader = useRef(new BrowserMultiFormatReader())

    useEffect(() => {
        let selectedDeviceId: string
        const reader = codeReader.current

        reader
            .listVideoInputDevices()
            .then((videoInputDevices) => {
                if (videoInputDevices.length > 0) {
                    // Prefer back camera if available
                    const backCamera = videoInputDevices.find(device => device.label.toLowerCase().includes('back'))
                    selectedDeviceId = backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId

                    setLoading(false)
                    if (videoRef.current) {
                        decode(selectedDeviceId)
                    }
                } else {
                    if (onError) onError("No camera found")
                }
            })
            .catch((err) => {
                console.error(err)
                if (onError) onError("Error accessing camera")
            })

        return () => {
            reader.reset()
        }
    }, [])

    const decode = (deviceId: string) => {
        const reader = codeReader.current
        reader.decodeFromVideoDevice(
            deviceId,
            videoRef.current!,
            (result, err) => {
                if (result) {
                    onResult(result.getText())
                }
                if (err && !(err instanceof NotFoundException)) {
                    console.error(err)
                }
            }
        )
    }

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
            />
        </div>
    )
}

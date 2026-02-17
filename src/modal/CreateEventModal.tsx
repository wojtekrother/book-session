import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { createPortal } from "react-dom"

import { convertFileToString } from "../utils/file"
import { toast } from "react-toastify"
import { StringUtils } from "../utils/string"
import { useEventContext } from "../context/EventContext"


type CreateEventModalProps = {

}

export type CreateEventModalHandler = {
    open: () => void,
    close: () => void
}


const CreateEventModal = forwardRef<CreateEventModalHandler>(({ ...props }: CreateEventModalProps, ref) => {
    const modal = useRef<HTMLDialogElement>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const eventCtx = useEventContext();
    const [modalRootElement, setModalRootElement] = useState<HTMLElement | null>(null)
    const abortControler = new AbortController();

    useEffect(() => {
        setModalRootElement(document.getElementById("modal-root"))
    }, [])
    
    useImperativeHandle(ref, () => {
        return {
            open: () => {
                showModal();
            },
            close: () => {
                closeModal()
            }

        }
    })


    function showModal() {
        modal.current?.showModal();
    }

    function closeModal() {
        modal.current?.close();
    }

    function addError(error: string): void {
        setErrors(prevVal => [...prevVal, error])
    }

    function resetErrors(): void {
        setErrors([]);
    }



    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        resetErrors()

        let data = new FormData(event.currentTarget)


        let image = data.get("image") as File;
        let title = data.get("title") as string;
        let description = data.get("description") as string;
        let summary = data.get("summary") as string;
        let durationRaw = data.get("duration") as string;
        let date = data.get("date") as string;

        let imageUrl: String | undefined;


        if (StringUtils.isBlank(title)) {
            addError("Title is required")
        }

        if (StringUtils.isBlank(description)) {
            addError("Description is required")
        }

        if (StringUtils.isBlank(summary)) {
            addError("Summary is required")
        }

        if (StringUtils.isBlank(durationRaw)) {
            addError("Duration is required")
        } else if (Number.isNaN(durationRaw)) {
            addError("Duration is not a number")
        }

        if (StringUtils.isBlank(date)) {
            addError("Date is required")
        }

        if (image != null) {
            imageUrl = await convertFileToString(image as File)
        } else {
            addError("Image is required")
        }


        if (errors.length == 0) {
            try {
                await eventCtx.addEvent({ title, description, duration: Number(durationRaw), summary, date, imageUrl })
                event.currentTarget.reset()

                toast.success("New event sucesfully created")

            } catch (e: unknown) {
                if (e instanceof Error) {
                    toast.error(`Error during saving event ${e.message}`)
                } else {
                    toast.error("Error during saving event!")
                }
            }
        }

    }


    return <>{modalRootElement ? createPortal(
        <dialog ref={modal} className="modal mx-auto p-5">
            <form onSubmit={onSubmit}>
                {errors.length > 0 &&
                    <div className="border-2 border-red-500 bg-red-200 rounded-lg  text-amber-800 m-2 p-4">
                        <h2 className="text-2xl">Errors: </h2>
                        {errors.map(e => <p className="text-sm">{e}</p>)}
                    </div>
                }
                <div>
                    <Input disabled={eventCtx.status === "pending"} label="Title" name="title" />
                    <Input disabled={eventCtx.status === "pending"} label="Description" name="description" />
                    <Input disabled={eventCtx.status === "pending"} label="Summary" name="summary" />
                    <Input disabled={eventCtx.status === "pending"} label="Duration in days" name="duration" type="number" />
                    <Input disabled={eventCtx.status === "pending"} label="Start date" name="date" type="date" />
                    <Input disabled={eventCtx.status === "pending"} label="Image" name="image" type="file" />
                </div>
                <div className="actions">
                    <Button textOnly onClick={closeModal}>Cancel</Button>
                    <Button disabled={eventCtx.status === "pending"}>Create</Button>
                </div>
            </form>
        </dialog>, modalRootElement) : null}</>

})

export default CreateEventModal
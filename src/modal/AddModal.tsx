import { ComponentProps, forwardRef, useImperativeHandle, useRef, useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import { createPortal } from "react-dom"
import { saveSession } from "../api/SessionApi"
import { convertFileToString } from "../utils/file"
import { toast } from "react-toastify"
import { StringUtils } from "../utils/string"


type AddModalProps = {

}

export type AddModalHandler = {
    open: () => void,
    close: () => void
}


const AddModal = forwardRef<AddModalHandler>(({ ...props }: AddModalProps, ref) => {
    const modal = useRef<HTMLDialogElement>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const modalRootElement = document.getElementById("modal-root")

    console.log(`modalRootElement ${modalRootElement}`)
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

            const sessionSaved = await saveSession({ title, description, duration :Number(durationRaw), summary, date, imageUrl })
            if (sessionSaved.id != null) {
                toast.success("New session sucesfully created")
            } else {
                toast.error("Error during saving session!")
            }
        }

    }


    return <>{modalRootElement ? createPortal(
        <dialog ref={modal} className="modal">
            <form onSubmit={onSubmit}>
            {errors.length >0 && 
                <div>
                    {errors.map(e => <p>{e}</p>)}
                </div>
            }
                <div>
                    <Input label="Title" name="title" />
                    <Input label="Description" name="description" />
                    <Input label="Description" name="summary" />
                    <Input label="Duration in days" name="duration" type="number" />
                    <Input label="Start date" name="date" type="date" />
                    <Input label="Image" name="image" type="file" />
                </div>
                <div className="actions">
                    <Button textOnly onClick={closeModal}>Cancel</Button>
                    <Button >Create</Button>
                </div>
            </form>
        </dialog>, modalRootElement) : null}</>

})

export default AddModal
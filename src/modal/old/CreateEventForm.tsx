import { useState } from "react"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import { convertFileToString } from "../../utils/file"
import { toast } from "react-toastify"
import { StringUtils } from "../../utils/string"
import { useCreateEvent } from "../../services/api/EventApiQuery"



type CreateEventModalProps = {
    closeModal: () => void
}



const CreateEventForm = ({closeModal,  ...props }: CreateEventModalProps) => {
    const [errors, setErrors] = useState<string[]>([]);
    const createEvent = useCreateEvent()
    const abortControler = new AbortController();


    function resetErrors(): void {
        setErrors([]);
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        let errorsTemp: string[] = [];
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
            errorsTemp.push("Title is required")
        }

        if (StringUtils.isBlank(description)) {
            errorsTemp.push("Description is required")
        }

        if (StringUtils.isBlank(summary)) {
            errorsTemp.push("Summary is required")
        }

        if (StringUtils.isBlank(durationRaw)) {
            errorsTemp.push("Duration is required")
        } else if (Number.isNaN(durationRaw)) {
            errorsTemp.push("Duration is not a number")
        }

        if (StringUtils.isBlank(date)) {
            errorsTemp.push("Date is required")
        }

        if (image != null) {
            imageUrl = await convertFileToString(image as File)
        } else {
            errorsTemp.push("Image is required")
        }


        if (errorsTemp.length == 0) {
            try {
                //await eventCtx.addEvent({ title, description, duration: Number(durationRaw), summary, date, imageUrl })
                createEvent.mutate({ title, description, duration: Number(durationRaw), summary, date, imageUrl })
                event.currentTarget.reset()

                toast.success("New event sucesfully created")

            } catch (e: unknown) {
                if (e instanceof Error) {
                    toast.error(`Error during saving event ${e.message}`)
                } else {
                    toast.error("Error during saving event!")
                }
            }
        } else {
            setErrors(errorsTemp);
        }

    }


    return <>

        <form onSubmit={onSubmit}>
            {errors.length > 0 &&
                <div className="border-2 border-red-500 bg-red-200 rounded-lg  text-amber-800 m-2 p-4">
                    <h2 className="text-2xl">Errors: </h2>
                    {errors.map(e => <p className="text-sm">{e}</p>)}
                </div>
            }
            <div>
                <Input disabled={createEvent.isPending} label="Title" name="title" />
                <Input disabled={createEvent.isPending} label="Description" name="description" />
                <Input disabled={createEvent.isPending} label="Summary" name="summary" />
                <Input disabled={createEvent.isPending} label="Duration in days" name="duration" type="number" />
                <Input disabled={createEvent.isPending} label="Start date" name="date" type="date" />
                <Input disabled={createEvent.isPending} label="Image" name="image" type="file" />
            </div>
            <div className="actions">
                <Button textOnly onClick={closeModal}>Cancel</Button>
                <Button disabled={createEvent.isPending}>Create</Button>
            </div>
        </form>

    </>

}

export default CreateEventForm
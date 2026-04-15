import { useRef, useState } from "react"
import Input from "../../../components/ui/Input"
import Button from "../../../components/ui/Button"
import { toast } from "react-toastify"
import { useCreateEvent } from "../../../services/api/EventApiQuery"
import useForm from "../../../hooks/useForm"
import { EventCreateDTO } from "../schema/event.shema"
import { validateDescription, validateDuration, validateSummary, validateTitle } from "../../shared/validator/fieldValidators"
import ErrorField from "../../../components/ui/ErrorField"
import { useNavigate } from "react-router-dom"

type CreateEventModalProps = {
    closeModal: () => void
}

const CreateEventForm_v2 = ({ closeModal, ...props }: CreateEventModalProps) => {
    const { handleSubmit, register, isFormReady, reset, values: formValues } = useForm<EventCreateDTO>({
        initialValue: {
            title: "",
            date: new Date(),
            description: "",
            duration: 1,
            summary: "",
            image: "",
            imageUrl: ""
        }, initFieldsValidators: {
            title: validateTitle,
            duration: validateDuration,
            description: validateDescription,
            summary: validateSummary
        }
    });

    const [globalError, setGlobalError] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createEvent = useCreateEvent()
    const navigate = useNavigate()

    async function onSubmit(form: EventCreateDTO) {
        try {
            createEvent.mutate(form, {
                onError: (error) => {
                    setGlobalError([`Error during saving event ${error.message}`]);
                    toast.error("Failed to create event");
                },
                onSuccess: (savedEvent) => {
                    reset();
                    fileInputRef.current!.value = "";
                    closeModal();
                    navigate("/events");
                    toast.success("New event sucesfully created");
                }
            })


        } catch (e: unknown) {
            if (e instanceof Error) {
                toast.error(`Error during saving event ${e.message}`);
                setGlobalError([`Error during saving event ${e.message}`]);
            } else {
                toast.error("Error during saving event!");
            }
        }
    }


    const imageSrc = formValues.image || formValues.imageUrl;

    return <>

        <form onSubmit={handleSubmit(onSubmit)}>
            <ErrorField errors={globalError} />
            <div>
                <Input label="Title" {...register("title")} />
                <Input label="Description" {...register("description")} />
                <Input label="Summary" {...register("summary")} />
                <Input label="Duration in days" {...register("duration")} type="number" />
                <Input label="Start date" {...register("date")} type="date" />
                {imageSrc && <img src={imageSrc} className="max-h-24 max-w-48 m-2 border" onClick={() => fileInputRef.current?.click()} />}
                <Input label="Image" ref={fileInputRef} {...register("imageUrl", { type: "file" })} type="file" />
            </div>
            <div className="actions">
                <Button textonly={true} onClick={closeModal}>Cancel</Button>
                <Button disabled={!isFormReady()}>Create</Button>
            </div>
        </form>

    </>

}

export default CreateEventForm_v2
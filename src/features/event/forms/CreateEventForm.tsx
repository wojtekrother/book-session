import  {  useRef, useState } from "react"
import Input from "../../../components/ui/Input"
import Button from "../../../components/ui/Button"
import { toast } from "react-toastify"
import { useCreateEvent } from "../../../services/api/EventApiQuery"
import useForm from "../../../hooks/useForm"
import { EventCreateDTO } from "../schema/event.shema"
import { validateDescription, validateDuration, validateSummary, validateTitle } from "../../shared/validator/fieldValidators"
import ErrorField from "../../../components/ui/ErrorField"



type CreateEventModalProps = {
    closeModal: () => void
}



const CreateEventForm_v2 = ({ closeModal, ...props }: CreateEventModalProps) => {
    const { handleSubmit, register, isFormReady } = useForm<EventCreateDTO>({
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
    const abortControler = new AbortController();


    // useEffect(() => {
    //     if (fileInputRef.current) {
    //         fileInputRef.current.addEventListener('change', (event) => {
    //             if (event.target) {
    //             event.target.value = await convertFileToString(event.target.value as File)
    //             }
    //             console.log("Jestem pierwszy (faza capturing)!");
    //         }, true);
    //     }
    // }, [])



    async function onSubmit(form: EventCreateDTO) {
        let imageUrl: String | undefined;

        // if (form.image != null) {
        //     imageUrl = await convertFileToString(image as File)
        // } else {
        //     errorsTemp.push("Image is required")
        // }



        try {
            createEvent.mutate(form, {
                onError: (error) => {
                    setGlobalError([error.message]);
                },
                onSuccess: () => { toast.success("New event sucesfully created") }
            })
            //event.currentTarget.reset()

            toast.success("New event sucesfully created")

        } catch (e: unknown) {
            if (e instanceof Error) {
                toast.error(`Error during saving event ${e.message}`)
                setGlobalError([`Error during saving event ${e.message}`])
            } else {
                toast.error("Error during saving event!")
            }
        }
    }




    return <>

        <form onSubmit={handleSubmit(onSubmit)}>
            <ErrorField errors={globalError} />
            <div>
                <Input label="Title" {...register("title")} />
                <Input label="Description" {...register("description")} />
                <Input label="Summary" {...register("summary")} />
                <Input label="Duration in days" {...register("duration")} type="number" />
                <Input label="Start date" {...register("date")} type="date" />
                <Input label="Image"  {...register("image", {type:"file"})} type="file" className="hidden" />
                <Input label="Image" {...register("imageUrl", {type:"file"})} type="file" />
            </div>
            <div className="actions">
                <Button textOnly onClick={closeModal}>Cancel</Button>
                <Button disabled={!isFormReady()}>Create</Button>
            </div>
        </form>

    </>

}

export default CreateEventForm_v2
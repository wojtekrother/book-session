import { useEffect, useRef, useState } from "react"
import Input from "../../../shared/components/ui/Input"
import Button from "../../../shared/components/ui/Button"
import { toast } from "react-toastify"
import { useCreateEvent } from "../../../services/api/EventApiQuery"
import useForm from "../../../shared/hooks/useForm"
import { EventCreateDTO, } from "../schema/event.shema"
import { validateDescription, validateDuration, validateNewEventDate, validateSummary, validateTitle } from "../../shared/validator/fieldValidators"
import ErrorField from "../../../shared/components/ui/ErrorField"
import { useNavigate } from "react-router-dom"
import Select from "../../../shared/components/ui/Select"
import TextArea from "../../../shared/components/ui/TextArea"

type CreateEventModalProps = {
    closeModal: () => void,
    openModal: () => void
}

const CreateEventForm_v2 = ({ closeModal, openModal }: CreateEventModalProps) => {


    const { handleSubmit, register, isFormReady, reset, setAllValues: setFormValues } = useForm<EventCreateDTO>({
        initialValue: {
            title: "",
            date: new Date(),
            description: "",
            duration: 1,
            summary: "",
            category: "uncategorized",
            image: null
        },
        initFieldsRequired: {
            title: true,
            date: false,
            description: true,
            duration: false,
            summary: true,
            category: true,
            image: false,
        }, initFieldsValidators: {
            title: validateTitle,
            duration: validateDuration,
            description: validateDescription,
            summary: validateSummary,
            date: validateNewEventDate
        }
    });

    const [globalError, setGlobalError] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createEvent = useCreateEvent();

    const navigate = useNavigate();
    const [preview, setPreview] = useState<string>();


    useEffect(() => {
        if (!fileInputRef.current?.files?.[0]) {
            setPreview(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(fileInputRef.current?.files?.[0]);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [fileInputRef.current?.files?.[0]]);

    function getRandomString(length: number) {
        if (length >= 11) {
            length = 10;
        }
        if (length < 1) {
            length = 1;
        }
        return (Math.random() + 1).toString(36).substring(11 - length);
    }

    function setRandomData() {
        setFormValues({
            title: `title ${getRandomString(3)}`,
            description: `description ${getRandomString(4)}`,
            date: new Date(),
            duration: Math.ceil(Math.random() * 4),
            summary: `Summary ${getRandomString(4)}`,
            category: "uncategorized",
            image: null
        })
    }


    function restoreFormAndOpenModal(form: EventCreateDTO, openModal: () => void) {
        setFormValues(form);
        openModal();
    }

    function Msg({ openModal }: { openModal: () => void }) {
        return (
            <div>
                <h3>Failed to create event</h3>
                <button className="border border-purple-400 p-2 rounded-md" onClick={openModal}>
                    Open form again
                </button>
            </div>
        );
    }


    async function onSubmit(form: EventCreateDTO) {
        closeModal();
        navigate("/events");
        createEvent.mutate(form, {
            onError: (error, variables: EventCreateDTO) => {
                setGlobalError([`Error during saving event ${error.message}`]);
                toast.error("Failed to create event");
                toast(<Msg openModal={() => restoreFormAndOpenModal(form, openModal)} ></Msg>)

                setFormValues(variables)
            },
            onSuccess: (_savedEvent) => {
                reset();
                fileInputRef.current!.value = "";
                toast.success("New event sucesfully created");
            },
        })
    }


    return <>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
            <ErrorField errors={globalError} />
            <div>
                { }
                <Input label="Title" {...register("title")} />
                <TextArea label="Description" {...register("description")} />
                <Input label="Summary" {...register("summary")} />
                <Select id="koko" label="Category" {...register("category")} >
                    <option value="science" >Science</option>
                    <option value="culture" >Culture</option>
                    <option value="entertainment" >Entertainment</option>
                    <option value="uncategorized" >Other</option>
                </Select>
                <Input label="Duration in days" {...register("duration")} type="number" />
                <Input label="Start date" {...register("date", { type: "date" })} type="date" />
                <img src={preview} className="max-h-xl max-w-xl min-w-xl min-h-28 m-2 border" onClick={() => fileInputRef.current?.click()} />
                <Input label="Image" ref={fileInputRef} {...register("image", { type: "file" })} type="file" />
            </div>
            <div className="actions">
                <Button textonly={true} onClick={closeModal}>Cancel</Button>
                <Button type="button" onClick={setRandomData} className="bg-green-400 text-sm">Set random Data</Button>
                <Button disabled={!isFormReady()}>Create</Button>
            </div>
        </form>

    </>

}

export default CreateEventForm_v2
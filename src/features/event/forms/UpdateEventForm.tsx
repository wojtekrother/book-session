import { useEffect, useRef, useState } from "react"
import Input from "../../../shared/components/ui/Input"
import Button from "../../../shared/components/ui/Button"
import { toast } from "react-toastify"
import { useUpdateEvent } from "../../../services/api/EventApiQuery"
import { EventDTO, EventUpdateDTO, updateEventSchema } from "../schema/event.schema"
import ErrorField from "../../../shared/components/ui/ErrorField"
import { useNavigate } from "react-router-dom"
import Select from "../../../shared/components/ui/Select"
import TextArea from "../../../shared/components/ui/TextArea"
import { useForm } from "react-hook-form";
import { EventApi } from "../../../services/api/EventApi"
import { zodResolver } from "@hookform/resolvers/zod";

type UpdateEventModalProps = {
    closeModal: () => void,
    openModal: () => void,
    eventToEdit: EventDTO
}

const UpdateEventForm_RHF = ({ closeModal, openModal, eventToEdit }: UpdateEventModalProps) => {


    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValues,
        setValue,
        watch,
        reset,

    } = useForm<EventUpdateDTO>({
        resolver: zodResolver(updateEventSchema),
        defaultValues: eventToEdit,
        mode: "onBlur"
    });


    const [globalError, setGlobalError] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updateEvent = useUpdateEvent();

    const navigate = useNavigate();
    const [preview, setPreview] = useState<string>();
    console.log(errors)

    const file = watch("image");
    useEffect(() => {
        if (!file) {
            setPreview(EventApi.getEventImageOriginal(eventToEdit.id!));
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    function restoreFormAndOpenModal(form: EventUpdateDTO, openModal: () => void) {
        setValues(form);
        openModal();
    }

    function ToastMsgFailedUpdate({ openModal }: { openModal: () => void }) {
        return (
            <div>
                <h3>Failed to Update event</h3>
                <button className="border border-purple-400 p-2 rounded-md" onClick={openModal}>
                    Open form again
                </button>
            </div>
        );
    }


    async function onSubmit(form: EventUpdateDTO) {
        closeModal();
        navigate("/events/" + form.id);

        updateEvent.mutate(form, {
            onError: (error, variables: EventUpdateDTO) => {
                
                setGlobalError([`Error during saving event ${error.message}`]);
                toast(<ToastMsgFailedUpdate openModal={() => restoreFormAndOpenModal(form, openModal)} />)
                setValues(variables);
            },
            onSuccess: (_savedEvent) => {
                fileInputRef.current!.value = "";
                toast.success("Event sucesfully updated");
            },
        })

    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
            <ErrorField errors={globalError} />
            <div>
                <Input label="Title" {...register("title")} error={errors.title?.message} />
                <TextArea label="Description" {...register("description")} error={errors.description?.message} />
                <Input label="Summary" {...register("summary")} error={errors.summary?.message} />
                <Select label="Category" {...register("category")} error={errors.category?.message} >
                    <option value="science" >Science</option>
                    <option value="culture" >Culture</option>
                    <option value="entertainment" >Entertainment</option>
                    <option value="uncategorized" >Other</option>
                </Select>
                <Input label="Duration in days"
                    {...register("duration", { valueAsNumber: true })}
                    error={errors.duration?.message}
                    type="number" />
                <Input label="Start date" {...register("date", { valueAsDate: false, })} error={errors.date?.message} type="date" />
                <img src={preview} className="max-h-xl max-w-xl min-w-xl min-h-28 m-2 border" onClick={() => fileInputRef.current?.click()} />
                <Input label="Image"
                    name="image"
                    error={errors.image?.message}
                    onChange={(e) => {
                        setValue("image", e.target.files?.[0] ?? null);
                    }}
                    type="file"
                    ref={fileInputRef} />
            </div>
            <div className="actions">
                <Button textonly={true} onClick={() => { reset(); closeModal() }} type="button">Cancel</Button>
                <Button disabled={!isValid}>Update</Button>
            </div>
        </form>

    </>

}

export default UpdateEventForm_RHF
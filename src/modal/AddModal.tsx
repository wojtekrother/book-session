import { ComponentProps, forwardRef, useImperativeHandle, useRef } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import { createPortal } from "react-dom"


type AddModalProps = {

}

export type AddModalHandler = {
    open: () => void,
    close: () => void
}


const AddModal = forwardRef<AddModalHandler>(({ ...props }: AddModalProps, ref) => {
    const modal = useRef<HTMLDialogElement>(null);

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


    function onSubmit(event: React.FormEvent) {
        event.preventDefault()
    }


    return <>{modalRootElement ? createPortal(
        <dialog ref={modal} className="modal">
            <form onSubmit={onSubmit}>
                <div>
                    <Input label="Name" name="name" />
                    <Input label="Description" name="description" />
                </div>
                <div className="actions">
                    <Button textOnly onClick={closeModal}>Cancel</Button>
                    <Button >Create</Button>
                </div>
            </form>
        </dialog>, modalRootElement) : null}</>

})

export default AddModal
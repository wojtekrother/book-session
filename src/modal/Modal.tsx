import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useEventContext } from "../context/old/EventContext.old"


type ModalProps = {
    children: React.ReactNode,
}

export type ModalHandler = {
    open: () => void,
    close: () => void
}


const CreateEventModal = forwardRef<ModalHandler, ModalProps>(({ children, ...props }: ModalProps, ref) => {
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
            },
            isOpen: () => {
                isOpenModal()
            }

        }
    })


    function showModal() {
        modal.current?.showModal();
    }

    function closeModal() {
        modal.current?.close();
    }
    function isOpenModal() {
        modal.current?.open
    }









    return <>{modalRootElement ? createPortal(
        <dialog ref={modal} className="modal mx-auto p-5">
            <button className="close-button" aria-label="Zamknij">&times;</button>
            <div className="modal-content">
                Tutaj jest treść
                {children}
            </div>

        </dialog>, modalRootElement) : null}</>

})

export default CreateEventModal
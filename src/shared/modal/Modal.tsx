import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { createPortal } from "react-dom"



export type ModalProps = {
    children: React.ReactNode,
}


export type ModalHandler = {
    open: () => void,
    close: () => void,
    isOpen: () => void
}


const Modal = forwardRef<ModalHandler, ModalProps>(({ children, ...props }: ModalProps, ref) => {
    const modal = useRef<HTMLDialogElement>(null);
    const [modalRootElement, setModalRootElement] = useState<HTMLElement | null>(null)


    useEffect(() => {
        setModalRootElement(document.getElementById("modal-root"))
    }, [])

    useEffect(() => {
        const closeOnEscapePressed = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };
        window.addEventListener("keydown", closeOnEscapePressed);
        return () =>
            window.removeEventListener("keydown", closeOnEscapePressed);
    }, []);


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
        <dialog ref={modal} className="modal mx-auto p-6 m-3 rounded-2xl">
            <button className="close-button h-6 w-6  absolute -top-1 text-3xl right-2 "
                aria-label="Close"
                onClick={closeModal}>&times;</button>
            <div className="modal-content">
                {children}
            </div>

        </dialog>, modalRootElement) : null}</>

})

export default Modal
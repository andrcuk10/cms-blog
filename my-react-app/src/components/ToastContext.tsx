// ToastContext.tsx
import { createContext, useContext, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type ToastType = "success" | "danger";

type ToastContextType = {
    showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<ToastType>("success");

    const showToast = (message: string, type: ToastType = "success") => {
        setMessage(message);
        setType(type);
        setShow(true);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast bg={type} show={show} onClose={() => setShow(false)} delay={3000} autohide>
                    <Toast.Body className="text-white">{message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </ToastContext.Provider>
    );
};
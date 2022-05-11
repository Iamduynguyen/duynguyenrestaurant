import Swal from "sweetalert2";

const ModalMessage = {
    miniTopRightModal: (type, message) => {
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
        Toast.fire({
            icon: type,
            title: message,
        });
    },
    middleModal(type, title, message) {
        Swal.fire(title, message, type);
    },
};

export default ModalMessage;
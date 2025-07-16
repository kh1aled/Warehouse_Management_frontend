import Swal from "sweetalert2";

export const createToast = () => {
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background') || "#333";
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground') || "#fff";

    return Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        background: backgroundColor,
        color: textColor,
    });
};

export const createAlert = () => {
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background') || "#333";
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground') || "#fff";

     return Swal.mixin({
        showConfirmButton: false,
        timer: 2000,
        background: backgroundColor,
        color: textColor,
    });
}


export const createConfirm = () => {
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background') || "#333";
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground') || "#fff";

     return Swal.mixin({
        showConfirmButton: true,
        showCancelButton : true,
        background: backgroundColor,
        color: textColor,
    });
}
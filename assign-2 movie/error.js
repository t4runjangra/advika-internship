 function showErrorToast(message, duration = 3000) {
        const toast = document.getElementById('error-toast');
        toast.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hidden');
        }, duration);
    }


export {showErrorToast}
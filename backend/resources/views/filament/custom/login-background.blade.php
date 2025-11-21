<style>
    /* Custom Login Page Background - Luxury Navy & Bronze Theme */
    .fi-main-ctn {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%),
                    url('/images/login-bg.jpg') center center / cover no-repeat;
        min-height: 100vh;
        position: relative;
    }

    .fi-main-ctn::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.85) 100%);
        z-index: 0;
    }

    /* Center the login card */
    .fi-main-ctn > div {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
    }

    /* Style the login card */
    .fi-simple-main-ctn {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        border-radius: 1rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 28rem;
        width: 100%;
        padding: 2rem;
        border: 1px solid rgba(180, 145, 98, 0.2);
    }

    /* Bronze accent on card */
    .fi-simple-main-ctn::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #B49162 0%, #9A7A4F 100%);
        border-radius: 1rem 1rem 0 0;
    }

    /* Logo styling */
    .fi-simple-header img {
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    }

    /* Button styling */
    .fi-btn-primary {
        background: linear-gradient(135deg, #B49162 0%, #9A7A4F 100%);
        border: none;
        box-shadow: 0 4px 12px rgba(180, 145, 98, 0.3);
        transition: all 0.3s ease;
    }

    .fi-btn-primary:hover {
        background: linear-gradient(135deg, #9A7A4F 0%, #8A6A3F 100%);
        box-shadow: 0 6px 16px rgba(180, 145, 98, 0.4);
        transform: translateY(-1px);
    }

    /* Input focus styling */
    .fi-input:focus {
        border-color: #B49162;
        box-shadow: 0 0 0 3px rgba(180, 145, 98, 0.1);
    }

    /* Link styling */
    .fi-simple-main-ctn a {
        color: #B49162;
        transition: color 0.2s ease;
    }

    .fi-simple-main-ctn a:hover {
        color: #9A7A4F;
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
        .fi-main-ctn > div {
            padding: 1rem;
        }

        .fi-simple-main-ctn {
            padding: 1.5rem;
        }
    }

    /* Fallback if background image doesn't exist */
    .fi-main-ctn {
        background-color: #0F172A;
    }
</style>


import React from 'react'
import styles from './index.module.scss' // Импортируем SCSS файл

interface ModalProps {
    isOpen: boolean // Состояние модального окна (открыто/закрыто)
    onClose: () => void // Функция для закрытия модального окна
    children: React.ReactNode // Контент модального окна
}

const ModalWindow: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null // Если модальное окно закрыто, не рендерим его

    return (
        <div className={styles.modal_overlay}>
            <div className={styles.modal_content}>
                {/* Кнопка закрытия */}
                <button className={styles.modal_close_button} onClick={onClose}>
                    ×
                </button>

                {/* Контент модального окна */}
                <div className={styles.modal_body}>{children}</div>
            </div>
        </div>
    )
}

export default ModalWindow

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { child, get, getDatabase, push, ref, serverTimestamp, set, update } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import FChatContext from '../context/FChatContext';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Cloudinary } from '@cloudinary/url-gen';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import { useParams } from 'react-router-dom';

export const FormMessage = ({ chatId }: { chatId: string }) => {
    const { userData } = useContext(FChatContext);
    const [errorUploading, setErrorUploading] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [base64Image, setBase64Image] = useState<string>('');

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    setBase64Image(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [file]);

    useEffect(() => {
        const uploadImage = async () => {
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', 'corcho');

                    const response = await fetch('https://api.cloudinary.com/v1_1/dgrhyyuef/image/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    const data = await response.json();
                    const downloadURL = data.secure_url;
                    sendMessage({ msg: downloadURL, type: 'img' });
                } catch (error) {
                    console.error(error);
                    setErrorUploading('Se ha producido un error subiendo el archivo.');
                }
            }
        };

        uploadImage();
    }, [file]);

    const handleSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const mensaje = (form.elements.namedItem('mensaje') as HTMLInputElement).value;
        (form.elements.namedItem('mensaje') as HTMLInputElement).value = '';
        if (mensaje.trim()) {
            sendMessage({ msg: mensaje, type: 'text' });
        }
    };

    const sendMessage = async ({ msg, type }: { msg: string, type: string }) => {
        if (userData && msg.trim() !== '') {
            const database = getDatabase();
            const messagesRef = ref(database, `chats/${chatId}/messages`);
            const newMessageRef = push(messagesRef);

            const messageData = {
                msg,
                type,
                sendDate: serverTimestamp(),
                authorUid: userData.uid,
                read: false // Asegúrate de marcar el mensaje como no leído al enviarlo
            };

            try {
                await set(newMessageRef, messageData);

                // Obtén el ID del usuario receptor del chat
                const [userId1, userId2] = chatId.split('_');
                const receiverUid = userId1 === userData.uid ? userId2 : userId1;

                // Obtén el contador actual de mensajes no leídos para el receptor
                const unreadCountRef = ref(database, `users/${receiverUid}/unreadCounts/${chatId}`);
                const snapshot = await get(unreadCountRef);
                const currentCount = snapshot.exists() ? snapshot.val().count : 0;

                // Actualiza el conteo de mensajes no leídos para el receptor
                await update(unreadCountRef, {
                    count: currentCount + 1
                });

                console.log('Mensaje enviado y notificación actualizada');
            } catch (error) {
                console.error('Error enviando mensaje:', error);
            }
        }
    };

    return (
        <form id="form-mensaje" onSubmit={handleSubmitMessage} className="d-flex align-items-center">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                style={{ display: 'none' }}
                id="file-input"
            />
            <button
                type="button"
                onClick={() => (document.getElementById('file-input') as HTMLInputElement).click()}
                className="btn btn-outline-primary"
            >
                📷
            </button>
            <input
                type="text"
                name="mensaje"
                placeholder="Escribe un mensaje..."
                className="form-control ms-2"
            />
            <button type="submit" className="btn btn-primary ms-2">Enviar</button>
            {errorUploading && <div className="text-danger mt-2">{errorUploading}</div>}
        </form>
    );
};

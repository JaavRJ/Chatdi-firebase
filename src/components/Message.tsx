import moment from 'moment';
import React, { useContext } from 'react';
import FChatContext from '../context/FChatContext';
import { MessageInterface } from '../types/MessageInterface';
import { useState } from "react";
import { getDatabase, ref, update } from 'firebase/database';
import "../css/Messages.css";

import twemoji from '@twemoji/api';
import { Link } from 'react-router-dom';

const emojis = ['❤️', '👍🏼', '🙀', '😿', '😹', '🙏🏼', '🦈'];

export const Message: React.FC<MessageInterface & { showUsername: boolean }> = ({ msg, author, idmsg, chatId, showUsername }) => {
    const { loadingUser, userData } = useContext(FChatContext);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

    if (loadingUser || !userData || !author) return <></>;

    const isOutgoing = userData.uid === author.uid;
    console.log(msg)

    const classMessage = `message p-2 rounded-4 ${isOutgoing ? 'bg-dark text-white' : 'bg-light text-dark'}`;
    const classReverse = isOutgoing ? "flex-row-reverse" : "";
    const classImg = isOutgoing ? "ms-2" : "me-2";
    const classAlignText = isOutgoing ? "text-end" : "text-start";

    const formatFecha = (fecha_raw: number) => {
        const fecha = moment(fecha_raw);
        return fecha.isSame(moment(), "day") ? fecha.format('HH:mm') : fecha.format('HH:mm DD/MM');
    };

    const handleEmojiClick = (emoji: string) => {
        setSelectedEmoji(emoji);
        setShowEmojiPicker(false);

        const reactionUpdate = {
            [userData.uid]: emoji,
        };
        const database = getDatabase();
        const reactionPath = `chats/${chatId}/messages/${idmsg}/reactions/${userData.uid}`;
        update(ref(database, reactionPath), reactionUpdate);
    };

    const handleDoubleClick = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const parseEmoji = (emoji: string) => {
        const parsed = twemoji.parse(emoji);
        return <span dangerouslySetInnerHTML={{ __html: parsed }} />;
    };


    return (
        <div className="row py-1 mx-2" style={{ display: 'flex', justifyContent: isOutgoing ? 'flex-end' : 'flex-start' }}>
            <div className={"col-xl-10 " + classMessage} 
                 style={{ position: 'relative', display: 'inline-block', width:'auto' , maxWidth: '45%' }}
                 onDoubleClick={handleDoubleClick}>
                
                {!isOutgoing && showUsername && (
                    <div className={"user px-2 py-1 d-flex border-bottom border-muted align-items-center " + classReverse}>
                        <div className="avatar">
                            {author.avatar && (<img src={author.avatar} width="25" height="25" className={"rounded-circle d-flex align-self-center border-white " + classImg} alt={author.username} />)}
                        </div>
                        <div className="username fw-bold" style={{ color: 'rgb(52 58 64 / 60%)' }}>
                        <Link to={`/user/${author.uid}`} className="no-link-style">
                            {author.username}
                        </Link>
                        </div>
                    </div>
                )}
                
                <div className={"text py-3 ps-2 " + classAlignText} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color:'rgb(52 58 64 / 80%)', paddingRight:'0.5rem' }}>
                    {(!msg.type || msg.type === '' || msg.type === 'text')
                        ? (msg.msg)
                        : (<img id={idmsg} src={msg.msg} className="mb-2 no-select no-drag" 
                            style={{ maxWidth: '100%', maxHeight:'500px' }} alt="" onClick={() => document.getElementById(idmsg)?.requestFullscreen()} />)
                    }
                </div>

            
                {showEmojiPicker && (
                    <div className={`emoji-picker ${isOutgoing ? 'sent' : 'received'}`}>
                        {emojis.map(emoji => (
                            <span
                                key={emoji}
                                dangerouslySetInnerHTML={{ __html: twemoji.parse(emoji) }}
                                onClick={() => handleEmojiClick(emoji)}
                            />
                        ))}
                    </div>
                )}

                <div className="fecha fw-light fst-italic text-end" style={{ position: 'absolute', bottom: '0px', right: '10px', color:'rgb(52 58 64 / 60%)', fontSize:'0.600em' }}>
                    {formatFecha(msg.sendDate)}
                </div>

                <div className="emoji-container">
                    {selectedEmoji ? (
                        <span className="emoji-bubble">
                        {parseEmoji(selectedEmoji)}
                        </span>
                    ) : (
                        msg.reactions && Object.values(msg.reactions).map((reaction, index) => (

                            Object.values(reaction).map((reaction, index) => (
                            <span key={index} className="emoji-bubble">
                                {parseEmoji(reaction)}
                            </span>
                            ))
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

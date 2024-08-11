import moment from 'moment';
import React, { useContext } from 'react';
import FChatContext from '../context/FChatContext';
import { MessageInterface } from '../types/MessageInterface';

export const Message: React.FC<MessageInterface> = ({ msg, author, idmsg }) => {

    const { loadingUser, userData } = useContext(FChatContext);

    if (loadingUser || !userData || !author) return <></>;

    const isOutgoing = userData.uid === author.uid;

    

    const classMessage = `message p-2 rounded-4 ${isOutgoing ? 'bg-dark text-white' : 'bg-light text-dark'}`;
    const classReverse = isOutgoing ? "flex-row-reverse" : "";
    const classImg = isOutgoing ? "ms-2" : "me-2";
    const classAlignText = isOutgoing ? "text-end" : "text-start";

    const formatFecha = (fecha_raw: number) => {
        const fecha = moment(fecha_raw);
        return fecha.isSame(moment(), "day") ? fecha.format('HH:mm') : fecha.format('HH:mm DD/MM');
    };

    return (
        <div className="row py-2 mx-2" style={{ display: 'flex', justifyContent: isOutgoing ? 'flex-end' : 'flex-start' }}>
            <div className={"col-xl-10 " + classMessage} style={{ position: 'relative', display: 'inline-block', width:'auto' , maxWidth: '45%' }}>
                {
                    !isOutgoing && (
                        <div className={"user px-2 py-1 d-flex border-bottom border-muted align-items-center " + classReverse}>
                            <div className="avatar">
                                {author.avatar && (<img src={author.avatar} width="25" height="25" className={"rounded-circle d-flex align-self-center border-white " + classImg} alt={author.username} />)}
                            </div>
                            <div className="username fw-bold" style={{ color: 'rgb(52 58 64 / 60%)' }}>
                                {author.username}
                            </div>
                        </div>
                    )
                }
                <div className={"text py-3 ps-2 " + classAlignText} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color:'rgb(52 58 64 / 80%)' }}>
                    {
                        (!msg.type || msg.type === '' || msg.type === 'text')
                            ? (msg.msg)
                            : (<img id={idmsg} src={msg.msg} className="mb-2" style={{ maxWidth: '100%' }} alt="" onClick={() => document.getElementById(idmsg)?.requestFullscreen()} />)
                    }
                </div>
                <div className="fecha small fw-light fst-italic text-end" style={{ position: 'absolute', bottom: '0px', right: '10px', color:'rgb(52 58 64 / 60%)' }}>
                    {formatFecha(msg.sendDate)}
                </div>
            </div>
        </div>
    );
};
    
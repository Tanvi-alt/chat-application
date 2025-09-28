import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children }) =>{

    const [ messages, setMessages ] = useState([]); //whole messages
    const [ users, setUsers ] = useState([]); //sidebar users
    const [ selectedUser, setSelectedUser ] = useState(null) //selected user Id
    const [ unseenMessages, setUnseenMessages ] = useState({}) // user id and no of unseen messages ( key: value)

    const { socket, axios } = useContext(AuthContext);

    //function to get all the users for sidebar

    const getUsers = async () =>{
        try {
            const { data } = await axios.get('/api/messages/users');
            if ( data.success ){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    //function to get messgaes for selected users

    const getMessages = async ( userId ) =>{
        try {
          const { data } =  await axios.get(`/api/messages/${userId}`);
          if ( data.success){
            setMessages(data.messages);
          }
        } catch (error) {
             toast.error(error.message);
        }
    }

    //fn to send message to selected user 
    const sendMessage = async (messageData) =>{
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if ( data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    //function to subscribe to messages for sekected user

    const subscribeToMessages = async()=>{
        if ( !socket) return;
        socket.on("newMessage", (newMessage)=>{
            if ( selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=>[...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [ newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? 
                    prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    //function to unsubscribe from messages
    const unsubscribeFromMessages = () =>{
        if (socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    },[ socket, selectedUser])



    const value = {
        messages, users, selectedUser, getUsers, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages, getMessages
    }
    return (<ChatContext.Provider value={value}>
        { children }
    </ChatContext.Provider>)
}
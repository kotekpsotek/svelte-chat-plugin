<script lang="ts">
    import { Socket, io } from "socket.io-client";
    import { ChatOperational, ProgressBarRound } from "carbon-icons-svelte"
    import { onMount } from "svelte";
    import ChatDetermined from "./ChatDetermined.svelte";
    import ChatComp from "../../../../../client/Chat.svelte"
    import type { Chat as ChatType } from "../../../../../../types";
    import AlertSvelte from "../../../../../../lib/client/Alert.svelte"
    import Alert from "../../../../../../lib/client/Alert.svelte";
    import setIdCookie from "../../../../../../lib/client/lib";
    import type { LayoutData } from "../$types";
    
    // Page values from loading stuff
    export let data: LayoutData;

    let connection: Socket;
    let chats: ChatType[] = [];

    let loading: boolean = true;
    let adminEmail: string;
    let newChatId: string | undefined;
    
    function goToChat() {
        loading = true;
        connection.emit("get-admin-chats", (success: boolean, chatsPayload: ChatType[]) => {
            chats = chatsPayload;
            loading = false;
        });
    }

    
    let chatOpened = false;
    let chatG: Partial<ChatType> = {};
    function openChat(chat: ChatType) {
        return () => {
            chatOpened = true;
            connection.emit("join-to-chat", chat.id, adminEmail);
            chatG = chat;
        }
    }

    function onCloseChat() {
        chatOpened = false;

        // Unmark last chat as new one
        if (chatG.id == newChatId) {
            newChatId = undefined;
        }
        
        // Emit leave chat event
        connection.emit("leave-chat", chatG.id);
    }

    /** Remove chat deleted by admin from list */
    function onRemoveChat({ detail: chatId }: CustomEvent<string>) {
        const chatPositionOnList = chats.findIndex(v => v.id == chatId);
        const deletedChat = chats.splice(chatPositionOnList, 1);
        chats = chats;
        onCloseChat();

        // Success Alert
        new AlertSvelte({
            target: document.body,
            props: {
                type: "success",
                message: `You deleted the chat with id '${deletedChat[0].id}'`,
                temporaryMs: 5_000 // 5 seconds
            }
        });
    }

    /** Delete chat from list  */
    function deleteChat(chat_id: string) {
        const terminatedChatId = chats.findIndex(v => v.id == chat_id);

        if (terminatedChatId >= 0) {
            const deletedChat = chats.splice(terminatedChatId, 1);
            chats = chats;
            return deletedChat;
        }
    } 

    onMount(() => {
        connection = io(`http://localhost:${data.server.port}`, {
            withCredentials: true
        });

        const url = new URL(document.URL);
        const redFrom = url.searchParams.get("red_from");
        const justSignin = url.searchParams.has("signin");

        if (redFrom) {
            new Alert({
                target: document.body,
                props: {
                    type: "info",
                    message: "You had been redirected to panel page. Before this alret close itself you should know that this route is only one appropriate to manage all chats as admin!",
                    temporaryMs: 20_000 // 20 seconds
                }
            })
        }
        else if (justSignin) {
            new Alert({
                target: document.body,
                props: {
                    type: "info",
                    message: "You are signed-in. You had been signed-in moment ago",
                    temporaryMs: 10_000 // 20 seconds
                }
            })
        }

        connection.emit("admin-get-email", (email: string | undefined) => {
            if (!email) {
                alert("you probably isn't logged in")
            } 
            else {
                adminEmail = email;

                // Set admin uuid
                setIdCookie(adminEmail);
            };
        });

        connection.on("admin-new-chat-arrived", (chat: ChatType) => {
            const append = new AlertSvelte({
                target: document.body,
                props: {
                    type: "info",
                    message: `New chat had arrived from user ${chat.user_creator}`,
                    temporaryMs: 15_000 // 15 seconds
                }
            });

            // Mark this chat as new one
            newChatId = chat.id;

            chats = [chat, ...chats];
        });

        // (Only when terminated chat is open) Capture this admin user terminate user chat
        connection?.on("chat-terminated-by-admin", (chat_id: string) => {
            // Close chat, only while user is in
            onCloseChat();

            setTimeout(() => {
                // Delete chat
                const deletedChat = deleteChat(chat_id);
    
                // Alert with information
                const infoAlert = new Alert({
                    target: document.body,
                    props: {
                        type: "info",
                        message: `Case '${deletedChat![0].name}' which has been opened by you was terminated by other admin`,
                        temporaryMs: 5_000 // 5 seconds
                    }
                })
            })
        });

        // Capture chat was closed by other admin user
        connection?.on("other-admin-terminate-room", (chatId: string, email: string) => {
            // Only in circuminstances: terminating user is not this user and chat id is not equal to current id
            if (adminEmail != email) {
                // Close chat when was terminated current
                onCloseChat();

                setTimeout(() => {
                    // Delete chat from list
                    const deletedChat = deleteChat(chatId);
    
                    // Display alert
                    const infoAlert = new Alert({
                        target: document.body,
                        props: {
                            type: "info",
                            message: `Case '${deletedChat![0].name}' has been terminated by other admin '${email}'`,
                            temporaryMs: 5_000 // 5 seconds
                        }
                    });
                });
            }
        });
        
        setTimeout(goToChat, 1_000)
    })
</script>


{#if !chatOpened}
    <div class="panel">
        <h1>Admin Panel</h1>
        <div class="chats">
            {#if !loading}
                {#if chats.length}
                    {#each chats as chat}
                        <button id="chat" class:new-chat={chat.id == newChatId} on:click={openChat(chat)}>
                            <ChatOperational size={24}/>
                            <p>{chat.name ? chat.name : new Date(chat.creation_date).toLocaleString()}</p>
                        </button>
                    {/each}
                {:else}
                    <div class="no-chats">
                        <p>No chats, No worry 🕳️!</p>
                    </div>
                {/if}
            {:else}
                <div class="loading">
                    <div>
                        <div id="animation">
                            <ProgressBarRound size={32}/>
                        </div>
                        <p>Loading...</p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{:else}
    <ChatComp {connection} adminMode={true} chat={chatG} userId={adminEmail} on:close-chat={onCloseChat} on:hide-chat-messages={onCloseChat} on:remove-chat={onRemoveChat}/>
{/if}

<style>
    .panel {
        padding: 10px;
        width: 100vw;
        height: 100vh;
        overflow-y: auto;
        background-color: rgb(201, 201, 201);
    }

    .chats {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        height: fit-content;
    }
    
    .chats #chat {
        height: 55px;
        padding-left: 10px;
        padding-right: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        column-gap: 10px;
        border-radius: 0px;
        background-color: white;
        color: black;
        border-bottom: 1px black solid;
        font-weight: 500;
    }

    .chats #chat:last-of-type {
        border-bottom: none;
    }

    .no-chats {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        font-weight: 700;
    }

    .loading {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
    }

    .loading > div:first-of-type {
        display: flex;
        column-gap: 10px;
        justify-content: center;
        align-items: center;
    }

    button.new-chat {
        background-color: black !important;
        color: white !important;
    }

    #animation {
        animation: rotate 300ms linear forwards infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }
</style>

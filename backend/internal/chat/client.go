package chat

import "github.com/gorilla/websocket"

type Client struct {
    Conn   *websocket.Conn
    Send   chan Message
    UserID string
}

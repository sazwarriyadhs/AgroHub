package ws

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

func ServeWs(hub *Hub, c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        return
    }

    client := &Client{
        Hub:  hub,
        Conn: conn,
        Send: make(chan []byte, 256),
    }

    hub.Register <- client

    go client.readPump()
    go client.writePump()
}

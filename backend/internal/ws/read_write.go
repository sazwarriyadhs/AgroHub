package ws

import (
    "time"
)

func (c *Client) readPump() {
    defer func() {
        c.Hub.Unregister <- c
        c.Conn.Close()
    }()

    c.Conn.SetReadLimit(512)
    c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))

    for {
        _, msg, err := c.Conn.ReadMessage()
        if err != nil {
            break
        }

        go c.fakeAIStream(string(msg))
    }
}

func (c *Client) writePump() {
    ticker := time.NewTicker(50 * time.Second)

    defer func() {
        ticker.Stop()
        c.Conn.Close()
    }()

    for {
        select {

        case msg, ok := <-c.Send:
            c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))

            if !ok {
                _ = c.Conn.WriteMessage(1, []byte{})
                return
            }

            _ = c.Conn.WriteMessage(1, msg)

        case <-ticker.C:
            _ = c.Conn.WriteMessage(9, nil)
        }
    }
}

package ws

import (
    "fmt"
    "time"
)

func (c *Client) fakeAIStream(message string) {

    response := fmt.Sprintf("🤖 AgroHub AI:\nAnalisis: %s\n\nStatus: processing data kolam...", message)

    for _, ch := range response {
        time.Sleep(15 * time.Millisecond)
        c.Send <- []byte(string(ch))
    }

    c.Send <- []byte("\n[DONE]")
}

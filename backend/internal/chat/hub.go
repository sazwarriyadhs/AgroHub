package chat

type Hub struct {
    Clients    map[*Client]bool
    Broadcast  chan Message
    Register   chan *Client
    Unregister chan *Client
}

func NewHub() *Hub {
    return &Hub{
        Clients:    make(map[*Client]bool),
        Broadcast:  make(chan Message),
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case c := <-h.Register:
            h.Clients[c] = true

        case c := <-h.Unregister:
            delete(h.Clients, c)

        case msg := <-h.Broadcast:
            for client := range h.Clients {
                client.Send <- msg
            }
        }
    }
}

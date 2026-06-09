package ws

type Hub struct {
    Clients    map[*Client]bool
    Register   chan *Client
    Unregister chan *Client
    Broadcast  chan []byte
}

func NewHub() *Hub {
    return &Hub{
        Clients:    make(map[*Client]bool),
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
        Broadcast:  make(chan []byte),
    }
}

func (h *Hub) Run() {
    for {
        select {

        case c := <-h.Register:
            h.Clients[c] = true

        case c := <-h.Unregister:
            if _, ok := h.Clients[c]; ok {
                delete(h.Clients, c)
                close(c.Send)
            }

        case msg := <-h.Broadcast:
            for c := range h.Clients {
                select {
                case c.Send <- msg:
                default:
                    delete(h.Clients, c)
                }
            }
        }
    }
}

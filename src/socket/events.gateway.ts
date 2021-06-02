import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway(3500)
export class EventGateway{

    @WebSocketServer()
    server;

    @SubscribeMessage('action')
    handleActionEvent(@MessageBody() data){
        console.log('action')
        console.log(data)
    }
}


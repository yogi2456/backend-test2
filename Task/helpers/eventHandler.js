import { connect } from "mongoose";

async function publishEvent(event) {
    const nc = await connect({ servers: 'nats://localhost:4222' });

    nc.publish('events', JSON.stringify(event));
    console.log(`[Event Published] ${JSON.stringify(event)}`);

    await nc.close();
}

export default publishEvent;
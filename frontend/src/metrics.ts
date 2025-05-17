import { auth } from './firebaseConfig';

export interface UserEvent {
    eventType: string;
    itemId: string;
    timestamp: string;
    uid: string;
    metadata: object;
}

class Metrics {
    private queue: UserEvent[];

    constructor() {
        this.queue = [];
    }

    trackEvent(eventType: string, itemId: string, metadata: object) {
        const uid = auth.currentUser?.uid;
        if (!uid) {
            return;
        }
        const event: UserEvent = {
            eventType,
            itemId,
            timestamp: new Date().toISOString(),
            uid: uid,
            metadata,
        };

        this.queue.push(event);
    }

    sendQueuedEvents = () => {
        const events = getQueuedEvents();
        events.forEach((event) => sendEvent(event));
    };

    initMetrics = () => {
        setInterval(() => this.sendQueuedEvents(), 3000);
    };
}

export const metrics = new Metrics();

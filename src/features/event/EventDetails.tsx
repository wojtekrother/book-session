import { useParams } from 'react-router-dom';

import { useEventContext } from '../../context/EventContext.tsx';

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const eventCtx = useEventContext();

  const eventId = params.id;
  const loadedEvent = eventCtx.getEvent(eventId!)

  if (!loadedEvent) {
    return (
      <main >
        <p>No event found!</p>
      </main>
    );
  }


  return (
    <main>
      <article>
        <header>
          <img
            src={loadedEvent.image}
            alt={loadedEvent.title}
          />
          <div>
            <h2>{loadedEvent.title}</h2>
            <time dateTime={new Date(loadedEvent.date).toISOString()}>
              {new Date(loadedEvent.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </time>
            <p>
              {/* Todo: Add button that opens "Book Event" dialog / modal */}
            </p>
          </div>
        </header>
        <p id="content">{loadedEvent.description}</p>
      </article>
    </main>
  );
}

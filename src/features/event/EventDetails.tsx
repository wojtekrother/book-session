import { useParams } from 'react-router-dom';
import { useGetEvent } from '../../services/api/EventApiQuery.ts';
import { Oval } from 'react-loader-spinner';

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: loadedEvent, isPending } = useGetEvent(params.id!)


  if (isPending!) return <><Oval
    height={80}
    width={80}
    color="#4fa94d"
    visible={true}
    ariaLabel="oval-loading"
    secondaryColor="#4fa94d"
    strokeWidth={2}
    strokeWidthSecondary={2}
  /></>
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
